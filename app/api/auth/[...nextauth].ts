import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { connectToDatabase } from "@/lib/mongodb";
import { compare } from "bcryptjs";

export const authOptions = {
    adapter: MongoDBAdapter(connectToDatabase()),
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email", placeholder: "exemple@mail.com" },
          password: { label: "Mot de passe", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials || !credentials.email || !credentials.password) {
            throw new Error("Les identifiants sont requis");
          }
  
          const client = await connectToDatabase();
          const db = client.db(process.env.MONGODB_DB);
          const user = await db.collection("users").findOne({ email: credentials.email });
  
          if (!user) throw new Error("Utilisateur non trouvé");
  
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) throw new Error("Mot de passe incorrect");
  
          return { id: user._id.toString(), email: user.email };
        },
      }),
    ],
    pages: {
      signIn: "/login/page", 
      signOut: "/logout",
      error: "/login",
      newUser: "/signup", 
    },
    session: { strategy: "jwt" as const },
    secret: process.env.NEXTAUTH_SECRET,
  };
  
export default NextAuth(authOptions);
  

