import { AppError } from "../utils/appError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, HTTP_STATUS.NOT_FOUND);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
