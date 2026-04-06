import { Router } from "express";
import {
  createCar,
  deleteCar,
  getCarBySlug,
  getCars,
  getFeaturedCars,
  updateCar
} from "../controllers/carController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getCars);
router.get("/featured", getFeaturedCars);
router.get("/:slug", getCarBySlug);
router.post("/", protect, adminOnly, createCar);
router.put("/:id", protect, adminOnly, updateCar);
router.delete("/:id", protect, adminOnly, deleteCar);

export default router;
