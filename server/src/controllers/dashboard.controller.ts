import { Request, Response } from "express";
import prisma from "../config/database";

// GET DASHBOARD STATISTICS
export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = res.locals.userId as string;

    const [
      totalProjects,
      totalSkills,
      totalBlogs,
      totalConnections,
      pendingRequests,
    ] = await Promise.all([
      prisma.project.count({
        where: { userId },
      }),

      prisma.skill.count({
        where: { userId },
      }),

      prisma.blogPost.count({
        where: { userId },
      }),

      prisma.connection.count({
        where: {
          status: "ACCEPTED",
          OR: [
            { requesterId: userId },
            { receiverId: userId },
          ],
        },
      }),

      prisma.connection.count({
        where: {
          receiverId: userId,
          status: "PENDING",
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalProjects,
        totalSkills,
        totalBlogs,
        totalConnections,
        pendingRequests,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};