import { HTTP_STATUS } from "../constants/httpStatus.js";
import { AppError } from "../utils/appError.js";

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, HTTP_STATUS.CONFLICT);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
