import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

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

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();

    if (!email || !username || !password) {
      return NextResponse.json({ error: "Les champs sont manquants" }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "L'utilisateur existe déjà" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    return NextResponse.json({ message: "Utilisateur créé avec succès" }, { status: 201 });
  } catch (error) {
    console.error("❗ Erreur lors de l'enregistrement de l'utilisateur :", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
