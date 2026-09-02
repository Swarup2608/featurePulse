import { Request, Response } from "express";

import { registerSchema, loginSchema } from "./auth.validation";
import { registerUser, loginUser, getCurrentUser, refreshAccessToken } from "./auth.service";
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

export const loginController = async(req: Request, res: Response) : Promise<void> => {
    try{
        const validatedData = loginSchema.parse(req.body);

        const result = await loginUser(validatedData);

        res.cookie("refreshToken",result.tokens.refreshToken,{
            httpOnly: true,
            secure: env.NODE_ENV == "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success : true,
            message: "Login Successful",
            data: {
                user: result.user,
                organization: result.organization,
                accessToken: result.tokens.accessToken
            }
        });
    }
    catch(error){
        if(error instanceof Error){
            res.status(401).json({
                success: false,
                message: error.message
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });

    }
}

export const getMeController = async(req: Request, res: Response) : Promise<void> => {
    try{
        if(!req.userId){
            res.status(401).json({
                success: false,
                message: "Authentication Required!"
            });
            return;
        }
        const user = await getCurrentUser(req.userId);
        console.log(user);
        res.status(200).json({
            success: true,
            data:{
                user
            }
        });
    }
    catch(error){
        if(error instanceof Error){
            res.status(404).json({
                success: false,
                message: error.message
            });
            return;
        }
        res.status(501).json({
            success: false,
            message: "Internal server Error!"
        });
    }
}

export const refreshAccessTokenController = async (req: Request, res: Response) : Promise<void> => {
    try{
        const refreshToken = req.cookies?.refreshToken;
        if(!refreshToken){
            res.status(401).json({
                success: false,
                message: "Refresh token not found",
            });

            return;
        }

        const result = await refreshAccessToken(refreshToken);

        res.status(200).json({
            success: true,
            message: "Access token refreshed!",
            data: {
                accessToken: result.accessToken
            }
        });
    }
    catch(error){
        if(error instanceof Error){
            res.status(404).json({
                success: false,
                message: error.message
            });
            return;
        }
        res.status(501).json({
            success: false,
            message: "Internal server Error!"
        });
    }
}

export const logoutController = async (req: Request, res: Response) : Promise<void> => {
    res.clearCookie("refreshToken",{
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax"
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully!"
    })
}