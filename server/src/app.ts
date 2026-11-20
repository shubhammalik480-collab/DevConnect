import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import projectRoutes from "./routes/project.routes";
import skillRoutes from "./routes/skill.routes";
import blogRoutes from "./routes/blog.routes";
import connectionRoutes from "./routes/connection.routes";
import activityRoutes from "./routes/activity.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import multer from "multer";
import { csrfProtection } from "./middleware/csrf.middleware";
import passport from "./config/passport";

const app = express();
// Trust Render's reverse proxy
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Security Headers
app.use(helmet());

// CORS
const allowedOrigin =
  process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
// Body Parser
app.use(express.json({ limit: "10kb" }));

// Cookie Parser
app.use(cookieParser());

// Passport
app.use(passport.initialize());

// CSRF Protection
app.use("/api", csrfProtection);

// API Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use("/api", apiLimiter);
// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DevConnect API is running",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/dashboard", dashboardRoutes);
// Global Error Handler
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {

  // Multer errors
  if (err instanceof multer.MulterError) {

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "File too large. Maximum allowed size is 5 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Image validation errors
  if (err instanceof Error) {
    if (
      err.message.includes("Only valid") ||
      err.message.includes("Only JPG") ||
      err.message.includes("Image extension") ||
      err.message.includes("Image MIME") ||
      err.message.includes("Invalid or unsupported image")
    ) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  // Other server errors
  console.error("Server Error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});
// Export Express App

export default app;
