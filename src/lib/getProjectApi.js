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
  try {
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
      { cache: "no-store" }
    );

    if (!res.ok) {
      return { data: { projects: [] } };
    }

    return await res.json();
  } catch (error) {
    return { data: { projects: [] } };
  }
}

// 2. Get Popular Projects
export async function getPopularProjects(limit = 5) {
  try {
    const validLimit = Math.max(1, parseInt(limit) || 5);

    const res = await fetch(
      `${API_BASE_URL}get-popular-projects?limit=${validLimit}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return { data: [] };
    }

    return await res.json();
  } catch (error) {
    return { data: [] };
  }
}

// 3. Get Project By Slug
export async function getProjectBySlug(slug) {
  try {
    if (!slug) return { data: null };

    const res = await fetch(`${API_BASE_URL}get-project-by-slug/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { data: null };
    }

    return await res.json();
  } catch (error) {
    return { data: null };
  }
}
