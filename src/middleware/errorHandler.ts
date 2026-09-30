import type { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { AppError } from "../utils/appError.js";

type BodyParserError = SyntaxError & {
  status?: number;
  type?: string;
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (
    error instanceof SyntaxError &&
    (error as BodyParserError).status === HTTP_STATUS.BAD_REQUEST &&
    (error as BodyParserError).type === "entity.parse.failed"
  ) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: "fail",
      message: "Malformed JSON request body",
    });
    return;
  }

  if (error instanceof AppError && error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      details: error.details,
    });
    return;
  }

  console.error("Unhandled error:", error);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "Something went wrong on our end",
  });
};
