import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

interface AccessTokenPayload extends JwtPayload{
    userId: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) :  void => {
    try {
        const authorizationHeader = req.headers.authorization;

        if(!authorizationHeader){
            res.status(401).json({
                success: false,
                message: "Authentication required!"
            });

            return;
        }
        const [scheme, token] = authorizationHeader.split(" ");
        if(scheme !== "Bearer" || !token){
            res.status(401).json({
                success: false,
                message: "Invalid authorization header",
            });

            return;
        }

        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

        if(typeof decoded === "string" || !("userId" in decoded)){
            res.status(401).json({
                success: false,
                message: "Invalid access token!",
            });

            return;
        }

        const payload = decoded as AccessTokenPayload;
        req.userId = payload.userId;
        next();

    }
    catch(error){
        if(error instanceof jwt.TokenExpiredError){
            res.status(401).json({
                success: false,
                message: "Access token expired!"
            })
            
            return;
        }

        res.status(401).json({
            success: false,
            message: "Invalid access token!"
        });
    }
}