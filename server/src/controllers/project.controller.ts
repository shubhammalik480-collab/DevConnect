import { Request, Response } from "express";
import prisma from "../config/database";

// CREATE PROJECT
export const createProject = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;

    const {
      title,
      description,
      techStack,
      liveUrl,
      repositoryUrl,
    } = req.body;

    if (!title || !description || !techStack) {
      return res.status(400).json({
        success: false,
        message: "Title, description and techStack are required",
      });
    }

    if (!Array.isArray(techStack)) {
      return res.status(400).json({
        success: false,
        message: "techStack must be an array",
      });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        techStack,
        liveUrl,
        repositoryUrl,
        userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Create Project Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

// GET ALL PROJECTS OF LOGGED-IN USER
export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;

    const projects = await prisma.project.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    console.error("Get Projects Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};
// GET SINGLE PROJECT
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
   const id = req.params.id as string;

    const project = await prisma.project.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    console.error("Get Project Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};
// UPDATE PROJECT
export const updateProject = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
   const id = req.params.id as string;
    const {
      title,
      description,
      techStack,
      liveUrl,
      repositoryUrl,
    } = req.body;

    const existingProject = await prisma.project.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (techStack !== undefined && !Array.isArray(techStack)) {
      return res.status(400).json({
        success: false,
        message: "techStack must be an array",
      });
    }

    const updatedProject = await prisma.project.update({
      where: { id: id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(techStack !== undefined && { techStack }),
        ...(liveUrl !== undefined && { liveUrl }),
        ...(repositoryUrl !== undefined && { repositoryUrl }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Update Project Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};
// DELETE PROJECT
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
   const id = req.params.id as string;

    const existingProject = await prisma.project.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await prisma.project.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete Project Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};