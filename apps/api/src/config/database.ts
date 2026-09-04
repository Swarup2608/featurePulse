import mongoose from "mongoose";
import { env } from "./env";

/**
 * Serverless-safe connection helper.
 *
 * On Vercel the API runs as a serverless function: a single process is reused
 * across many invocations ("warm" starts) and there is no long-lived boot phase.
 * We therefore cache the connection promise on the module scope so concurrent
 * invocations share one connection pool, and we never call `process.exit` on
 * failure — the invocation should surface a 5xx and let the platform retry.
 */
const connectionOptions: mongoose.ConnectOptions = {
  // Keep the pool small; serverless spreads load across many instances.
  maxPoolSize: 10,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 45000,
  // Indexes are managed explicitly in production; see syncIndexes() below.
  autoIndex: env.NODE_ENV !== "production",
};

let connectionPromise: Promise<typeof mongoose> | null = null;

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
  connectionPromise = null;
});
mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

export const connectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return;

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.MONGODB_URI, connectionOptions)
      .then((m) => {
        console.log(`MongoDB connected: ${m.connection.name}`);
        return m;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  await connectionPromise;
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.disconnect();
  connectionPromise = null;
};
