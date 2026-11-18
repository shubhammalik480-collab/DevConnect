import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { getActivities } from "../controllers/activity.controller";

const router = Router();

// All activity routes require authentication
router.use(protect);

// Get logged-in user's activity feed
router.get("/", getActivities);

export default router;