import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import Conversation, { IConversation } from "../../models/Conversation";

interface ApiResponse {
  success: boolean;
  data?: IConversation | IConversation[];
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const { title, text, finalResponse, score, scenario } = req.body;
      const conversation = new Conversation({ title, text, finalResponse, score, scenario });
      await conversation.save();
      return res.status(201).json({ success: true, data: conversation });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  if (req.method === "GET") {
    try {
      const conversations = await Conversation.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: conversations });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  res.status(405).json({ success: false, error: "Method Not Allowed" });
}
