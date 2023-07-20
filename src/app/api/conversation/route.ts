// /api/conversation endpoint
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;
    // no userId
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // no apiKey
    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not found", { status: 500 });
    }
    // no messages
    if (!messages) {
      return new NextResponse("Messages not found", { status: 400 });
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
    

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });
    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
