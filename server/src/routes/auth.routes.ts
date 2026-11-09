import { Router } from "express";
import passport from "../config/passport";
import { protect } from "../middleware/auth.middleware";

import {
  register,
  login,
  githubCallback,
  logout,
} from "../controllers/auth.controller";

const router = Router();

// User Registration
router.post("/register", register);

// User Login
router.post("/login", login);

// User Logout
router.post("/logout", logout);

// GitHub OAuth Login
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

// GitHub OAuth Callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  githubCallback
);

// Check Authentication
router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "You are authenticated!",
    userId: res.locals.userId,
  });
});

export default router;


