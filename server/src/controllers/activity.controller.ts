import { Request, Response } from "express";
import prisma from "../config/database";

// GET USER ACTIVITY FEED
export const getActivities = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = res.locals.userId as string;

    const activities = await prisma.activity.findMany({
      where: {
        userId,
      },
      include: {
        actor: {
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
      take: 20,
    });

    return res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error("Get Activities Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
    });
  }
};

// CREATE ACTIVITY
export const createActivity = async (
  userId: string,
  actorId: string,
  type: string,
  message: string,
  entityId?: string
) => {
  return prisma.activity.create({
    data: {
      userId,
      actorId,
      type,
      message,
      entityId,
    },
  });
};