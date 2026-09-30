import { HTTP_STATUS } from "../constants/httpStatus.js";

export class AppError extends Error {
  readonly statusCode: number;
  readonly status: "fail" | "error";
  readonly isOperational = true;
  readonly details: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    this.status =
      statusCode >= HTTP_STATUS.BAD_REQUEST && statusCode < HTTP_STATUS.INTERNAL_SERVER_ERROR
        ? "fail"
        : "error";

    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
