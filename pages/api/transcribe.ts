import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = formidable({
    uploadDir: "/tmp", 
    keepExtensions: true, 
    multiples: false,
  });
  

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing the file" });
    }

    const file = files.audio as formidable.File;
    if (!file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    try {
      const audioData = fs.createReadStream(file.filepath);

      // Call OpenAI Whisper API
      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: new FormData().append("file", audioData, "audio.webm").append("model", "whisper-1"),
      });

      const data = await response.json();

      if (!data.text) {
        return res.status(500).json({ error: "Failed to transcribe audio" });
      }

      return res.status(200).json({ transcription: data.text });
    } catch (error) {
      return res.status(500).json({ error: "Failed to process audio" });
    } finally {
      fs.unlinkSync(file.filepath); // Delete the temporary file
    }
  });
}
