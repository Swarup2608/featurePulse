import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { env } from "../config/env";

interface RefreshTokenPayload extends JwtPayload {
  userId: string;
}

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);

  if (typeof decoded === "string" || !("userId" in decoded)) {
    throw new Error("Invalid refresh token");
  }

  return decoded as RefreshTokenPayload;
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
