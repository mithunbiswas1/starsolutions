// src/redux/features/homeIndustryApi.js
import { apiSlice } from "@/redux/apiSlice/apiSlice";
import { endpoints } from "@/redux/apiSlice/endpoints";

export const homeIndustryApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // ============ Public Routes ============

    // Get all active industries (for frontend)
    getActiveIndustries: builder.query({
      query: () => ({
        url: endpoints.homeIndustry.getActiveIndustries,
        method: "GET",
      }),
      providesTags: ["HomeIndustry"],
    }),

    // Get industry list with pagination, search, filter
    getHomeIndustryList: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        if (params.search) queryParams.append("search", params.search);
        if (params.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
        if (params.is_active !== undefined)
          queryParams.append("is_active", params.is_active);

        const queryString = queryParams.toString();
        return {
          url: queryString
            ? `${endpoints.homeIndustry.getHomeIndustryList}?${queryString}`
            : endpoints.homeIndustry.getHomeIndustryList,
          method: "GET",
        };
      },
      providesTags: ["HomeIndustry"],
    }),

    // Get single industry by ID
    getHomeIndustryById: builder.query({
      query: (id) => ({
        url: `${endpoints.homeIndustry.getHomeIndustryById}/${id}`,
        method: "GET",
      }),
      providesTags: ["HomeIndustry"],
    }),

    // ============ Protected Routes (Admin Only) ============

    // Create new industry
    createHomeIndustry: builder.mutation({
      query: (data) => ({
        url: endpoints.homeIndustry.createHomeIndustry,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HomeIndustry"],
    }),

    // Update industry
    updateHomeIndustry: builder.mutation({
      query: ({ id, data }) => ({
        url: `${endpoints.homeIndustry.updateHomeIndustry}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["HomeIndustry"],
    }),

    // Delete industry
    deleteHomeIndustry: builder.mutation({
      query: (id) => ({
        url: `${endpoints.homeIndustry.deleteHomeIndustry}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HomeIndustry"],
    }),

    // Toggle industry status
    toggleHomeIndustryStatus: builder.mutation({
      query: ({ id }) => ({
        url: `${endpoints.homeIndustry.toggleHomeIndustryStatus}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["HomeIndustry"],
    }),

    // Bulk update industry order
    updateIndustryOrder: builder.mutation({
      query: (industries) => ({
        url: endpoints.homeIndustry.updateIndustryOrder,
        method: "PUT",
        body: { industries },
      }),
      invalidatesTags: ["HomeIndustry"],
    }),
  }),
});

// Export hooks
export const {
  // Public hooks
  useGetActiveIndustriesQuery,
  useGetHomeIndustryListQuery,
  useGetHomeIndustryByIdQuery,

  // Protected hooks
  useCreateHomeIndustryMutation,
  useUpdateHomeIndustryMutation,
  useDeleteHomeIndustryMutation,
  useToggleHomeIndustryStatusMutation,
  useUpdateIndustryOrderMutation,
} = homeIndustryApi;
