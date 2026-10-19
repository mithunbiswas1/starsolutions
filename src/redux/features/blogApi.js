// src/redux/features/blogApi.js

import { apiSlice } from "@/redux/apiSlice/apiSlice";
import { endpoints } from "@/redux/apiSlice/endpoints";

export const blogApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Public routes
    getAllBlogs: builder.query({
      query: () => ({
        url: endpoints.blog.getAllBlogs,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    getSitemapBlogs: builder.query({
      query: () => ({
        url: endpoints.blog.getSitemapBlogs,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    getListBlogs: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        // Add query parameters if they exist
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        if (params.category) queryParams.append("category", params.category);
        if (params.status) queryParams.append("status", params.status);
        if (params.search) queryParams.append("search", params.search);
        if (params.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

        const queryString = queryParams.toString();
        return {
          url: queryString
            ? `${endpoints.blog.getListBlogs}?${queryString}`
            : endpoints.blog.getListBlogs,
          method: "GET",
        };
      },
      providesTags: ["Blog"],
    }),

    getPopularBlogs: builder.query({
      query: () => ({
        url: endpoints.blog.getPopularBlogs,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    getBlogBySlug: builder.query({
      query: (slug) => ({
        url: `${endpoints.blog.getBlogBySlug}/${slug}`,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    getBlogById: builder.query({
      query: (id) => ({
        url: `${endpoints.blog.getBlogById}/${id}`,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    // Protected routes
    createBlog: builder.mutation({
      query: (data) => ({
        url: endpoints.blog.createBlog,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),

    updateBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `${endpoints.blog.updateBlog}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `${endpoints.blog.deleteBlog}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),

    toggleBlogStatus: builder.mutation({
      query: ({ id }) => ({
        url: `${endpoints.blog.toggleBlogStatus}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetSitemapBlogsQuery,
  useGetListBlogsQuery,
  useGetPopularBlogsQuery,
  useGetBlogBySlugQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useToggleBlogStatusMutation,
} = blogApi;
