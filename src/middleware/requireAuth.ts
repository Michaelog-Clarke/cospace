import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/unauthorizedError.js";
import { verifyToken } from "../utils/auth.js";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    next(new UnauthorizedError());
    return;
  }

  const token = authorizationHeader.slice("Bearer ".length);
  if (!token) {
    next(new UnauthorizedError());
    return;
  }

  try {
    req.user = verifyToken(token);
  } catch {
    next(new UnauthorizedError());
    return;
  }

  next();
};
