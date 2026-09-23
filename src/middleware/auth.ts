import type { NextFunction, Request, Response } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authorizationHeader.replace("Bearer ", "");

  if (token !== "super-secret-key") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
};
