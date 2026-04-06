import { Router } from "express";
import {
  createBooking,
  estimateDistance,
  getBookingById,
  getBookings,
  getBookingsByUserId,
  updateBookingStatus
} from "../controllers/bookingController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/estimate-distance", estimateDistance);
router.post("/", protect, createBooking);
router.get("/", protect, getBookings);
router.get("/user/:userId", protect, getBookingsByUserId);
router.get("/:id", getBookingById);
router.patch("/:id/status", protect, adminOnly, updateBookingStatus);

export default router;
