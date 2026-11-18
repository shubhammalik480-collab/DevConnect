import { createContext } from "react";
import type { User } from "./auth.types";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);