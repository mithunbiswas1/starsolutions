// src/redux/features/aboutApi.js
import { apiSlice } from "@/redux/apiSlice/apiSlice";
import { endpoints } from "@/redux/apiSlice/endpoints";

export const aboutApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // ============ Public Routes ============

    // Get about page
    getAbout: builder.query({
      query: () => ({
        url: endpoints.about.getAbout,
        method: "GET",
      }),
      providesTags: ["About"],
    }),

    // Get about page by ID
    getAboutById: builder.query({
      query: (id) => ({
        url: `${endpoints.about.getAboutById}/${id}`,
        method: "GET",
      }),
      providesTags: ["About"],
    }),

    // ============ Protected Routes (Admin Only) ============

    // Create or update about page
    createOrUpdateAbout: builder.mutation({
      query: (data) => ({
        url: endpoints.about.createOrUpdateAbout,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["About"],
    }),

    // Toggle about status
    toggleAboutStatus: builder.mutation({
      query: ({ id }) => ({
        url: `${endpoints.about.toggleAboutStatus}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["About"],
    }),
  }),
});

// Export hooks
export const {
  // Public hooks
  useGetAboutQuery,
  useGetAboutByIdQuery,

  // Protected hooks
  useCreateOrUpdateAboutMutation,
  useToggleAboutStatusMutation,
} = aboutApi;
