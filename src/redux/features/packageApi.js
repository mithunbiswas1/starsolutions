// src/redux/features/packageApi.js

import { apiSlice } from "@/redux/apiSlice/apiSlice";
import { endpoints } from "@/redux/apiSlice/endpoints";

export const packageApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // ============ Public Routes ============

    // Get all active packages (for frontend)
    getActivePackages: builder.query({
      query: () => ({
        url: endpoints.package.getActivePackages,
        method: "GET",
      }),
      providesTags: ["Package"],
    }),

    // Get package list with pagination, search, filter
    getPackageList: builder.query({
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
            ? `${endpoints.package.getPackageList}?${queryString}`
            : endpoints.package.getPackageList,
          method: "GET",
        };
      },
      providesTags: ["Package"],
    }),

    // Get single package by ID
    getPackageById: builder.query({
      query: (id) => ({
        url: `${endpoints.package.getPackageById}/${id}`,
        method: "GET",
      }),
      providesTags: ["Package"],
    }),

    // ============ Protected Routes (Admin Only) ============

    // Create new package
    createPackage: builder.mutation({
      query: (data) => ({
        url: endpoints.package.createPackage,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Package"],
    }),

    // Update package
    updatePackage: builder.mutation({
      query: ({ id, data }) => ({
        url: `${endpoints.package.updatePackage}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Package"],
    }),

    // Delete package
    deletePackage: builder.mutation({
      query: (id) => ({
        url: `${endpoints.package.deletePackage}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Package"],
    }),

    // Toggle package status
    togglePackageStatus: builder.mutation({
      query: ({ id }) => ({
        url: `${endpoints.package.togglePackageStatus}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Package"],
    }),

    // Bulk update package order
    updatePackageOrder: builder.mutation({
      query: (packages) => ({
        url: endpoints.package.updatePackageOrder,
        method: "PUT",
        body: { packages },
      }),
      invalidatesTags: ["Package"],
    }),
  }),
});

// Export hooks
export const {
  // Public hooks
  useGetActivePackagesQuery,
  useGetPackageListQuery,
  useGetPackageByIdQuery,

  // Protected hooks
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
  useTogglePackageStatusMutation,
  useUpdatePackageOrderMutation,
} = packageApi;
