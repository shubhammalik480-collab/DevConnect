import { Router } from "express";
import { protect } from "../middleware/auth.middleware";

import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getPendingRequests,
  getSentRequests,
  getConnections,
  getMutualConnections,
} from "../controllers/connection.controller";

const router = Router();

// All connection routes require authentication
router.use(protect);

// Send a connection request
router.post("/request/:id", sendConnectionRequest);

// Accept or reject a received request
router.patch("/:id/accept", acceptConnectionRequest);
router.patch("/:id/reject", rejectConnectionRequest);

// Get pending requests
router.get("/pending", getPendingRequests);

// Get sent requests
router.get("/sent", getSentRequests);

// Get accepted connections
router.get("/", getConnections);

// Get mutual connections with another developer
router.get("/mutual/:id", getMutualConnections);

export default router;