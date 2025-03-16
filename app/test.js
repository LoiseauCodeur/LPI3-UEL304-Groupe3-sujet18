import { connectToDatabase } from "../lib/mongodb";
import User from "../models/User";
import bcrypt from "bcryptjs";

async function insertUser() {
  await connectToDatabase();
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = new User({
    username: "testUser",
    email: "test@example.com",
    password: hashedPassword,
  });

  await user.save();
  console.log("✅ Utilisateur ajouté !");
}

insertUser().catch(console.error);
