// src/redux/features/homeCompanyApi.js
import { apiSlice } from "@/redux/apiSlice/apiSlice";
import { endpoints } from "@/redux/apiSlice/endpoints";

export const homeCompanyApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // ============ Public Routes ============

    // Get all active companies (for frontend)
    getActiveCompanies: builder.query({
      query: () => ({
        url: endpoints.homeCompany.getActiveCompanies,
        method: "GET",
      }),
      providesTags: ["HomeCompany"],
    }),

    // Get company list with pagination, search, filter
    getHomeCompanyList: builder.query({
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
            ? `${endpoints.homeCompany.getHomeCompanyList}?${queryString}`
            : endpoints.homeCompany.getHomeCompanyList,
          method: "GET",
        };
      },
      providesTags: ["HomeCompany"],
    }),

    // Get single company by ID
    getHomeCompanyById: builder.query({
      query: (id) => ({
        url: `${endpoints.homeCompany.getHomeCompanyById}/${id}`,
        method: "GET",
      }),
      providesTags: ["HomeCompany"],
    }),

    // ============ Protected Routes (Admin Only) ============

    // Create new company
    createHomeCompany: builder.mutation({
      query: (data) => ({
        url: endpoints.homeCompany.createHomeCompany,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HomeCompany"],
    }),

    // Update company
    updateHomeCompany: builder.mutation({
      query: ({ id, data }) => ({
        url: `${endpoints.homeCompany.updateHomeCompany}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["HomeCompany"],
    }),

    // Delete company
    deleteHomeCompany: builder.mutation({
      query: (id) => ({
        url: `${endpoints.homeCompany.deleteHomeCompany}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HomeCompany"],
    }),

    // Toggle company status
    toggleHomeCompanyStatus: builder.mutation({
      query: ({ id }) => ({
        url: `${endpoints.homeCompany.toggleHomeCompanyStatus}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["HomeCompany"],
    }),

    // Bulk update company order
    updateCompanyOrder: builder.mutation({
      query: (companies) => ({
        url: endpoints.homeCompany.updateCompanyOrder,
        method: "PUT",
        body: { companies },
      }),
      invalidatesTags: ["HomeCompany"],
    }),
  }),
});

// Export hooks
export const {
  // Public hooks
  useGetActiveCompaniesQuery,
  useGetHomeCompanyListQuery,
  useGetHomeCompanyByIdQuery,

  // Protected hooks
  useCreateHomeCompanyMutation,
  useUpdateHomeCompanyMutation,
  useDeleteHomeCompanyMutation,
  useToggleHomeCompanyStatusMutation,
  useUpdateCompanyOrderMutation,
} = homeCompanyApi;
