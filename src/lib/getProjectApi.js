// src/lib/getProjectApi.js

import { API_BASE_URL } from "@/redux/url/url";

// 1. Get Projects List with pagination, search, filter
export async function getListProjects({
  page = 1,
  limit = 10,
  category = "",
  status = "",
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc",
  is_active = undefined,
  createBy = "",
  technologies = "",
} = {}) {
  const validPage = Math.max(1, parseInt(page) || 1);
  const validLimit = Math.max(1, parseInt(limit) || 10);

  const params = new URLSearchParams();
  params.append("page", validPage.toString());
  params.append("limit", validLimit.toString());

  if (category) params.append("category", category);
  if (status) params.append("status", status);
  if (search) params.append("search", search);
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);
  if (is_active !== undefined) params.append("is_active", is_active);
  if (createBy) params.append("createBy", createBy);
  if (technologies) params.append("technologies", technologies);

  const res = await fetch(
    `${API_BASE_URL}get-list-projects?${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch projects list");
  }

  return res.json();
}

// 2. Get Popular Projects
export async function getPopularProjects(limit = 5) {
  const validLimit = Math.max(1, parseInt(limit) || 5);

  const res = await fetch(
    `${API_BASE_URL}get-popular-projects?limit=${validLimit}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch popular projects");
  }

  return res.json();
}

// 3. Get Project By Slug
export async function getProjectBySlug(slug) {
  if (!slug) {
    throw new Error("Slug is required");
  }

  const res = await fetch(`${API_BASE_URL}get-project-by-slug/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch project");
  }

  return res.json();
}
