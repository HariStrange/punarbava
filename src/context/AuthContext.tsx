import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; permit?: string; error?: string }>;
  resetPassword: (
    username: string,
    oldPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

function decodeJWT(token: string): { role: string; exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      const decoded = decodeJWT(token);
      if (
        decoded &&
        decoded.exp &&
        decoded.exp > Math.floor(Date.now() / 1000)
      ) {
        setUser({
          id: "1",
          email: "user@papex.com",
          name: "Papex User",
          role: decoded.role?.toLowerCase() || "user",
        });
      } else {
        Cookies.remove("authToken");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; permit?: string; error?: string }> => {
    try {
      const response = await axios.post("http://localhost:8081/auth/login", {
        username,
        password,
      });

      const token = response.data.token;
      const permit = response.data.permit;

      Cookies.set("authToken", token, { expires: 7 });
      const decoded = decodeJWT(token);
      setUser({
        id: "1",
        email: username,
        name: "Papex User",
        role: decoded?.role?.toLowerCase() || "user",
      });

      return { success: true, permit };
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      };
    }
  };

  const resetPassword = async (
    username: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await axios.post(
        "http://localhost:8083/auth/reset-password",
        {
          username,
          oldPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Backend returns a string like "Password reset successful."
      if (
        response.status === 200 &&
        response.data === "Password reset successful."
      ) {
        return { success: true };
      }

      return {
        success: false,
        error: response.data || "Unexpected response from server.",
      };
    } catch (error: any) {
      console.error(
        "Password reset error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error:
          typeof error.response?.data === "string"
            ? error.response.data // e.g., "Old password is incorrect."
            : "Password reset failed. Please try again.",
      };
    }
  };

  const logout = () => {
    Cookies.remove("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, resetPassword, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
