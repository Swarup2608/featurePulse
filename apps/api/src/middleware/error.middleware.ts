import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export const ErrorHandler = (error: Error, _req: Request, res: Response, next: NextFunction) : void => {
    console.error("Error : ",error);

    // Zod Validation with errors
    if (error instanceof ZodError) {
        res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        })),
        });

        return;
  }

  // Custom application errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  // MongoDB duplicate key error
  if ( "code" in error && (error as { code?: number }).code === 11000) {
    res.status(409).json({
      success: false,
      message: "A resource with this value already exists",
    });

    return;
  }

  // Unknown errors
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}