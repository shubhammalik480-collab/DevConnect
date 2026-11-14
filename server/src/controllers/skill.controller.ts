import { Request, Response } from "express";
import prisma from "../config/database";

// ==========================================
// CREATE SKILL
// ==========================================
export const createSkill = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId as string;
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

// ==========================================
// GET ALL LOGGED-IN USER SKILLS
// ==========================================
export const getSkills = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId as string;

    const skills = await prisma.skill.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            endorsements: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
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

// ==========================================
// UPDATE SKILL
// ==========================================
export const updateSkill = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId as string;
    const id = req.params.id as string;
    const { name, level } = req.body;

    const existingSkill = await prisma.skill.findFirst({
      where: {
        id,
        userId,
      },
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

// ==========================================
// DELETE SKILL
// ==========================================
export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId as string;
    const id = req.params.id as string;

    const existingSkill = await prisma.skill.findFirst({
      where: {
        id,
        userId,
      },
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

// ==========================================
// ENDORSE A SKILL
// ==========================================
export const endorseSkill = async (req: Request, res: Response) => {
  try {
    const fromUserId = res.locals.userId as string;
    const skillId = req.params.skillId as string;
    const { message } = req.body;

    // Validate message
    if (message !== undefined && typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message must be a string",
      });
    }

    // Check whether skill exists
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    // Prevent self-endorsement
    if (skill.userId === fromUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot endorse your own skill",
      });
    }

    // Create endorsement
    const endorsement = await prisma.endorsement.create({
      data: {
        skillId,
        fromUserId,
        toUserId: skill.userId,
        message: message?.trim() || null,
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        skill: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Skill endorsed successfully",
      data: endorsement,
    });
  } catch (error) {
    console.error("Endorse Skill Error:", error);

    // Handle duplicate endorsement
    if ((error as { code?: string }).code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "You have already endorsed this skill",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to endorse skill",
    });
  }
};

// ==========================================
// REMOVE ENDORSEMENT
// ==========================================
export const removeEndorsement = async (req: Request, res: Response) => {
  try {
    const fromUserId = res.locals.userId as string;
    const skillId = req.params.skillId as string;

    const endorsement = await prisma.endorsement.findFirst({
      where: {
        fromUserId,
        skillId,
      },
    });

    if (!endorsement) {
      return res.status(404).json({
        success: false,
        message: "Endorsement not found",
      });
    }

    await prisma.endorsement.delete({
      where: {
        id: endorsement.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Endorsement removed successfully",
    });
  } catch (error) {
    console.error("Remove Endorsement Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove endorsement",
    });
  }
};

// ==========================================
// GET USER SKILLS WITH ENDORSEMENTS
// ==========================================
export const getUserSkillsWithEndorsements = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.userId as string;

    const skills = await prisma.skill.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            endorsements: true,
          },
        },
        endorsements: {
          include: {
            fromUser: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: [
        {
          endorsements: {
            _count: "desc",
          },
        },
        {
          name: "asc",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "User skills and endorsements fetched successfully",
      data: skills,
    });
  } catch (error) {
    console.error("Get User Endorsements Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user endorsements",
    });
  }
};