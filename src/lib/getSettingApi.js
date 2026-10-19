// src/lib/getSettingApi.js

import { API_BASE_URL } from "@/redux/url/url";

export async function getSettings() {
  try {
    const res = await fetch(`${API_BASE_URL}get-settings`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { data: {} };
    }

    return await res.json();
  } catch (error) {
    return { data: {} };
  }
}
