import cors from "cors";
import dotenv from "dotenv";
import express, { ErrorRequestHandler } from "express";
import { env } from "./config/env";

// Routers Import
import authRoutes from "./modules/auth/auth.routes";
import projectRoutes from "./modules/projects/project.routes";
import featureRoutes from "./modules/features/feature.route";
import eventRoutes from "./modules/events/event.routes";
import featureEventRoutes from "./modules/feature-events/feature-event.routes";
import eventSourceRoutes from "./modules/event-sources/event-source.routes";
import apiKeyRoutes from "./modules/api-keys/api-key.routes";

import cookieParser from "cookie-parser";
import { ErrorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);

app.use(express.json());

app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "FeaturePulse API is running",
    environment: env.NODE_ENV
  });
});

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
