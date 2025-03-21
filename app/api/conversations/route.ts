import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { title, text, finalResponse, score, scenario } = await req.json();

    if (!title || !text || !finalResponse || score === undefined || !scenario) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const conversation = new Conversation({ 
      title, 
      text, 
      finalResponse, 
      score, 
      scenario, 
      userEmail: session.user.email,
    });

    await conversation.save();

    return NextResponse.json({ success: true, data: conversation }, { status: 201 });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) { 
  await connectToDatabase();
  
  try {
    // const session = await getServerSession(authOptions);
    const session = await getServerSession();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode");

    let query: any = { userEmail: session.user.email };

    if (mode) {
      query.scenario = mode;
    }

    const conversations = await Conversation.find(query)
      .sort({ createdAt: -1 })
      .select("title text finalResponse score scenario createdAt userEmail"); 


    return NextResponse.json({ success: true, data: conversations }, { status: 200 });
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
