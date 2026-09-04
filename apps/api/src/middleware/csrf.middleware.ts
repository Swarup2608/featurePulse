import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
  csrfCookieOptions,
} from "../config/cookies";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const allowedOrigins = new Set([env.CLIENT_URL]);

const timingSafeEqual = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

/**
 * Stateless CSRF protection for the cookie-based session.
 *
 * 1. Every response carries a `csrfToken` cookie (httpOnly, SameSite matches the
 *    auth cookies). `GET /api/v1/csrf` returns the same value in its body for the
 *    web client to hold in memory.
 * 2. State-changing requests must echo that value in the `X-CSRF-Token` header
 *    (double-submit) AND, when an `Origin` header is present, it must be on the
 *    allow-list. A cross-site form POST can do neither.
 */
export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let token: string | undefined = req.cookies?.[CSRF_COOKIE_NAME];

  if (!token) {
    token = crypto.randomBytes(32).toString("hex");
    res.cookie(CSRF_COOKIE_NAME, token, csrfCookieOptions);
  }

  res.locals.csrfToken = token;

  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }

  const origin = req.get("origin");
  if (origin && !allowedOrigins.has(origin)) {
    res.status(403).json({ success: false, message: "Cross-origin request blocked" });
    return;
  }

  const headerToken = req.get(CSRF_HEADER_NAME);
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];

  if (!headerToken || !cookieToken || !timingSafeEqual(headerToken, cookieToken)) {
    res.status(403).json({
      success: false,
      message: "Invalid or missing CSRF token. Fetch GET /api/v1/csrf first.",
    });
    return;
  }

  next();
};
