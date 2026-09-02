import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { env } from "../config/env";
import { AppError } from "./AppError";

interface RefreshTokenPayload extends JwtPayload {
  userId: string;
}

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);

    if (typeof decoded === "string" || !("userId" in decoded)) {
      throw new AppError("Invalid refresh token", 401);
    }

    return decoded as RefreshTokenPayload;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Refresh token expired", 401);
    }

    throw new AppError("Invalid refresh token", 401);
  }
};

export const generateAccessToken = (userId: Types.ObjectId): string => {
  return jwt.sign(
    {
      userId: userId.toString(),
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    }
  );
};

export const generateRefreshToken = (
  userId: Types.ObjectId
): string => {
  return jwt.sign(
    {
      userId: userId.toString(),
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    }
  );
};
