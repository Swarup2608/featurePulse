import { Request, Response } from "express";

import { registerSchema } from "./auth.validation";
import { registerUser } from "./auth.service";
import { env } from "../../config/env";

export const registerController = async(req: Request, res: Response): Promise<void> => {
    try{
        const validatedData = registerSchema.parse(req.body);
        const result = await registerUser(validatedData);

         res.cookie("refreshToken", result.tokens.refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: {
                user: result.user,
                organization: result.organization,
                accessToken: result.tokens.accessToken,
            },
        });
    }
    catch(err){
        if(err instanceof Error){
            res.status(400).json({
                success: false,
                message: err.message,
            });

            return;
        }
        res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}