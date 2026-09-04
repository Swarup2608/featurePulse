import { Redis } from "@upstash/redis";
import { env } from "./env";

/**
 * Shared Upstash Redis client. Backs rate limiting (see rate-limit.middleware.ts)
 * and login lockout (see auth.service.ts). Returns `null` when Upstash is not
 * configured so local development and tests keep working; env.ts already forces
 * both variables to be present when NODE_ENV=production.
 */
export const redis =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

if (!redis) {
  console.warn(
    "⚠️  Upstash Redis not configured — rate limiting and login lockout are disabled (development only)."
  );
}
