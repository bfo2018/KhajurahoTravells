import { Router } from "express";
import {
  getBlogOgImage,
  getPackageOgImage,
  getPreviewOgImage,
  submitIndexNow,
  syncSeo
} from "../controllers/seoController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/og/blog/:slug.svg", getBlogOgImage);
router.get("/og/package/:slug.svg", getPackageOgImage);
router.get("/og/preview.svg", getPreviewOgImage);
router.post("/indexnow", protect, adminOnly, submitIndexNow);
router.post("/sync", protect, adminOnly, syncSeo);

export default router;
