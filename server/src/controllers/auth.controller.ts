import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";

const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
};

const setAuthCookie = (res: Response, userId: string) => {
  const token = jwt.sign(
    { userId },
    getJWTSecret(),
    {
      expiresIn: "7d",
      algorithm: "HS256",
    }
  );

  res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
};

// Register Controller
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid name, email and password are required.",
      });
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      password.length < 8 ||
      name.trim().length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid registration details. Password must be at least 8 characters.",
      });
    }

    const user = await registerUser(
      name.trim(),
      email.trim().toLowerCase(),
      password
    );

    setAuthCookie(res, user.id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (
      error instanceof Error &&
      error.message === "User already exists with this email"
    ) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};

// Login Controller
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await loginUser(
      email.trim().toLowerCase(),
      password
    );

    setAuthCookie(res, user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    console.error("Login error:", error);

    if (
      error instanceof Error &&
      error.message === "Invalid email or password"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

// GitHub OAuth Callback
export const githubCallback = (req: Request, res: Response) => {
  const frontendURL =
    process.env.FRONTEND_URL || "http://localhost:5173";

  try {
    const user = req.user as
      | { id: string; name: string; email: string }
      | undefined;

    if (!user?.id) {
      return res.redirect(`${frontendURL}/login`);
    }

    setAuthCookie(res, user.id);

    return res.redirect(`${frontendURL}/`);
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return res.redirect(`${frontendURL}/login`);
  }
};

// Logout Controller
export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};