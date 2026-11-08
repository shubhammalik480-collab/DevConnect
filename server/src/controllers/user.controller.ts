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