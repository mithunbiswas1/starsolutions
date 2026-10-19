// src/redux/features/settingApi.js

import { apiSlice } from "@/redux/apiSlice/apiSlice";
import { endpoints } from "@/redux/apiSlice/endpoints";

export const settingApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // ============ Public Routes ============

    // Get settings
    getSettings: builder.query({
      query: () => ({
        url: endpoints.setting.getSettings,
        method: "GET",
      }),
      providesTags: ["Setting"],
    }),

    // Get settings by ID
    getSettingsById: builder.query({
      query: (id) => ({
        url: `${endpoints.setting.getSettingsById}/${id}`,
        method: "GET",
      }),
      providesTags: ["Setting"],
    }),

    // ============ Protected Routes (Admin Only) ============

    // Create or update settings
    createOrUpdateSettings: builder.mutation({
      query: (data) => ({
        url: endpoints.setting.createOrUpdateSettings,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Setting"],
    }),

    // Toggle settings status
    toggleSettingsStatus: builder.mutation({
      query: ({ id }) => ({
        url: `${endpoints.setting.toggleSettingsStatus}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Setting", id },
        "Setting",
      ],
    }),
  }),
});

// Export hooks
export const {
  // Public hooks
  useGetSettingsQuery,
  useGetSettingsByIdQuery,

  // Protected hooks
  useCreateOrUpdateSettingsMutation,
  useToggleSettingsStatusMutation,
} = settingApi;
