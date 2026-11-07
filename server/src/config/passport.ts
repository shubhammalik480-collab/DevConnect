import "dotenv/config";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import prisma from "./database";
import type { User } from "@prisma/client";

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackURL: "http://localhost:5000/api/auth/github/callback",
      scope: ["user:email"],
    },

    async (
      accessToken: string,
      refreshToken: string,
      profile: {
        id: string;
        username?: string;
        displayName?: string;
        emails?: { value: string }[];
        photos?: { value: string }[];
      },
      done: (error: Error | null, user?: User | false) => void
    ) => {
      try {
        // 1. Get email from GitHub profile
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("GitHub email not available"));
        }

        // 2. Check existing user
        let user = await prisma.user.findUnique({
          where: { email },
        });

        // 3. Create new user if not registered
        if (!user) {
          user = await prisma.user.create({
            data: {
              name:
                profile.displayName ||
                profile.username ||
                "GitHub User",
              email,
              avatar: profile.photos?.[0]?.value,
            },
          });
        }

        // 4. Authentication successful
        return done(null, user);

      } catch (error) {
        return done(
          error instanceof Error
            ? error
            : new Error("GitHub authentication failed")
        );
      }
    }
  )
);

export default passport;

