import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import mongoose from "mongoose";

export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const { title, text, finalResponse, score, scenario } = await req.json();

    if (!title || !text || !finalResponse || score === undefined || !scenario) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const conversation = new Conversation({ title, text, finalResponse, score, scenario });
    await conversation.save();

    return NextResponse.json({ success: true, data: conversation }, { status: 201 });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) { 
  try {
    const db = await connectToDatabase(); 

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ success: false, error: "Invalid conversation ID" }, { status: 400 });
      }
      const conversation = await Conversation.findById(id);
      if (!conversation) {
        return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: conversation }, { status: 200 });
    } else {
      const conversations = await Conversation.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: conversations }, { status: 200 });
    }
  } catch (error: any) {
    console.error("❌ GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}



export async function DELETE(req: Request) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid conversation ID" }, { status: 400 });
    }

    const deletedConversation = await Conversation.findByIdAndDelete(id);
    if (!deletedConversation) {
      return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deletedConversation }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
