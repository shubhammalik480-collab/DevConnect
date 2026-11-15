import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

let io: Server;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // Socket Authentication
  io.use((socket, next) => {
    try {
      // Read cookies from handshake headers
      const cookieHeader = socket.handshake.headers.cookie || "";

      const tokenCookie = cookieHeader
        .split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith("token="));

      const token = tokenCookie
        ? decodeURIComponent(tokenCookie.substring(6))
        : null;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const secret = process.env.JWT_SECRET;

      if (!secret) {
        return next(new Error("JWT_SECRET is not configured"));
      }

      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

      if (!decoded.userId) {
        return next(new Error("Invalid authentication token"));
      }

      socket.data.userId = decoded.userId;

      next();
    } catch (error) {
      console.error("Socket Authentication Error:", error);
      next(new Error("Invalid or expired token"));
    }
  });

  // Socket Connection
  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;

    // Join personal notification room
    socket.join(`user_${userId}`);

    console.log(`User connected: ${userId}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  console.log("Socket.IO initialized successfully");

  return io;
};

// Get Socket.IO Instance
export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};