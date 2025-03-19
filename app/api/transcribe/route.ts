import { NextResponse } from "next/server";
import FormData from "form-data";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No audio file uploaded" }, { status: 400 });
    }

    // Convertir le Blob en un ReadableStream pour l'envoyer à OpenAI
    const buffer = Buffer.from(await file.arrayBuffer());
    const openAiFormData = new FormData();
    openAiFormData.append("file", buffer, "audio-file.mp3");
    openAiFormData.append("model", "whisper-1");

    const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", openAiFormData, {
      headers: {
        ...openAiFormData.getHeaders(),
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    return NextResponse.json(response.data, { status: 200 });

  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.json({ error: "Failed to process audio" }, { status: 500 });
  }
}
