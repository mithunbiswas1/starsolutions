// src/context/AuthContext.jsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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

// Admin public routes
const ADMIN_PUBLIC_ROUTES = [
  "/admin/login",
  "/admin/registration",
  "/admin/otp-verify",
  "/admin/sign-in",
  "/admin/forgot-password",
  "/admin/reset-password",
];

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isCheckingRef = useRef(false);
  const previousPathnameRef = useRef(pathname);

  // Check authentication
  const checkAuth = useCallback(async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    try {
      const token = localStorage.getItem("accessToken");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const exp = payload.exp * 1000;
          const now = Date.now();

          if (now >= exp) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            isCheckingRef.current = false;

            if (pathname.startsWith("/admin") && !ADMIN_PUBLIC_ROUTES.includes(pathname)) {
              router.push("/admin/login");
            }
            return;
          }

          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (e) {
          console.error("Error parsing user data:", e);
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
      isCheckingRef.current = false;
    }
  }, [pathname, router]);

  const login = useCallback((userData, accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    window.dispatchEvent(new Event("login"));
    window.dispatchEvent(new Event("storage"));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("logout"));
    window.dispatchEvent(new Event("storage"));

    if (pathname.startsWith("/admin")) {
      router.push("/admin/login");
    } else {
      router.push("/login");
    }
  }, [pathname, router]);

  const updateUser = useCallback((userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const isAdminPublicRoute = useCallback(() => {
    return ADMIN_PUBLIC_ROUTES.includes(pathname);
  }, [pathname]);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Listen for storage events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (
        e.key === "accessToken" ||
        e.key === "user" ||
        e.key === "refreshToken"
      ) {
        checkAuth();
      }
    };

    const handleCustomStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("login", handleCustomStorageChange);
    window.addEventListener("logout", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("login", handleCustomStorageChange);
      window.removeEventListener("logout", handleCustomStorageChange);
    };
  }, [checkAuth]);

  // Route change detector
  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;
      checkAuth();
    }
  }, [pathname, checkAuth]);

  // Protected route guard for Admin
  useEffect(() => {
    if (!loading && pathname.startsWith("/admin")) {
      const isPublic = isAdminPublicRoute();

      if (!isAuthenticated && !isPublic) {
        router.push("/admin/login");
      }

      if (isAuthenticated && isPublic) {
        router.push("/admin/dashboard");
      }
    }
  }, [loading, pathname, isAuthenticated, isAdminPublicRoute, router]);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuth,
    isAdminPublicRoute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
