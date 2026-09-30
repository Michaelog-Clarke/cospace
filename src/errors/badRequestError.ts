import { AppError } from "../utils/appError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: unknown) {
    super(message, HTTP_STATUS.BAD_REQUEST, details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
