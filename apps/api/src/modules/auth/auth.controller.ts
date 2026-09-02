import { Request, Response } from "express";

import { registerSchema, loginSchema } from "./auth.validation";
import { registerUser, loginUser, getCurrentUser, refreshAccessToken } from "./auth.service";
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";

export const registerController = async (req: Request, res: Response): Promise<void> => {
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
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
    const validatedData = loginSchema.parse(req.body);
    const result = await loginUser(validatedData);

    res.cookie("refreshToken", result.tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        success: true,
        message: "Login Successful",
        data: {
            user: result.user,
            organization: result.organization,
            accessToken: result.tokens.accessToken,
        },
    });
};

export const getMeController = async (req: Request, res: Response): Promise<void> => {
    if (!req.userId) {
        throw new AppError("Authentication required", 401);
    }

    const user = await getCurrentUser(req.userId);

    res.status(200).json({
        success: true,
        data: {
            user,
        },
    });
};

export const refreshAccessTokenController = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        throw new AppError("Refresh token not found", 401);
    }

    const result = await refreshAccessToken(refreshToken);

    res.status(200).json({
        success: true,
        message: "Access token refreshed!",
        data: {
            accessToken: result.accessToken
        },
    });
};

export const logoutController = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully!",
    });
};
