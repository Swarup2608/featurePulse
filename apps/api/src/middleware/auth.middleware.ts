import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

interface AccessTokenPayload extends JwtPayload {
  userId: string;
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    let accessToken: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) { accessToken = authHeader.substring(7); } else { accessToken = req.cookies?.accessToken; }
    if (!accessToken) { next(new AppError("Authentication required!", 401)); return; }
    const decoded = jwt.verify(accessToken, env.JWT_ACCESS_SECRET);
    if (typeof decoded === "string" || !("userId" in decoded)) { next(new AppError("Invalid access token!", 401)); return; }
    const payload = decoded as AccessTokenPayload;
    req.userId = payload.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) { next(new AppError("Access token expired!", 401)); return; }
    next(new AppError("Invalid access token!", 401));
  }
};