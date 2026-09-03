import { Request, Response } from "express";
import { registerSchema, loginSchema } from "./auth.validation";
import { registerUser, loginUser, getCurrentUser, refreshAccessToken } from "./auth.service";
import { AppError } from "../../utils/AppError";
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../../config/cookies";

export const registerController = async (req: Request, res: Response): Promise<void> => {
  const validatedData = registerSchema.parse(req.body);
  const result = await registerUser(validatedData);
  res.cookie("accessToken", result.tokens.accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", result.tokens.refreshToken, refreshTokenCookieOptions);
  res.status(201).json({
    success: true,
    message: "User registered successfully!",
    data: { user: result.user, organization: result.organization },
  });
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  const validatedData = loginSchema.parse(req.body);
  const result = await loginUser(validatedData);
  res.cookie("accessToken", result.tokens.accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", result.tokens.refreshToken, refreshTokenCookieOptions);
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user: result.user, organization: result.organization },
  });
};

export const getMeController = async (req: Request, res: Response): Promise<void> => {
  if (!req.userId) throw new AppError("Authentication required", 401);
  const authData = await getCurrentUser(req.userId);
  res.status(200).json({ success: true, data: authData });
};

export const refreshAccessTokenController = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new AppError("Refresh token not found", 401);
  const result = await refreshAccessToken(refreshToken);
  res.cookie("accessToken", result.accessToken, accessTokenCookieOptions);
  res.status(200).json({ success: true, message: "Access token refreshed!" });
};

export const logoutController = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie("accessToken", accessTokenCookieOptions);
  res.clearCookie("refreshToken", refreshTokenCookieOptions);
  res.status(200).json({ success: true, message: "Logged out successfully!" });
};