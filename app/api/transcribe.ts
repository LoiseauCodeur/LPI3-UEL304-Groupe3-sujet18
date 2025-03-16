import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import formidable, { File } from "formidable";
import FormData from "form-data";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing the file" });
    }

    const file: File | undefined = Array.isArray(files.audio) ? files.audio[0] : files.audio;
    
    if (!file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    try {
      if (!fs.existsSync(file.filepath)) {
        return res.status(500).json({ error: "File not found on server" });
      }

      const formData = new FormData();
      const filename = file.originalFilename || "audio-file.mp3";

      formData.append("file", fs.createReadStream(file.filepath), {
        filename,
      });
      formData.append("model", "whisper-1");

      const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${(formData as any)._boundary}`, 
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      });

      return res.status(200).json(response.data);

    } catch (error) {
      return res.status(500).json({ error: "Failed to process audio" });
    } finally {
      try {
        fs.unlinkSync(file.filepath);
      } catch (unlinkErr) {
        console.error("Failed to delete file:", unlinkErr);
      }
    }
  });
}
