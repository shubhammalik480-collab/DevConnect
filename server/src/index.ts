import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import passport from "./config/passport";
import userRoutes from "./routes/user.routes";
import projectRoutes from "./routes/project.routes";
import skillRoutes from "./routes/skill.routes";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Health Check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DevConnect API is running!",
  });
});

// Authentication Routes
app.use("/api/auth", authRoutes);

// User Routes
app.use("/api/users", userRoutes);

// Project Routes
app.use("/api/projects", projectRoutes);

// Skill Routes
app.use("/api/skills", skillRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});