import { Router } from "express";
import { protect } from "../middleware/auth.middleware";

import {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} from "../controllers/skill.controller";

const router = Router();

// Add Skill
router.post("/", protect, createSkill);

// Get All Skills
router.get("/", protect, getSkills);

// Update Skill
router.put("/:id", protect, updateSkill);

// Delete Skill
router.delete("/:id", protect, deleteSkill);

export default router;