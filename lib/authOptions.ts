import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import mongoose from "mongoose";
import { compare } from "bcryptjs";

async function connectToDatabase() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_DB,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Les identifiants sont requis");
        }

        await connectToDatabase();
        const db = mongoose.connection.db;
        const user = await db.collection("users").findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Utilisateur non trouvé");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Mot de passe incorrect");
        }

        return { id: user._id.toString(), email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/logout",
    newUser: "/signup",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
