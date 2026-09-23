import type { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error("Unhandled error:", error);

  const message = error instanceof Error ? error.message : "Internal Server Error";
  res.status(500).json({ error: message });
};
