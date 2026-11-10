import { Request, Response } from "express";
import prisma from "../config/database";

// CREATE SKILL
export const createSkill = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const { name, level } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Skill name is required",
      });
    }

    const skill = await prisma.skill.create({
      data: {
        name: name.trim(),
        level,
        userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Skill added successfully",
      data: skill,
    });
  } catch (error) {
    console.error("Create Skill Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add skill. It may already exist.",
    });
  }
};

// GET ALL SKILLS
export const getSkills = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;

    const skills = await prisma.skill.findMany({
      where: { userId },
      include: {
        _count: {
          select: { endorsements: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Skills fetched successfully",
      data: skills,
    });
  } catch (error) {
    console.error("Get Skills Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
    });
  }
};

// UPDATE SKILL
export const updateSkill = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const id = req.params.id as string;
    const { name, level } = req.body;

    const existingSkill = await prisma.skill.findFirst({
      where: { id, userId },
    });

    if (!existingSkill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      return res.status(400).json({
        success: false,
        message: "Skill name must be a non-empty string",
      });
    }

    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(level !== undefined && { level }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: updatedSkill,
    });
  } catch (error) {
    console.error("Update Skill Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update skill",
    });
  }
};

// DELETE SKILL
export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const id = req.params.id as string;

    const existingSkill = await prisma.skill.findFirst({
      where: { id, userId },
    });

    if (!existingSkill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    await prisma.skill.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Delete Skill Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete skill",
    });
  }
};