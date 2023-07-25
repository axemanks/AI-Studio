import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";

export const GET = async (req: NextRequest, res: NextResponse) => {
  console.log("/api/chat endpoint hit with GET");
  return NextResponse.json({ message: "Success", status: 200 });
};

const chat = new ChatOpenAI({ temperature: 0 });
// receives message string from request
export const POST = async (req: Request, res: NextResponse) => {
  // Parse the request body as a JSON object
  const { message } = await req.json();

  // Log the actual message text
  console.log("Message from frontend", message);

  // Send the message to OpenAI
  const response = await chat.call([new HumanMessage(message)]);
  // console the response for testing
  console.log("Response from OpenAI", typeof response, response.text);

  // convert response to json object and send to front
  return NextResponse.json({ message: response.content, status: 200 });
};