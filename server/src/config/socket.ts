
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

let io: Server;

// Initialize Socket.IO
export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST"],
   },
  });

  // Socket Authentication Middleware
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

      // Check token existence
      if (!token) {
        return next(new Error("Authentication required"));
      }

      // Validate JWT secret
      const secret = process.env.JWT_SECRET;

      if (!secret || secret.length < 32) {
        console.error("JWT_SECRET is missing or too weak");
        return next(new Error("Authentication configuration error"));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, secret, {
        algorithms: ["HS256"],
      });

      // Validate JWT payload
      if (
        typeof decoded === "string" ||
        typeof decoded.userId !== "string" ||
        !decoded.userId.trim()
      ) {
        return next(new Error("Invalid authentication token"));
      }

      // Store authenticated user ID
      socket.data.userId = decoded.userId;

      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  // Socket Connection
  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;

    // Join authenticated user's personal notification room
    socket.join(`user_${userId}`);

    console.log(`User connected: ${userId}`);

    socket.on("disconnect", (reason) => {
      console.log(`User disconnected: ${userId}`, reason);
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
