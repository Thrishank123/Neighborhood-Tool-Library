// server/routes/reservations.js
import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import { createReservation, getUserReservations, updateReservationStatus, getPendingReservations, getAllReservations, getAdminReservations, returnReservation } from "../controllers/reservationController.js";

const router = express.Router();

router.post("/", authenticate, createReservation);
router.get("/", authenticate, getUserReservations);
router.get("/pending", authenticate, authorizeAdmin, getPendingReservations);
router.get("/admin", authenticate, authorizeAdmin, getAdminReservations);
router.get("/all", authenticate, authorizeAdmin, getAllReservations);
router.patch("/:id/status", authenticate, authorizeAdmin, updateReservationStatus);
router.patch("/:id/return", authenticate, returnReservation);

export default router;
