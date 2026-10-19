// src/redux/apiSlice/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/redux/url/url";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return headers;
  },
});

// CUSTOM BASE QUERY WITH AUTH HANDLING
const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // HANDLE UNAUTHENTICATED ERROR
  if (result?.error) {
    const status = result.error.status;
    const data = result.error.data;

    if (status === 401 || data?.error === "Unauthenticated.") {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        const isAdmin = window.location.pathname.startsWith("/admin");
        const loginPath = isAdmin ? "/admin/login" : "/login";

        if (!window.location.pathname.includes("/login")) {
          window.location.href = loginPath;
        }
      }
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "Setting",
    "Auth",
    "Profile",
    "Blog",
    "Project",
    "Homepage",
    "HomeBanner",
    "HomeCompany",
    "HomeIndustry",
    "About",
    "ClientMessage",
    "Testimonial",
    "Alliance",
    "Package",
    "Product",
    "Category",
    "Orders",
    "ProductReviews",
    "Tracking",
    "Slider",
  ],
  endpoints: () => ({}),
});
