import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { env } from "../config/env";

export const generateAccessToken = (
  userId: Types.ObjectId
): string => {
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