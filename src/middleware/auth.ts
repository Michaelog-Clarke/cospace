import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/unauthorizedError.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    next(new UnauthorizedError());
    return;
  }

  const token = authorizationHeader.replace("Bearer ", "");

  if (token !== "super-secret-key") {
    next(new UnauthorizedError());
    return;
  }

  next();
};
