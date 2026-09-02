import { NextFunction, Request, Response, RequestHandler, } from "express";

export const asyncHandler = (
  fn: ( req: Request, res: Response, next: NextFunction ) => Promise<void> ): RequestHandler => {
    return ( req: Request, res: Response, next: NextFunction ) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};