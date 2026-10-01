import { Router } from "express";

import { authMiddleware as auth } from "../middleware/auth.js";
import { BookingController } from "../controllers/booking.controller.js";

const bookingController = new BookingController();

const router = Router();

router.get("/", (req, res, next) => bookingController.findAll(req, res, next));
router.get("/:id", (req, res, next) => bookingController.findById(req, res, next));
router.post("/", auth, (req, res, next) =>
  bookingController.create(req, res, next),
);
router.put("/:id", auth, (req, res, next) =>
  bookingController.replace(req, res, next),
);
router.patch("/:id", auth, (req, res, next) =>
  bookingController.update(req, res, next),
);
router.delete("/:id", auth, (req, res, next) => bookingController.delete(req, res, next));

export default router;
