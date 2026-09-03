import { AppError } from "./AppError";

export const validateParams = (params: Record<string, any>, keys: string[]): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const key of keys) {
    const value = params[key];
    if (!value || Array.isArray(value)) throw new AppError(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`, 400);
    result[key] = value;
  }
  return result;
};
