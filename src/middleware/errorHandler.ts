import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error("Unhandled error:", error);

  if (error instanceof ZodError) {
    const issues = error.issues.map((issue) => ({
      field: issue.path.length > 0 ? issue.path.join(".") : "body",
      message: issue.message,
    }));

    res.status(400).json({
      status: "fail",
      message: "Validation failed",
      errors: issues,
    });
    return;
  }

  const message = error instanceof Error ? error.message : "Internal Server Error";
  res.status(500).json({ error: message });
};
