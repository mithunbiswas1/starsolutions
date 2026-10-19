// src/redux/url/url.js

// Backend static assets base (empty string allows relative path /public/upload/... or /upload/...)
export const baseUriBackend =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_BACKEND_URL || "")
    : (process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/` : "");

// API Base URL
export const API_BASE_URL =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || "/api/v1/")
    : (process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/` : "http://localhost:3000/api/v1/");
