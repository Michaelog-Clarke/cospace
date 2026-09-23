import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const validateSchema = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: "Validation failed",
        details: result.error.issues.map((issue) => ({
          path: issue.path.length > 0 ? issue.path.join(".") : "body",
          message: issue.message,
        })),
      });
      return;
    }

    const parsedData = result.data;
    req.body = parsedData;
    next();
  };
};

export const validateRequiredFields = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const body = req.body ?? {};
    const missingFields = requiredFields.filter((field) => {
      const value = body[field];
      return value === undefined || value === null || value === "";
    });

    if (missingFields.length > 0) {
      res.status(400).json({
        error: "Missing required fields",
        missingFields,
      });
      return;
    }

    next();
  };
};
