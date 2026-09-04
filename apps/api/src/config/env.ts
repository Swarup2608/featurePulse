import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";
import { z } from "zod";

dotenv.config();

type JwtExpiresIn = NonNullable<SignOptions["expiresIn"]>;

const jwtExpiresInSchema = z
    .string()
    .trim()
    .regex(
        /^\d+(\.\d+)?\s*(milliseconds?|msecs?|msec|ms|seconds?|secs?|sec|s|minutes?|mins?|min|m|hours?|hrs?|hr|h|days?|day|d|weeks?|week|w|years?|year|yrs?|yr|y)?$/i,
        "JWT expiry must be a valid duration like 15m, 7d, or 3600"
    )
    .transform((value): JwtExpiresIn => value as JwtExpiresIn);

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    PORT: z.coerce.number().default(8000),

    CLIENT_URL: z.string().url().default("http://localhost:3000"),

    MONGODB_URI: z.string().min(1),

    JWT_ACCESS_SECRET: z.string().min(32),

    JWT_REFRESH_SECRET: z.string().min(32),

    JWT_ACCESS_EXPIRES_IN: jwtExpiresInSchema.default("15m"),

    JWT_REFRESH_EXPIRES_IN: jwtExpiresInSchema.default("7d"),

    // Upstash Redis — backs rate limiting and login lockout. Optional locally
    // (limiter degrades to pass-through with a warning); required in production.
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),

    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
}).refine(
    (data) =>
        data.NODE_ENV !== "production" ||
        (Boolean(data.UPSTASH_REDIS_REST_URL) && Boolean(data.UPSTASH_REDIS_REST_TOKEN)),
    {
        message:
            "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required when NODE_ENV=production",
        path: ["UPSTASH_REDIS_REST_URL"],
    }
);

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error(
        "❌ Invalid environment variables:",
        parsedEnv.error.flatten().fieldErrors
    );

    process.exit(1);
}

export const env = parsedEnv.data;
