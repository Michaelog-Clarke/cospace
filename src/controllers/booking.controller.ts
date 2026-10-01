import type { NextFunction, Request, Response } from "express";

import { BadRequestError } from "../errors/badRequestError.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { createBookingSchema, updateBookingSchema } from "../schemas/booking.schema.js";
import {
  type BookingInput,
  type BookingUpdateInput,
} from "../repositories/booking.repository.js";
import { BookingService } from "../services/booking.service.js";
import type { ZodType } from "zod";

const parseQueryInteger = (value: unknown, fallback: number): number => {
  const queryValue = Array.isArray(value) ? value[0] : value;

  if (typeof queryValue !== "string") {
    return fallback;
  }

  const parsedValue = Number.parseInt(queryValue, 10);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const parseBookingId = (value: unknown): number => {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    throw new BadRequestError("Invalid booking id");
  }

  const id = Number(value);
  if (!Number.isSafeInteger(id)) {
    throw new BadRequestError("Invalid booking id");
  }

  return id;
};

const parseRequestBody = <T>(schema: ZodType<T>, body: unknown): T => {
  const result = schema.safeParse(body);

  if (!result.success) {
    throw new BadRequestError(
      "Validation failed",
      result.error.issues.map((issue) => ({
        path: issue.path.length > 0 ? issue.path.join(".") : "body",
        message: issue.message,
      })),
    );
  }

  return result.data;
};

const toBookingUpdateInput = (
  body: ReturnType<typeof updateBookingSchema.parse>,
): BookingUpdateInput => ({
  ...(body.user_id !== undefined ? { user_id: body.user_id } : {}),
  ...(body.desk_id !== undefined ? { desk_id: body.desk_id } : {}),
  ...(body.booking_date !== undefined ? { booking_date: body.booking_date } : {}),
  ...(body.active !== undefined ? { active: body.active } : {}),
});

export class BookingController {
  constructor(
    private readonly bookingService: BookingService = new BookingService(),
  ) {}

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseQueryInteger(req.query.page, 1);
      const limit = parseQueryInteger(req.query.limit, 10);

      const bookings = await this.bookingService.getPaginatedShifts(page, limit);

      res.status(HTTP_STATUS.OK).json(bookings);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookingId = parseBookingId(req.params.id);
      const booking = await this.bookingService.findById(bookingId);

      if (!booking) {
        throw new NotFoundError("Booking not found");
      }

      res.status(HTTP_STATUS.OK).json(booking);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: BookingInput = parseRequestBody(createBookingSchema, req.body);
      const booking = await this.bookingService.create(data);
      res.status(HTTP_STATUS.CREATED).json(booking);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookingId = parseBookingId(req.params.id);
      const parsedBody = parseRequestBody(updateBookingSchema, req.body);
      const data = toBookingUpdateInput(parsedBody);
      const booking = await this.bookingService.update(bookingId, data);

      res.status(HTTP_STATUS.OK).json(booking);
    } catch (error) {
      next(error);
    }
  };

  replace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookingId = parseBookingId(req.params.id);
      const data: BookingUpdateInput = parseRequestBody(createBookingSchema, req.body);
      const booking = await this.bookingService.update(bookingId, data);

      res.status(HTTP_STATUS.OK).json(booking);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookingId = parseBookingId(req.params.id);
      await this.bookingService.delete(bookingId);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };
}
