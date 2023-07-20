// /api/video  endpoint
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
      "anotherjesse/zeroscope-v2-xl:71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f",
      {
        input: {
          prompt: prompt,
        }
      }
    );


    return NextResponse.json(response);
  } catch (error) {
    console.log("[VIDEO_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
