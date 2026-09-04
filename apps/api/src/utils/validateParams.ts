import { AppError } from "./AppError";

export const validateParams = (params: Record<string, any>, keys: string[]): Record<string, string> => {
  for (const key of keys) {
    const value = params[key];
    if (!value || Array.isArray(value)) {
      throw new AppError(`Missing required URL parameter: ${key}`, 400);
    }
  }
  return params as Record<string, string>;
};
