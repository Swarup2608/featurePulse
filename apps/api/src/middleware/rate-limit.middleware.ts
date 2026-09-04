import { NextFunction, Request, Response } from "express";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "../config/redis";

type Duration = Parameters<typeof Ratelimit.slidingWindow>[1];

interface RateLimiterConfig {
  /** Max requests allowed per window. */
  limit: number;
  /** Window size, e.g. "60 s", "15 m". */
  window: Duration;
  /** Redis key namespace so buckets don't collide. */
  prefix: string;
}

const identify = (req: Request): string => {
  // `trust proxy` is enabled in app.ts, so req.ip is the real client IP on Vercel.
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
};

/**
 * Builds an Express middleware backed by Upstash. When Redis is not configured
 * (local dev / tests) it becomes a pass-through so the app still runs.
 */
export const createRateLimiter = ({ limit, window, prefix }: RateLimiterConfig) => {
  if (!redis) {
    return (_req: Request, _res: Response, next: NextFunction): void => next();
  }

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix,
    analytics: false,
  });

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { success, limit: max, remaining, reset } = await ratelimit.limit(identify(req));

      res.setHeader("RateLimit-Limit", max);
      res.setHeader("RateLimit-Remaining", Math.max(0, remaining));
      res.setHeader("RateLimit-Reset", Math.ceil((reset - Date.now()) / 1000));

      if (!success) {
        res.setHeader("Retry-After", Math.ceil((reset - Date.now()) / 1000));
        res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later.",
        });
        return;
      }

      next();
    } catch (error) {
      // Fail open on limiter/infrastructure errors rather than taking the API down.
      console.error("Rate limiter error:", error);
      next();
    }
  };
};

/** Broad limiter for the whole API surface. */
export const apiRateLimiter = createRateLimiter({
  limit: 100,
  window: "60 s",
  prefix: "rl:api",
});

/** Strict limiter for unauthenticated auth endpoints (brute-force defense). */
export const authRateLimiter = createRateLimiter({
  limit: 10,
  window: "60 s",
  prefix: "rl:auth",
});
