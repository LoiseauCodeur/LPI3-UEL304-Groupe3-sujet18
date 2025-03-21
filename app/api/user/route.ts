import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

async function connectToDatabase() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_DB,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email manquant" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email }, "username createdAt");

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l’utilisateur :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
