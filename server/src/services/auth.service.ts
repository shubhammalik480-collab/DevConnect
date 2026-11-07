import prisma from "../config/database";
import bcrypt from "bcryptjs";

// User Registration
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  // 1. Check whether user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create new user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  // 4. Return user details
  return user;
};
// User Login
export const loginUser = async (
  email: string,
  password: string
) => {
  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
  throw new Error("Invalid email or password");
}

  // 2. Compare entered password with hashed password
  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // 3. Return user details without password
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    location: user.location,
    avatar: user.avatar,
  };
};