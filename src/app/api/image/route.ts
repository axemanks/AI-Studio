// /api/image endpoint
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  try {
    const { userId } = auth(); // get userId
    const body = await req.json(); // get body
    const { prompt, amount = 1, resolution = "512x512" } = body; // set prompt
    // no userId
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // no apiKey
    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not found", { status: 500 });
    }
    // no messages
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }
    // amount
    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }
    // Resolution
    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }
    // Check of on Free Plan - 403 if no free trial
    const freeTrial = await checkApiLimit();
    if (!freeTrial) {
      return new NextResponse("Free Trial Expired", { status: 403 });
    };
    await increaseApiLimit();
    const response = await openai.createImage({
      prompt,
      n: parseInt(amount, 10), // have to parse the amount to an integer
      size: resolution,
    });

    return NextResponse.json(response.data.data);
  } catch (error) {
    console.log("[Image_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
