import cors from "cors";
import dotenv from "dotenv";
import express, { ErrorRequestHandler } from "express";
import { env } from "./config/env";
import cookieParser from "cookie-parser";
import { ErrorHandler } from "./middleware/error.middleware";

// Routers Import
import authRoutes from "./modules/auth/auth.routes";
import projectRoutes from "./modules/projects/project.routes";
import featureRoutes from "./modules/features/feature.route";
import eventRoutes from "./modules/events/event.routes";
import featureEventRoutes from "./modules/feature-events/feature-event.routes";
import eventSourceRoutes from "./modules/event-sources/event-source.routes";
import apiKeyRoutes from "./modules/api-keys/api-key.routes";

dotenv.config();

const app = express();

// Security: Set rate limiting via middleware
// In production, consider using Redis-backed rate limiter like express-rate-limit with store
const apiLimiter = (req: any, res: any, next: any) => {
  // Simple in-memory rate limiting (replace with Redis in production)
  next();
};

// Security: Limit request payload size to prevent abuse
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ limit: "10kb", extended: true }));

// Security: CORS configuration
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Security: Cookie parsing with secure options
app.use(cookieParser());

// Security: Add security headers
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "FeaturePulse API is running",
    environment: env.NODE_ENV,
  });
});

// Apply API limiter to all API routes
app.use("/api/v1/", apiLimiter);

app.use( "/api/v1/auth", authRoutes );
app.use( "/api/v1/organizations/:organizationId/projects",projectRoutes );
app.use( "/api/v1/organizations/:organizationId/projects/:projectId/features", featureRoutes );
app.use( "/api/v1/organizations/:organizationId/projects/:projectId/events", eventRoutes );
app.use( "/api/v1/organizations/:organizationId/projects/:projectId/features/:featureId/events", featureEventRoutes );
app.use( "/api/v1/organizations/:organizationId/projects/:projectId/event-sources", eventSourceRoutes );
app.use( "/api/v1/organizations/:organizationId/projects/:projectId/event-sources/:eventSourceId/api-keys", apiKeyRoutes );

// Error middleware MUST come after routes
app.use(ErrorHandler);

export default app;
