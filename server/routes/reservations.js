// server/routes/reservations.js
import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import { createReservation, getUserReservations, updateReservationStatus } from "../controllers/reservationController.js";

const router = express.Router();

router.post("/", authenticate, createReservation);
router.get("/", authenticate, getUserReservations);
router.patch("/:id/status", authenticate, authorizeAdmin, updateReservationStatus);

export default router;
