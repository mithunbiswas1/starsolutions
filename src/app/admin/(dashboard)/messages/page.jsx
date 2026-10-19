// src/app/(pages)/messages/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  useGetClientMessagesQuery,
  useDeleteClientMessageMutation,
  useMarkMessageAsReadMutation,
  useMarkMessageAsRepliedMutation,
  useGetUnreadCountQuery,
  useBulkDeleteMessagesMutation,
} from "@/redux/features/clientMessageApi";
import Pagination from "@/components/ui/Pagination";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import SearchInput from "@/components/ui/SearchInput";
import { DataTable } from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FaEnvelope, FaEnvelopeOpen, FaReply, FaTrash } from "react-icons/fa";

// Status Badge Component
const StatusBadge = ({ isRead, isReplied }) => {
  if (isRead) {
    return (
      <Badge variant="info" className="bg-green-100 text-green-700">
        Read
      </Badge>
    );
  }
  return (
    <Badge variant="warning" className="bg-yellow-100 text-yellow-700">
      Unread
    </Badge>
  );
};

// Status options
const READ_STATUS_OPTIONS = [
  { id: 1, method_name: "All Status", value: "" },
  { id: 2, method_name: "Read", value: "true" },
  { id: 3, method_name: "Unread", value: "false" },
];

const REPLIED_STATUS_OPTIONS = [
  { id: 1, method_name: "All", value: "" },
  { id: 2, method_name: "Replied", value: "true" },
  { id: 3, method_name: "Not Replied", value: "false" },
];

// Sort options
const SORT_OPTIONS = [
  { id: 1, method_name: "Newest First", value: "createdAt-desc" },
  { id: 2, method_name: "Oldest First", value: "createdAt-asc" },
];

