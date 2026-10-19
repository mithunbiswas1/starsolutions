// src/lib/db.js
import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const uri = process.env.MONGODB_URL || process.env.MONGODB_URI;

  if (!uri) {
    console.warn("⚠️ MONGODB_URL is not defined in environment variables");
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((instance) => {
      console.log(`✅ MongoDB connected! DB HOST: ${instance.connection.host}`);
      return instance;
    }).catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
