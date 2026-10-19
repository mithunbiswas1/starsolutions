// src/lib/getHomeCompany.js

import { API_BASE_URL } from "@/redux/url/url";

export async function getHomeCompanyList({
  page = 1,
  limit = 50,
  search = "",
  sortBy = "order",
  sortOrder = "asc",
  is_active = undefined,
} = {}) {
  try {
    const validPage = Math.max(1, parseInt(page) || 1);
    const validLimit = Math.max(1, parseInt(limit) || 10);

    const params = new URLSearchParams();
    params.append("page", validPage.toString());
    params.append("limit", validLimit.toString());

    if (search) params.append("search", search);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (is_active !== undefined) params.append("is_active", is_active);

    const res = await fetch(
      `${API_BASE_URL}get-home-company-list?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!res.ok) return { data: { companies: [] } };
    return await res.json();
  } catch (error) {
    return { data: { companies: [] } };
  }
}
