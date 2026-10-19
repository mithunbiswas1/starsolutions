// src/redux/features/clientMessageApi.js
import { apiSlice } from "@/redux/apiSlice/apiSlice";
import { endpoints } from "@/redux/apiSlice/endpoints";

export const clientMessageApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // ============ Public Routes ============

    // Create client message (Public)
    createClientMessage: builder.mutation({
      query: (data) => ({
        url: endpoints.clientMessage.createClientMessage,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ClientMessage"],
    }),

    // ============ Protected Routes (Admin Only) ============

    // Get all messages with pagination, search, filter
    getClientMessages: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        if (params.search) queryParams.append("search", params.search);
        if (params.is_read !== undefined && params.is_read !== "")
          queryParams.append("is_read", params.is_read);
        if (params.is_replied !== undefined && params.is_replied !== "")
          queryParams.append("is_replied", params.is_replied);
        if (params.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
        if (params.startDate) queryParams.append("startDate", params.startDate);
        if (params.endDate) queryParams.append("endDate", params.endDate);

        const queryString = queryParams.toString();
        return {
          url: queryString
            ? `${endpoints.clientMessage.getClientMessages}?${queryString}`
            : endpoints.clientMessage.getClientMessages,
          method: "GET",
        };
      },
      providesTags: ["ClientMessage"],
    }),

    // Get single message by ID
    getClientMessageById: builder.query({
      query: (id) => ({
        url: `${endpoints.clientMessage.getClientMessageById}/${id}`,
        method: "GET",
      }),
      providesTags: ["ClientMessage"],
    }),

    // Delete message
    deleteClientMessage: builder.mutation({
      query: (id) => ({
        url: `${endpoints.clientMessage.deleteClientMessage}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ClientMessage"],
    }),

    // Mark message as read
    markMessageAsRead: builder.mutation({
      query: ({ id }) => ({
        url: `${endpoints.clientMessage.markMessageAsRead}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["ClientMessage"],
    }),

    // Mark message as replied
    markMessageAsReplied: builder.mutation({
      query: ({ id }) => ({
        url: `${endpoints.clientMessage.markMessageAsReplied}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["ClientMessage"],
    }),

    // Get unread count
    getUnreadCount: builder.query({
      query: () => ({
        url: endpoints.clientMessage.getUnreadCount,
        method: "GET",
      }),
      providesTags: ["ClientMessage"],
    }),

    // Bulk delete messages
    bulkDeleteMessages: builder.mutation({
      query: (ids) => ({
        url: endpoints.clientMessage.bulkDeleteMessages,
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: ["ClientMessage"],
    }),
  }),
});

// Export hooks
export const {
  // Public hooks
  useCreateClientMessageMutation,

  // Protected hooks
  useGetClientMessagesQuery,
  useGetClientMessageByIdQuery,
  useDeleteClientMessageMutation,
  useMarkMessageAsReadMutation,
  useMarkMessageAsRepliedMutation,
  useGetUnreadCountQuery,
  useBulkDeleteMessagesMutation,
} = clientMessageApi;
