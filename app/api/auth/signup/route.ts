import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const client = await connectToDatabase();
    const db = client.db("304");
    const usersCollection = db.collection("users");

    const { username, email, password } = await req.json();
    
    const existingUser = await usersCollection.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return NextResponse.json({ error: "Utilisateur déjà existant" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await usersCollection.insertOne({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    if (!result.acknowledged) {
      throw new Error("Erreur lors de l'insertion dans la base de données");
    }

    return NextResponse.redirect(new URL("/login", req.url));
  } catch (error) {
    console.error("Erreur API signup:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
