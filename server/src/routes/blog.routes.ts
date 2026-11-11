import { Router } from "express";

import { protect } from "../middleware/auth.middleware";

import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  updateBlog,
} from "../controllers/blog.controller";

const router = Router();

// Create a new blog
router.post("/", protect, createBlog);

// Get all blogs
router.get("/", protect, getBlogs);

// Get single blog by slug
router.get("/slug/:slug", protect, getBlogBySlug);

// Update existing blog
router.put("/:id", protect, updateBlog);

export default router;