import { Router } from "express";

import { BookingController } from "../controllers/booking.controller.js";

const bookingController = new BookingController();

const router = Router();

router.get("/", (req, res) => bookingController.findAll(req, res));
router.get("/:id", (req, res) => bookingController.findById(req, res));
router.post("/", (req, res) => bookingController.create(req, res));
router.put("/:id", (req, res) => bookingController.update(req, res));
router.patch("/:id", (req, res) => bookingController.update(req, res));
router.delete("/:id", (req, res) => bookingController.delete(req, res));

export default router;
