import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

interface AccessTokenPayload extends JwtPayload {
    userId: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            next(new AppError("Authentication required!", 401));
            return;
        }
        const [scheme, token] = authorizationHeader.split(" ");
        if (scheme !== "Bearer" || !token) {
            next(new AppError("Invalid authorization header", 401));
            return;
        }

        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

        if (typeof decoded === "string" || !("userId" in decoded)) {
            next(new AppError("Invalid access token!", 401));
            return;
        }

        const payload = decoded as AccessTokenPayload;
        req.userId = payload.userId;
        next();

    }
    catch(error) {
        if (error instanceof jwt.TokenExpiredError) {
            next(new AppError("Access token expired!", 401));
            return;
        }

        next(new AppError("Invalid access token!", 401));
    }
};
