import fs from "fs";
import formidable from "formidable";
import FormData from "form-data";
import axios from 'axios';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log("🔹 API /api/transcribe hit!");

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ Formidable error:", err);
      return res.status(500).json({ error: "Error parsing the file" });
    }

    console.log("✅ File parsed successfully:", files);

    const file = Array.isArray(files.audio) ? files.audio[0] : files.audio;
    if (!file) {
      console.error("❌ No file received.");
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    console.log("📂 File received:", {
      filepath: file.filepath,
      originalFilename: file.originalFilename,
      mimetype: file.mimetype,
      size: file.size,
    });

    try {
      if (!fs.existsSync(file.filepath)) {
        console.error("❌ File does not exist:", file.filepath);
        return res.status(500).json({ error: "File not found on server" });
      }

      const formData = new FormData();
      const filename = file.originalFilename || "audio-file.mp3";

      formData.append("file", fs.createReadStream(file.filepath), {
        filename,
      });
      formData.append("model", "whisper-1");

      console.log("🚀 Sending audio to OpenAI Whisper...");
      console.log("📝 Headers:", formData.getHeaders());

      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      });

      console.log("✅ Whisper API response:", response.data);
      return res.status(200).json(response.data);

    } catch (error) {
      console.error("❌ Error processing audio:", error);
      return res.status(500).json({ error: "Failed to process audio" });
    } finally {
      try {
        fs.unlinkSync(file.filepath);
        console.log("🗑️ Temporary file deleted:", file.filepath);
      } catch (unlinkErr) {
        console.error("⚠️ Error deleting temp file:", unlinkErr);
      }
    }
  });
}
