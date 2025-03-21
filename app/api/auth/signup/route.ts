import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { MongoClient, Db } from "mongodb";

export async function connectToDatabase(): Promise<MongoClient> {
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  return client;
}

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const client = await connectToDatabase();
    const db: Db = client.db(process.env.MONGODB_DB); 
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }],
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

    return NextResponse.json({ message: "Inscription réussie" }, { status: 201 });
  } catch (error) {
    console.error("Erreur API signup:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
