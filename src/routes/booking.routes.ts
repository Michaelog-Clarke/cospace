import { Router } from "express";

import { BookingController } from "../controllers/booking.controller.js";
import { BookingRepository } from "../repositories/booking.repository.js";
import type { Booking } from "../routes/bookings.js";
import { BookingService } from "../services/booking.service.js";

const defaultBookings: Booking[] = [
  { id: "1", desk: "A1", floor: 1, date: "2026-09-22", active: true },
  { id: "2", desk: "B4", floor: 2, date: "2026-09-23", active: false },
  { id: "3", desk: "C7", floor: 3, date: "2026-09-24", active: true },
];

const bookingController = new BookingController(
  new BookingService(new BookingRepository(defaultBookings)),
);

const router = Router();

router.get("/", (req, res) => bookingController.findAll(req, res));
router.get("/:id", (req, res) => bookingController.findById(req, res));
router.post("/", (req, res) => bookingController.create(req, res));
router.put("/:id", (req, res) => bookingController.update(req, res));
router.patch("/:id", (req, res) => bookingController.update(req, res));
router.delete("/:id", (req, res) => bookingController.delete(req, res));

export default router;
