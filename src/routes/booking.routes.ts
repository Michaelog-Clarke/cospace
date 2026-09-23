import { Router } from "express";

import { authMiddleware as auth } from "../middleware/auth.js";
import { validateRequiredFields as validate } from "../middleware/validate.js";
import { BookingController } from "../controllers/booking.controller.js";

const bookingController = new BookingController();

const router = Router();

router.get("/", (req, res) => bookingController.findAll(req, res));
router.get("/:id", (req, res) => bookingController.findById(req, res));
router.post("/", auth, validate(["desk", "floor"]), (req, res) =>
  bookingController.create(req, res),
);
router.put("/:id", auth, validate(["desk", "floor"]), (req, res) =>
  bookingController.update(req, res),
);
router.patch("/:id", auth, validate(["desk", "floor"]), (req, res) =>
  bookingController.update(req, res),
);
router.delete("/:id", auth, (req, res) => bookingController.delete(req, res));

export default router;
