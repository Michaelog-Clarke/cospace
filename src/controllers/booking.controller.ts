import type { Request, Response } from "express";

import { BookingRepository, type BookingInput } from "../repositories/booking.repository.js";
import type { BookingWithId } from "../schemas/booking.schema.js";
import { BookingService } from "../services/booking.service.js";

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

  findAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const bookings = this.bookingService.findAll();
      res.status(200).json(bookings);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookingId = req.params.id;

      if (typeof bookingId !== "string") {
        res.status(400).json({ error: "Invalid booking id" });
        return;
      }

      const booking = this.bookingService.findById(bookingId);

      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      res.status(200).json(booking);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const booking = this.bookingService.create(req.body as BookingInput);
      res.status(201).json(booking);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      if (message.includes("Desk name")) {
        res.status(400).json({ error: message });
        return;
      }

      res.status(500).json({ error: message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookingId = req.params.id;

      if (typeof bookingId !== "string") {
        res.status(400).json({ error: "Invalid booking id" });
        return;
      }

      const booking = this.bookingService.update(bookingId, req.body as Partial<BookingInput>);

      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      res.status(200).json(booking);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      if (message.includes("Desk name")) {
        res.status(400).json({ error: message });
        return;
      }

      res.status(500).json({ error: message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookingId = req.params.id;

      if (typeof bookingId !== "string") {
        res.status(400).json({ error: "Invalid booking id" });
        return;
      }

      const deletedBooking = this.bookingService.delete(bookingId);

      if (!deletedBooking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  };
}

