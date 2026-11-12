import { Request, Response } from "express";
import { uploadImage } from "../services/images.service";
import prisma from "../config/database";

// GET USER PROFILE
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// UPDATE USER PROFILE
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const { name, bio, location, avatar } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        location: true,
        avatar: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// DELETE USER PROFILE
export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;

    await prisma.user.delete({
      where: { id: userId },
    });

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete profile",
    });
  }
};

// UPLOAD PROFILE IMAGE
export const uploadProfileImage = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const image = await uploadImage(req.file);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatar: image.url,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Profile Image Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload profile image",
    });
  }
};

// GET ALL DEVELOPERS + SEARCH
export const getDevelopers = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const userId = res.locals.userId;

    const developers = await prisma.user.findMany({
      where: {
        id: { not: userId },
        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              location: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              skills: {
                some: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        }),
      },
      select: {
        id: true,
        name: true,
        bio: true,
        location: true,
        avatar: true,
        createdAt: true,
        skills: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
        _count: {
          select: {
            projects: true,
            blogPosts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Developers fetched successfully",
      count: developers.length,
      data: developers,
    });
  } catch (error) {
    console.error("Get Developers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch developers",
    });
  }
};

// GET SINGLE DEVELOPER PROFILE
export const getDeveloperById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const developer = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        bio: true,
        location: true,
        avatar: true,
        createdAt: true,
        skills: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
            techStack: true,
            liveUrl: true,
            repositoryUrl: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            projects: true,
            blogPosts: true,
          },
        },
      },
    });

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: "Developer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Developer profile fetched successfully",
      data: developer,
    });
  } catch (error) {
    console.error("Get Developer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch developer profile",
    });
  }
};