import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI as string;
const MONGODB_DB = process.env.MONGODB_DB as string;

if (!MONGODB_URI) {
  throw new Error("Veuillez définir la variable d'environnement MONGODB_URI !");
}

let cached = (global as any).mongoose || { conn: null, promise: null };
let cachedClient: MongoClient | null = null;

export async function connectToDatabase(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = new MongoClient(MONGODB_URI);
  await cachedClient.connect();
  return cachedClient;
}
