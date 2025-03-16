import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log("Tentative de connexion avec", credentials?.email);

          const client = await connectToDatabase();
          const db = client.db(process.env.MONGODB_DB);
          const usersCollection = db.collection("users");

          const user = await usersCollection.findOne({ email: credentials?.email });
          console.log("Utilisateur trouvé dans la base de données :", user);

          if (!user) {
            console.log("Utilisateur non trouvé");
            throw new Error("Utilisateur non trouvé");
          }

          const isValidPassword = await bcrypt.compare(credentials?.password || "", user.password);
          console.log("Mot de passe valide :", isValidPassword);

          if (!isValidPassword) {
            console.log("Mot de passe incorrect");
            throw new Error("Mot de passe incorrect");
          }

          console.log("Utilisateur authentifié : ", user);
          return { id: user._id.toString(), name: user.username, email: user.email };
        } catch (error) {
          console.error("Erreur dans l'autorisation : ", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // Persister les informations de l'utilisateur dans le JWT
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };
