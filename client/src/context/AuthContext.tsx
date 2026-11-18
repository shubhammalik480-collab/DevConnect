import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import {
  loginUser,
  registerUser,
} from "../services/auth.service";

import { AuthContext } from "./auth-context";
import type { User } from "./auth.types";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check existing authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginUser(email, password);
    setUser(response.data);
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    const response = await registerUser(name, email, password);
    setUser(response.data);
  };

  const logout = async () => {
    const response = await fetch(
      "http://localhost:5000/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};