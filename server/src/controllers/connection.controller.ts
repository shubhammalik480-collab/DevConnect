import { Request, Response } from "express";
import prisma from "../config/database";

// 1. Send Connection Request
export const sendConnectionRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const requesterId = res.locals.userId as string;
    const receiverId = String(req.params.id);

    if (!requesterId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (requesterId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You cannot connect with yourself",
      });
    }

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Developer not found",
      });
    }

    const existingConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          { requesterId, receiverId },
          { requesterId: receiverId, receiverId: requesterId },
        ],
      },
    });

    if (existingConnection) {
      return res.status(409).json({
        success: false,
        message: "A connection request already exists",
      });
    }

    const connection = await prisma.connection.create({
      data: {
        requesterId,
        receiverId,
        status: "PENDING",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Connection request sent successfully",
      data: connection,
    });
  } catch (error) {
    console.error("Send connection request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send connection request",
    });
  }
};

// 2. Accept Connection Request
export const acceptConnectionRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = res.locals.userId as string;
    const connectionId = String(req.params.id);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Connection request not found",
      });
    }

    if (connection.receiverId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot accept this request",
      });
    }

    if (connection.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "This request is no longer pending",
      });
    }

    const updatedConnection = await prisma.connection.update({
      where: { id: connectionId },
      data: { status: "ACCEPTED" },
    });

    return res.status(200).json({
      success: true,
      message: "Connection request accepted",
      data: updatedConnection,
    });
  } catch (error) {
    console.error("Accept connection error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to accept connection request",
    });
  }
};

// 3. Reject Connection Request
export const rejectConnectionRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = res.locals.userId as string;
    const connectionId = String(req.params.id);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Connection request not found",
      });
    }

    if (connection.receiverId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot reject this request",
      });
    }

    if (connection.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "This request is no longer pending",
      });
    }

    const updatedConnection = await prisma.connection.update({
      where: { id: connectionId },
      data: { status: "REJECTED" },
    });

    return res.status(200).json({
      success: true,
      message: "Connection request rejected",
      data: updatedConnection,
    });
  } catch (error) {
    console.error("Reject connection error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject connection request",
    });
  }
};

// 4. Get Received Connection Requests
export const getPendingRequests = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = res.locals.userId as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const requests = await prisma.connection.findMany({
      where: {
        receiverId: userId,
        status: "PENDING",
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            bio: true,
            location: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Get pending requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending requests",
    });
  }
};

// 5. Get Sent Connection Requests
export const getSentRequests = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = res.locals.userId as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const requests = await prisma.connection.findMany({
      where: {
        requesterId: userId,
        status: "PENDING",
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            bio: true,
            location: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Get sent requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sent requests",
    });
  }
};

// 6. Get Accepted Connections
export const getConnections = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = res.locals.userId as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const connections = await prisma.connection.findMany({
      where: {
        status: "ACCEPTED",
        OR: [
          { requesterId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            bio: true,
            location: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            bio: true,
            location: true,
            avatar: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const data = connections.map((connection) => ({
      id: connection.id,
      connectedAt: connection.updatedAt,
      developer:
        connection.requesterId === userId
          ? connection.receiver
          : connection.requester,
    }));

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Get connections error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch connections",
    });
  }
};

// 7. Get Mutual Connections
export const getMutualConnections = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = res.locals.userId as string;
    const developerId = String(req.params.id);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (userId === developerId) {
      return res.status(400).json({
        success: false,
        message: "You cannot check mutual connections with yourself",
      });
    }

    const developer = await prisma.user.findUnique({
      where: { id: developerId },
      select: { id: true },
    });

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: "Developer not found",
      });
    }

    const [myConnections, theirConnections] = await Promise.all([
      prisma.connection.findMany({
        where: {
          status: "ACCEPTED",
          OR: [
            { requesterId: userId },
            { receiverId: userId },
          ],
        },
        select: {
          requesterId: true,
          receiverId: true,
        },
      }),

      prisma.connection.findMany({
        where: {
          status: "ACCEPTED",
          OR: [
            { requesterId: developerId },
            { receiverId: developerId },
          ],
        },
        select: {
          requesterId: true,
          receiverId: true,
        },
      }),
    ]);

    const myIds = new Set(
      myConnections.map((connection) =>
        connection.requesterId === userId
          ? connection.receiverId
          : connection.requesterId
      )
    );

    const theirIds = theirConnections
      .map((connection) =>
        connection.requesterId === developerId
          ? connection.receiverId
          : connection.requesterId
      )
      .filter((id) => myIds.has(id));

    const mutualConnections = await prisma.user.findMany({
      where: {
        id: {
          in: theirIds,
        },
      },
      select: {
        id: true,
        name: true,
        bio: true,
        location: true,
        avatar: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: mutualConnections.length,
      data: mutualConnections,
    });
  } catch (error) {
    console.error("Get mutual connections error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch mutual connections",
    });
  }
};