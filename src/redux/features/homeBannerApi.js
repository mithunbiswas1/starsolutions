// src/redux/apiSlice/homeBannerApi.js
import { apiSlice } from "@/redux/apiSlice/apiSlice";
import { endpoints } from "@/redux/apiSlice/endpoints";

export const homeBannerApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // ============ Public Routes ============

    // Get all active banners (for frontend)
    getActiveBanners: builder.query({
      query: () => ({
        url: endpoints.homeBanner.getActiveBanners,
        method: "GET",
      }),
      providesTags: ["HomeBanner"],
    }),

    // Get banner list with pagination, search, filter
    getHomeBannerList: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        // Add query parameters if they exist
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
            ? `${endpoints.homeBanner.getHomeBannerList}?${queryString}`
            : endpoints.homeBanner.getHomeBannerList,
          method: "GET",
        };
      },
      providesTags: ["HomeBanner"],
    }),

    // Get single banner by ID
    getHomeBannerById: builder.query({
      query: (id) => ({
        url: `${endpoints.homeBanner.getHomeBannerById}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "HomeBanner", id }],
    }),

    // ============ Protected Routes (Admin Only) ============

    // Create new banner
    createHomeBanner: builder.mutation({
      query: (data) => ({
        url: endpoints.homeBanner.createHomeBanner,
        method: "POST",
        body: data,
        // Don't set Content-Type header, let browser set it for FormData
        headers: {},
      }),
      invalidatesTags: ["HomeBanner"],
    }),

    // Update banner
    updateHomeBanner: builder.mutation({
      query: ({ id, data }) => ({
        url: `${endpoints.homeBanner.updateHomeBanner}/${id}`,
        method: "PUT",
        body: data,
        // Don't set Content-Type header, let browser set it for FormData
        headers: {},
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "HomeBanner", id },
        "HomeBanner",
      ],
    }),

    // Delete banner
    deleteHomeBanner: builder.mutation({
      query: (id) => ({
        url: `${endpoints.homeBanner.deleteHomeBanner}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HomeBanner"],
    }),

    // Toggle banner status
    toggleHomeBannerStatus: builder.mutation({
      query: ({ id }) => ({
        url: `${endpoints.homeBanner.toggleHomeBannerStatus}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "HomeBanner", id },
        "HomeBanner",
      ],
    }),

    // Bulk update banner order
    updateBannerOrder: builder.mutation({
      query: (banners) => ({
        url: endpoints.homeBanner.updateBannerOrder,
        method: "PUT",
        body: { banners },
      }),
      invalidatesTags: ["HomeBanner"],
    }),
  }),
});

// Export hooks
export const {
  // Public hooks
  useGetActiveBannersQuery,
  useGetHomeBannerListQuery,
  useGetHomeBannerByIdQuery,

  // Protected hooks
  useCreateHomeBannerMutation,
  useUpdateHomeBannerMutation,
  useDeleteHomeBannerMutation,
  useToggleHomeBannerStatusMutation,
  useUpdateBannerOrderMutation,
} = homeBannerApi;
