import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const authController = new AuthController();
const router = Router();

router.post("/register", (req, res, next) =>
  authController.register(req, res, next),
);
router.post("/login", (req, res, next) =>
  authController.login(req, res, next),
);

export default router;