export default function MessagesPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [isRead, setIsRead] = useState("");
  const [isReplied, setIsReplied] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    messageId: null,
    messageSubject: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Build query params
  const queryParams = {
    page,
    limit,
    sortBy,
    sortOrder,
  };

  if (search) queryParams.search = search;
  if (isRead !== "") queryParams.is_read = isRead;
  if (isReplied !== "") queryParams.is_replied = isReplied;

  const { data, error, isLoading, refetch } =
    useGetClientMessagesQuery(queryParams);
  const { data: unreadData, refetch: refetchUnread } = useGetUnreadCountQuery();
  const [deleteMessage] = useDeleteClientMessageMutation();
  const [markAsRead] = useMarkMessageAsReadMutation();
  const [markAsReplied] = useMarkMessageAsRepliedMutation();
  const [bulkDeleteMessages] = useBulkDeleteMessagesMutation();

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = messages.map((message) => message.id);
      setSelectedMessages(allIds);
    } else {
      setSelectedMessages([]);
    }
  };

  // Handle select single
  const handleSelectSingle = (id, checked) => {
    if (checked) {
      setSelectedMessages([...selectedMessages, id]);
    } else {
      setSelectedMessages(selectedMessages.filter((item) => item !== id));
    }
  };

  // Handle mark as read
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead({ id }).unwrap();
      toast.success("Message marked as read");
      refetch();
      refetchUnread();
    } catch (error) {
      toast.error("Failed to mark message as read");
    }
  };

  // Handle mark as replied
  const handleMarkAsReplied = async (id) => {
    try {
      await markAsReplied({ id }).unwrap();
      toast.success("Message marked as replied");
      refetch();
      refetchUnread();
    } catch (error) {
      toast.error("Failed to mark message as replied");
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedMessages.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedMessages.length} message(s)?`,
      )
    ) {
      try {
        await bulkDeleteMessages(selectedMessages).unwrap();
        toast.success(
          `${selectedMessages.length} message(s) deleted successfully`,
        );
        setSelectedMessages([]);
        refetch();
        refetchUnread();
      } catch (error) {
        toast.error("Failed to delete messages");
      }
    }
  };

  // Open delete modal
  const openDeleteModal = (id, subject) => {
    setDeleteModal({
      isOpen: true,
      messageId: id,
      messageSubject: subject,
    });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModal({
        isOpen: false,
        messageId: null,
        messageSubject: "",
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    const { messageId, messageSubject } = deleteModal;

    try {
      setIsDeleting(true);
      await deleteMessage(messageId).unwrap();
      toast.success(`"${messageSubject}" has been deleted successfully!`);
      setDeleteModal({
        isOpen: false,
        messageId: null,
        messageSubject: "",
      });
      refetch();
      refetchUnread();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Get messages data
  const messages = data?.data?.messages || [];
  const pagination = data?.data?.pagination || {};
  const unreadCount = unreadData?.data?.unreadCount || 0;
  const { currentPage = 1, totalPages = 1, totalCount = 0 } = pagination;

  // Calculate start and end index
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(currentPage * limit, totalCount);

  // Handle search
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  // Truncate text
  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Define columns
  const columns = [
    {
      key: "select",
      label: (
        <Checkbox
          checked={
            selectedMessages.length === messages.length && messages.length > 0
          }
          onCheckedChange={handleSelectAll}
          className="mx-2"
        />
      ),
      width: "50px",
      sticky: true,
      render: (_, row) => (
        <Checkbox
          checked={selectedMessages.includes(row.id)}
          onCheckedChange={(checked) => handleSelectSingle(row.id, checked)}
          className="mx-2"
        />
      ),
      headerClassName: "text-center",
      cellClassName: "text-center",
    },
    {
      key: "name",
      label: "Name & Email",
      field: "name",
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      field: "phone",
      render: (value) => <span className="text-sm text-gray-700">{value}</span>,
    },
    {
      key: "subject",
      label: "Subject",
      field: "subject",
      render: (value, row) => (
        <Link
          href={`/messages/${row.id}`}
          className={`font-medium hover:text-primary transition-colors ${
            !row.is_read ? "text-gray-900" : "text-gray-600"
          }`}
        >
          {!row.is_read && (
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          )}
          {truncateText(value, 40)}
        </Link>
      ),
    },
    {
      key: "message",
      label: "Message",
      field: "message",
      render: (value) => (
        <span className="text-sm text-gray-600">{truncateText(value, 40)}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Received",
      field: "createdAt",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value ? format(new Date(value), "dd MMM yyyy") : "N/A"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      field: "is_read",
      render: (value, row) => (
        <StatusBadge isRead={row.is_read} isReplied={row.is_replied} />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "320px",
      render: (_, row) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          {!row.is_read && (
            <button
              onClick={() => handleMarkAsRead(row.id)}
              className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-600 hover:bg-green-100 transition-colors"
              title="Mark as read"
            >
              <FaEnvelopeOpen size={12} />
              Read
            </button>
          )}
          {row.is_read && (
            <button
              onClick={() => handleMarkAsRead(row.id)}
              className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
              title="Mark as unread"
            >
              <FaEnvelope size={12} />
              Unread
            </button>
          )}

          <Link
            href={`/messages/${row.id}`}
            className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            View
          </Link>
          <button
            onClick={() => openDeleteModal(row.id, row.subject)}
            className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            <FaTrash size={12} />
            Delete
          </button>
        </div>
      ),
      headerClassName: "text-center",
      cellClassName: "text-center",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Client Messages
          </h1>
          <p className="text-sm text-gray-500">
            Manage all client messages from here.
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedMessages.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleBulkDelete}
              className="flex items-center gap-2"
            >
              <FaTrash size={14} />
              Delete Selected ({selectedMessages.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Search messages..."
            showClearButton={true}
          />

          <SearchableSelect
            label=""
            placeholder="Read Status"
            value={isRead}
            onChange={(e) => {
              setIsRead(e.target.value);
              setPage(1);
            }}
            options={READ_STATUS_OPTIONS}
            className="py-2.5 text-sm"
          />

          <SearchableSelect
            label=""
            placeholder="Replied Status"
            value={isReplied}
            onChange={(e) => {
              setIsReplied(e.target.value);
              setPage(1);
            }}
            options={REPLIED_STATUS_OPTIONS}
            className="py-2.5 text-sm"
          />

          <SearchableSelect
            label=""
            placeholder="Sort By"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split("-");
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
              setPage(1);
            }}
            options={SORT_OPTIONS}
            className="py-2.5 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <DataTable
          columns={columns}
          data={messages}
          onSort={handleSort}
          currentSort={{ field: sortBy, direction: sortOrder }}
          isLoading={isLoading}
          emptyMessage="No messages found"
          maxHeight="500px"
        />

        {/* Pagination */}
        {!isLoading && !error && totalCount > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalCount={totalCount}
            startIndex={startIndex}
            endIndex={endIndex}
            itemsPerPage={limit}
            siblingCount={1}
            showItemsInfo={true}
            className="border-t border-gray-200"
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        itemTitle={deleteModal.messageSubject}
        isDeleting={isDeleting}
        itemType="Message"
      />
    </div>
  );
}
