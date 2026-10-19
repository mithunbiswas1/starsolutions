// src/redux/features/testimonialApi.js
import { apiSlice } from "@/redux/apiSlice/apiSlice";
import { endpoints } from "@/redux/apiSlice/endpoints";

export const testimonialApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // ============ Public Routes ============

    // Get all active testimonials (for frontend)
    getActiveTestimonials: builder.query({
      query: () => ({
        url: endpoints.testimonial.getActiveTestimonials,
        method: "GET",
      }),
      providesTags: ["Testimonial"],
    }),

    // Get testimonial list with pagination, search, filter
    getTestimonialList: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        if (params.search) queryParams.append("search", params.search);
        if (params.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
        if (params.is_active !== undefined)
          queryParams.append("is_active", params.is_active);
        if (params.rating) queryParams.append("rating", params.rating);

        const queryString = queryParams.toString();
        return {
          url: queryString
            ? `${endpoints.testimonial.getTestimonialList}?${queryString}`
            : endpoints.testimonial.getTestimonialList,
          method: "GET",
        };
      },
      providesTags: ["Testimonial"],
    }),

    // Get single testimonial by ID
    getTestimonialById: builder.query({
      query: (id) => ({
        url: `${endpoints.testimonial.getTestimonialById}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Testimonial", id }],
    }),

    // ============ Protected Routes (Admin Only) ============

    // Create new testimonial
    createTestimonial: builder.mutation({
      query: (data) => ({
        url: endpoints.testimonial.createTestimonial,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Testimonial"],
    }),

    // Update testimonial
    updateTestimonial: builder.mutation({
      query: ({ id, data }) => ({
        url: `${endpoints.testimonial.updateTestimonial}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Testimonial"],
    }),

    // Delete testimonial
    deleteTestimonial: builder.mutation({
      query: (id) => ({
        url: `${endpoints.testimonial.deleteTestimonial}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Testimonial"],
    }),

    // Toggle testimonial status
    toggleTestimonialStatus: builder.mutation({
      query: ({ id }) => ({
        url: `${endpoints.testimonial.toggleTestimonialStatus}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Testimonial"],
    }),

    // Bulk update testimonial order
    updateTestimonialOrder: builder.mutation({
      query: (testimonials) => ({
        url: endpoints.testimonial.updateTestimonialOrder,
        method: "PUT",
        body: { testimonials },
      }),
      invalidatesTags: ["Testimonial"],
    }),
  }),
});

// Export hooks
export const {
  // Public hooks
  useGetActiveTestimonialsQuery,
  useGetTestimonialListQuery,
  useGetTestimonialByIdQuery,

  // Protected hooks
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useToggleTestimonialStatusMutation,
  useUpdateTestimonialOrderMutation,
} = testimonialApi;
