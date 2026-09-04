import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app";

/**
 * Vercel serverless entry point. `vercel.json` rewrites every path to this
 * function; the Express app handles routing, and app.ts lazily establishes the
 * (cached) MongoDB connection on the first `/api/v1` request per warm instance.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  return (app as unknown as (req: VercelRequest, res: VercelResponse) => void)(req, res);
}
