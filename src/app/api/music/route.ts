// /api/music  endpoint
// uses replicate
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});



export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;
    // no userId
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // no prompt
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    // Check if on Free Plan
    const freeTrial = await checkApiLimit();
    // Check if Pro
    const isPro = await checkSubscription();
    // if no free trial left and not on pro then return 403
    if (!freeTrial && !isPro) {
      return new NextResponse("Free Trial Expired", { status: 403 });
    };
    if(!isPro){
    await increaseApiLimit();
    }


    // call replicate
    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt,
        }
      }
    );


    return NextResponse.json(response);
  } catch (error) {
    console.log("[MUSIC_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
