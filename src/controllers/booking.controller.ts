import type { NextFunction, Request, Response } from "express";

import { BadRequestError } from "../errors/badRequestError.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { BookingRepository, type BookingInput } from "../repositories/booking.repository.js";
import type { BookingWithId } from "../schemas/booking.schema.js";
import { BookingService } from "../services/booking.service.js";

const parseQueryInteger = (value: unknown, fallback: number): number => {
  const queryValue = Array.isArray(value) ? value[0] : value;

  if (typeof queryValue !== "string") {
    return fallback;
  }

  const parsedValue = Number.parseInt(queryValue, 10);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const defaultBookings: BookingWithId[] = [
  { id: "1", desk: "A1", floor: "Floor 1", date: "2026-09-22", active: true },
  { id: "2", desk: "B4", floor: "Floor 2", date: "2026-09-23", active: false },
  { id: "3", desk: "C7", floor: "Floor 3", date: "2026-09-24", active: true },
];

export class BookingController {
  constructor(
    private readonly bookingService: BookingService = new BookingService(
      new BookingRepository(defaultBookings),
    ),
  ) {}

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseQueryInteger(req.query.page, 1);
      const limit = parseQueryInteger(req.query.limit, 10);

      const bookings = this.bookingService.getPaginatedShifts(page, limit);

      res.status(HTTP_STATUS.OK).json(bookings);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookingId = req.params.id;

      if (typeof bookingId !== "string") {
        throw new BadRequestError("Invalid booking id");
      }

      const booking = this.bookingService.findById(bookingId);

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
      const booking = this.bookingService.create(req.body as BookingInput);
      res.status(HTTP_STATUS.CREATED).json(booking);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookingId = req.params.id;

      if (typeof bookingId !== "string") {
        throw new BadRequestError("Invalid booking id");
      }

      const booking = this.bookingService.update(bookingId, req.body as Partial<BookingInput>);

      res.status(HTTP_STATUS.OK).json(booking);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookingId = req.params.id;

      if (typeof bookingId !== "string") {
        throw new BadRequestError("Invalid booking id");
      }

      this.bookingService.delete(bookingId);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };
}
