import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Authentication Middleware
export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    // Get JWT secret
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    // Verify token
    const decoded = jwt.verify(token, secret);

    // Store user information
    res.locals.userId = (decoded as jwt.JwtPayload).userId;

    // Allow request to continue
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};