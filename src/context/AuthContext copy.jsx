// src/context/AuthContext.jsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// ONLY public routes for admin panel
const PUBLIC_ROUTES = [
  "/login",
  "/registration",
  "/forgot-password",
  "/reset-password",
];

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (e) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((userData, accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    window.dispatchEvent(new Event("login"));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("logout"));
    router.push("/login");
  }, [router]);

  const updateUser = useCallback((userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  // Check if route is public
  const isPublicRoute = useCallback(() => {
    return PUBLIC_ROUTES.includes(pathname);
  }, [pathname]);

  // Check authentication on mount and route changes
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Protected route guard - ALL routes except login/registration are protected
  useEffect(() => {
    if (!loading) {
      const isPublic = isPublicRoute();

      // If not authenticated and not on public route, redirect to login
      if (!isAuthenticated && !isPublic) {
        router.push("/login");
      }

      // If authenticated and on login/registration page, redirect to homepage
      if (isAuthenticated && isPublic) {
        router.push("/dashboard");
      }
    }
  }, [loading, isAuthenticated, pathname, router, isPublicRoute]);

  // Token expiry checker
  useEffect(() => {
    let intervalId;

    const checkTokenExpiry = () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const exp = payload.exp * 1000;
          const now = Date.now();

          // If token will expire in less than 5 minutes, refresh it
          if (exp - now < 300000) {
            refreshToken();
          }

          // If token is already expired, logout
          if (now >= exp) {
            logout();
          }
        } catch (error) {
          console.error("Token expiry check error:", error);
        }
      }
    };

    // Check token expiry every minute
    intervalId = setInterval(checkTokenExpiry, 60000);

    return () => clearInterval(intervalId);
  }, [logout]);

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        logout();
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        },
      );

      const data = await response.json();

      if (data.success) {
        const { accessToken, refreshToken: newRefreshToken } = data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
    }
  }, [logout]);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshToken,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
