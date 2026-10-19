// src/lib/getBlogs.js

import { API_BASE_URL } from "@/redux/url/url";

export async function getBlogs({
  limit = 10,
  order = "desc",
  page = 1,
  q = "",
} = {}) {
  try {
    const validPage = Math.max(1, parseInt(page) || 1);

    const params = new URLSearchParams();
    params.append("limit", limit.toString());
    params.append("order", order);
    params.append("page", validPage.toString());

    if (q) {
      params.append("q", q);
    }

    const res = await fetch(`${API_BASE_URL}blog?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { data: { blogs: [] } };
    }

    return await res.json();
  } catch (error) {
    return { data: { blogs: [] } };
  }
}

export async function getBlogBySlug(slug) {
  try {
    if (!slug) return { data: null };

    const res = await fetch(`${API_BASE_URL}blog/${slug}`, {
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
