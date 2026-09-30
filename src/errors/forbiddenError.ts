import { AppError } from "../utils/appError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, HTTP_STATUS.FORBIDDEN);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
