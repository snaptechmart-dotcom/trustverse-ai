import mongoose from "mongoose";

const MONGO_URL = process.env.MONGODB_URI;

if (!MONGO_URL) {
  throw new Error("❌ MONGODB_URI missing in .env file");
}

let cached: any = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URL, { dbName: "trustverse" })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
