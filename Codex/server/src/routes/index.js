import { Router } from "express";
import authRoutes from "./authRoutes.js";
import carRoutes from "./carRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import chatRoutes from "./chatRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import packageRoutes from "./packageRoutes.js";
import seoRoutes from "./seoRoutes.js";
import blogRoutes from "./blogRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cars", carRoutes);
router.use("/bookings", bookingRoutes);
router.use("/packages", packageRoutes);
router.use("/blogs", blogRoutes);
router.use("/seo", seoRoutes);
router.use("/chat", chatRoutes);
router.use("/uploads", uploadRoutes);

export default router;
