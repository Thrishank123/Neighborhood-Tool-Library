// server/routes/auth.js
import express from "express";
import { register, login, forgotPassword, verifyToken } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/verify", authenticate, verifyToken);

export default router;
