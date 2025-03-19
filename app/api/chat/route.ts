import { NextResponse } from "next/server";
import prompts from "@/config/prompts"; 

export async function POST(req: Request) {
  try {
    const { input, promptKey } = await req.json();

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const prompt = promptKey && prompts[promptKey] ? prompts[promptKey] : "generic";

    const messages = [
      { role: "system", content: prompt },
      { role: "user", content: input },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      return NextResponse.json({ error: "No response from OpenAI" }, { status: 500 });
    }

    return NextResponse.json({ reply: data.choices[0].message.content }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
