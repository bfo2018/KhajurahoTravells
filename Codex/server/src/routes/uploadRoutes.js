import { Router } from "express";
import { uploadMedia } from "../controllers/uploadController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.post("/", protect, adminOnly, upload.single("file"), uploadMedia);

export default router;
