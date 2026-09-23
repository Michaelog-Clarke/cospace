import type { NextFunction, Request, Response } from "express";

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
