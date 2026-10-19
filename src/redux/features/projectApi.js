import { apiSlice } from "@/redux/apiSlice/apiSlice";
import { endpoints } from "@/redux/apiSlice/endpoints";

export const projectApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Public routes
    getAllProjects: builder.query({
      query: () => ({
        url: endpoints.project.getAllProjects,
        method: "GET",
      }),
      providesTags: ["Project"],
    }),

    getSitemapProjects: builder.query({
      query: () => ({
        url: endpoints.project.getSitemapProjects,
        method: "GET",
      }),
      providesTags: ["Project"],
    }),

    getListProjects: builder.query({
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
        if (params.is_active !== undefined)
          queryParams.append("is_active", params.is_active);
        if (params.createBy) queryParams.append("createBy", params.createBy);
        if (params.technologies)
          queryParams.append("technologies", params.technologies);

        const queryString = queryParams.toString();
        return {
          url: queryString
            ? `${endpoints.project.getListProjects}?${queryString}`
            : endpoints.project.getListProjects,
          method: "GET",
        };
      },
      providesTags: ["Project"],
    }),

    getPopularProjects: builder.query({
      query: (limit = 5) => ({
        url: `${endpoints.project.getPopularProjects}?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Project"],
    }),

    getProjectBySlug: builder.query({
      query: (slug) => ({
        url: `${endpoints.project.getProjectBySlug}/${slug}`,
        method: "GET",
      }),
      providesTags: ["Project"],
    }),

    getProjectById: builder.query({
      query: (id) => ({
        url: `${endpoints.project.getProjectById}/${id}`,
        method: "GET",
      }),
      providesTags: ["Project"],
    }),

    // Protected routes
    createProject: builder.mutation({
      query: (data) => ({
        url: endpoints.project.createProject,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Project"],
    }),

    updateProject: builder.mutation({
      query: ({ id, data }) => ({
        url: `${endpoints.project.updateProject}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Project"],
    }),

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `${endpoints.project.deleteProject}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),

    toggleProjectStatus: builder.mutation({
      query: ({ id }) => ({
        url: `${endpoints.project.toggleProjectStatus}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useGetAllProjectsQuery,
  useGetSitemapProjectsQuery,
  useGetListProjectsQuery,
  useGetPopularProjectsQuery,
  useGetProjectBySlugQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useToggleProjectStatusMutation,
} = projectApi;
