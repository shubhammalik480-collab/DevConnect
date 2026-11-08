import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";
import { uploadProfileImage } from "../controllers/user.controller";

import {
  getProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/user.controller";

const router = Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);
router.post(
  "/profile/image",
  protect,
  upload.single("image"),
  uploadProfileImage
);

export default router;