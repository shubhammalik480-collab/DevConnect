import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { getDashboardStats } from "../controllers/dashboard.controller";

const router = Router();

// All dashboard routes require authentication
router.use(protect);

// Get dashboard statistics
router.get("/stats", getDashboardStats);

export default router;