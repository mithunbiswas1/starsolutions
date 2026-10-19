// src/lib/db.js
import mongoose from "mongoose";
import dns from "dns";

// Ensure Atlas SRV records resolve cleanly on Windows environments
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // fallback to system default
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

function configureDns() {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
  } catch (e) {}
}

export async function connectDB() {
  let uri = process.env.MONGODB_URL || process.env.MONGODB_URI;

  if (!uri) {
    console.warn("⚠️ MONGODB_URL is not defined in environment variables");
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  configureDns();

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((instance) => {
        console.log(`✅ MongoDB connected! DB HOST: ${instance.connection.host}`);
        return instance;
      })
      .catch(async (err) => {
        // If querySrv ECONNREFUSED occurs on local ISP/router DNS, fallback to direct replicaSet
        if (
          err.message &&
          err.message.includes("querySrv") &&
          uri.includes("star-solutions-bd.pb4dlnp.mongodb.net")
        ) {
          console.warn("⚠️ querySrv blocked by local router DNS. Connecting via Atlas direct replicaSet...");
          const directUri =
            "mongodb://skzmithun_db_user:or0pf2JW49QZ5EIF@ac-7jkxf5u-shard-00-00.pb4dlnp.mongodb.net:27017,ac-7jkxf5u-shard-00-01.pb4dlnp.mongodb.net:27017,ac-7jkxf5u-shard-00-02.pb4dlnp.mongodb.net:27017/star-solutions-bd?ssl=true&replicaSet=atlas-p156j7-shard-0&authSource=admin&retryWrites=true&w=majority";
          return mongoose.connect(directUri, opts).then((inst) => {
            console.log(
              `✅ MongoDB connected via Direct ReplicaSet! DB HOST: ${inst.connection.host}`
            );
            return inst;
          });
        }
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
