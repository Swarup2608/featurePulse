import cors from "cors";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { CSRF_HEADER_NAME } from "./config/cookies";
import { csrfProtection } from "./middleware/csrf.middleware";
import { apiRateLimiter } from "./middleware/rate-limit.middleware";
import { ErrorHandler } from "./middleware/error.middleware";

// Routers Import
import authRoutes from "./modules/auth/auth.routes";
import projectRoutes from "./modules/projects/project.routes";
import featureRoutes from "./modules/features/feature.route";
import eventRoutes from "./modules/events/event.routes";
import featureEventRoutes from "./modules/feature-events/feature-event.routes";
import eventSourceRoutes from "./modules/event-sources/event-source.routes";
import apiKeyRoutes from "./modules/api-keys/api-key.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";

const app = express();

// Behind Vercel's proxy: trust the first hop so req.ip / req.protocol are correct.
app.set("trust proxy", 1);

// Security headers + a locked-down CSP (this API only ever serves JSON).
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: "same-site" },
    referrerPolicy: { policy: "no-referrer" },
  })
);

// Security: Limit request payload size to prevent abuse
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ limit: "10kb", extended: true }));

// Security: CORS — single trusted origin, credentials enabled for cookie auth.
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", CSRF_HEADER_NAME],
  })
);

// Security: Cookie parsing
app.use(cookieParser());

// Health check endpoint (no CSRF / rate limit).
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "FeaturePulse API is running",
  });
});

// Ensure the (cached) database connection before handling API traffic. On Vercel
// this runs per invocation; the helper is idempotent and reuses warm pools.
app.use("/api/v1/", (_req, res, next) => {
  connectDatabase().then(next).catch(next);
});

// Rate limiting + CSRF for the whole API surface.
app.use("/api/v1/", apiRateLimiter);
app.use("/api/v1/", csrfProtection);

// CSRF bootstrap: hand the double-submit token to the web client.
app.get("/api/v1/csrf", (_req, res) => {
  res.status(200).json({ success: true, data: { csrfToken: res.locals.csrfToken } });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/organizations/:organizationId/projects", projectRoutes);
app.use("/api/v1/organizations/:organizationId/projects/:projectId/features", featureRoutes);
app.use("/api/v1/organizations/:organizationId/projects/:projectId/events", eventRoutes);
app.use("/api/v1/organizations/:organizationId/projects/:projectId/features/:featureId/events", featureEventRoutes);
app.use("/api/v1/organizations/:organizationId/projects/:projectId/event-sources", eventSourceRoutes);
app.use("/api/v1/organizations/:organizationId/projects/:projectId/event-sources/:eventSourceId/api-keys", apiKeyRoutes);
app.use("/api/v1/organizations/:organizationId/projects/:projectId/analytics", analyticsRoutes);

// Error middleware MUST come after routes
app.use(ErrorHandler);

export default app;
