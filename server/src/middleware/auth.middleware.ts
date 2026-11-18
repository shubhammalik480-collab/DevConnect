import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please login.",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is not configured.");
    return res.status(500).json({
      success: false,
      message: "Internal server configuration error.",
    });
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.userId !== "string" ||
      !decoded.userId.trim()
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    res.locals.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};