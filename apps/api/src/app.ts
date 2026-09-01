import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { env } from "./config/env";
import authRoutes from "./modules/auth/auth.routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "FeaturePulse API is running",
    environment: env.NODE_ENV
  });
});

app.use("/api/v1/auth", authRoutes);

export default app;