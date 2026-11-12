import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";

import {
  getProfile,
  updateProfile,
  deleteProfile,
  uploadProfileImage,
  getDevelopers,
  getDeveloperById,
} from "../controllers/user.controller";

const router = Router();

// Current User Profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);

router.post(
  "/profile/image",
  protect,
  upload.single("image"),
  uploadProfileImage
);

// Developer Search & Discovery
router.get("/developers", protect, getDevelopers);
router.get("/developers/:id", protect, getDeveloperById);

export default router;