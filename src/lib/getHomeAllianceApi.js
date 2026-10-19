// src/lib/getHomeAllianceApi.js

import { API_BASE_URL } from "@/redux/url/url";

export async function getHomeAlliance() {
  try {
    const res = await fetch(`${API_BASE_URL}get-alliance`, {
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
