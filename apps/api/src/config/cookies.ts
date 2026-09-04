import { CookieOptions } from "express";
import { env } from "./env";

/**
 * The web app and the API are deployed as separate Vercel projects on different
 * origins, so auth cookies are sent cross-site. That requires `SameSite=None`
 * with `Secure`. Any Vercel deployment (preview or production) is HTTPS, so we
 * also treat `process.env.VERCEL` as production — this keeps the `Secure` flag
 * from silently depending on `NODE_ENV` being set correctly (see S9).
 *
 * Locally, the web app and API are same-site (`localhost` on different ports),
 * so `SameSite=Lax` over plain HTTP works without TLS.
 */
const isProduction = env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

const sameSite: CookieOptions["sameSite"] = isProduction ? "none" : "lax";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite,
};

export const accessTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 15 * 60 * 1000,
};

export const refreshTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  // Scope the refresh cookie to the refresh endpoint so it is not sent on every
  // request.
  path: "/api/v1/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const CSRF_COOKIE_NAME = "csrfToken";
export const CSRF_HEADER_NAME = "x-csrf-token";

/**
 * The CSRF cookie is readable by the API only (httpOnly). The matching token is
 * delivered to the browser in the body of `GET /api/v1/csrf` and held in memory
 * by the web client, which echoes it back in the `X-CSRF-Token` header
 * (double-submit). httpOnly is safe here because the client never needs to read
 * the cookie itself.
 */
export const csrfCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 24 * 60 * 60 * 1000,
};
