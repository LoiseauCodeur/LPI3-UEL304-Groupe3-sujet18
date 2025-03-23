import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

async function connectToDatabase() {
  if (!mongoose.connection.readyState) {
    try {
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: process.env.MONGODB_DB,
      });
    } catch (error) {
      console.error("❗ Erreur lors de la connexion à MongoDB :", error);
      throw new Error("Échec de la connexion à la base de données");
    }
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
    console.error("❗ Erreur lors de la récupération de l’utilisateur :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
