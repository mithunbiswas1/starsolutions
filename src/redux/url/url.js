// src/redux/url/url.js

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  // Vercel production or preview deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost:3000")) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  const port = process.env.PORT || 3001;
  return `http://127.0.0.1:${port}`;
}

// Backend static assets base
export const baseUriBackend =
  process.env.NEXT_PUBLIC_BACKEND_URL || "";

// API Base URL
export const API_BASE_URL =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || "/api/v1/")
    : `${getBaseUrl()}/api/v1/`;
