import { Router } from "express";
import { protect } from "../middleware/auth.middleware";

import {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
  endorseSkill,
  removeEndorsement,
  getUserSkillsWithEndorsements,
} from "../controllers/skill.controller";

const router = Router();

// All routes require authentication
router.use(protect);

// ==========================================
// SKILL ROUTES
// ==========================================

// Add Skill
router.post("/", createSkill);

// Get Logged-in User Skills
router.get("/", getSkills);

// Update Skill
router.put("/:id", updateSkill);

// Delete Skill
router.delete("/:id", deleteSkill);

// ==========================================
// ENDORSEMENT ROUTES
// ==========================================

// Endorse another user's skill
router.post("/endorse/:skillId", endorseSkill);

// Remove your endorsement
router.delete("/endorse/:skillId", removeEndorsement);

// Get user's skills with endorsement details and top skills
router.get("/user/:userId/endorsements", getUserSkillsWithEndorsements);

export default router;