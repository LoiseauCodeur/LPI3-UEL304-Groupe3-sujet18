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
        console.log("Tentative de connexion avec", credentials?.email);
        
        await connectToDatabase();
        const user = await User.findOne({ email: credentials?.email });
      
        if (!user) {
          console.log("Utilisateur non trouvé");
          throw new Error("Utilisateur non trouvé");
        }
      
        const isValidPassword = await bcrypt.compare(credentials?.password || "", user.password);
        if (!isValidPassword) {
          console.log("Mot de passe incorrect");
          throw new Error("Mot de passe incorrect");
        }
      
        console.log("Utilisateur authentifié : ", user);
        return { id: user.id, name: user.username, email: user.email };
      }      
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };
