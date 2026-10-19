// src/redux/features/homeAllianceApi.js

import { apiSlice } from "@/redux/apiSlice/apiSlice";
import { endpoints } from "@/redux/apiSlice/endpoints";

export const homeAllianceApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Public route
    getAlliance: builder.query({
      query: () => ({
        url: endpoints.homeAlliance.getAlliance,
        method: "GET",
      }),
      providesTags: ["Alliance"],
    }),

    // Protected routes (Admin)
    createOrUpdateAlliance: builder.mutation({
      query: (data) => ({
        url: endpoints.homeAlliance.createOrUpdateAlliance,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Alliance"],
    }),

    getAllianceById: builder.query({
      query: (id) => ({
        url: `${endpoints.homeAlliance.getAllianceById}/${id}`,
        method: "GET",
      }),
      providesTags: ["Alliance"],
    }),

    deleteAlliance: builder.mutation({
      query: (id) => ({
        url: `${endpoints.homeAlliance.deleteAlliance}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Alliance"],
    }),

    toggleAllianceStatus: builder.mutation({
      query: ({ id }) => ({
        url: `${endpoints.homeAlliance.toggleAllianceStatus}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Alliance"],
    }),

    deleteAllianceImage: builder.mutation({
      query: ({ id, imageKey }) => ({
        url: `${endpoints.homeAlliance.deleteAllianceImage}/${id}/${imageKey}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Alliance"],
    }),
  }),
});

export const {
  useGetAllianceQuery,
  useCreateOrUpdateAllianceMutation,
  useGetAllianceByIdQuery,
  useDeleteAllianceMutation,
  useToggleAllianceStatusMutation,
  useDeleteAllianceImageMutation,
} = homeAllianceApi;
