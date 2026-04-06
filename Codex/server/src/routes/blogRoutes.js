import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAdminBlogs,
  getBlogBySlug,
  getBlogs,
  updateBlog
} from "../controllers/blogController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getBlogs);
router.get("/admin/all", protect, adminOnly, getAdminBlogs);
router.get("/slug/:slug", getBlogBySlug);
router.post("/", protect, adminOnly, createBlog);
router.put("/:id", protect, adminOnly, updateBlog);
router.delete("/:id", protect, adminOnly, deleteBlog);

export default router;
