import { Request, Response, NextFunction } from "express";

const allowedOrigin =
  process.env.FRONTEND_URL || "http://localhost:5173";

export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];

  if (safeMethods.includes(req.method)) {
    return next();
  }

  const origin = req.get("Origin");

  if (origin !== allowedOrigin) {
    return res.status(403).json({
      success: false,
      message: "Request blocked by security policy.",
    });
  }

  next();
};