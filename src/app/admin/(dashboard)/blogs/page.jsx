// app/blogs/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";
import {
  useGetListBlogsQuery,
  useDeleteBlogMutation,
  useToggleBlogStatusMutation,
} from "@/redux/features/blogApi";
import Pagination from "@/components/ui/Pagination";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { format } from "date-fns";
import { baseUriBackend } from "@/redux/url/url";
import { toast } from "sonner";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { DataTable } from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";
import SearchInput from "@/components/ui/SearchInput";

// Status Badge Component with Toggle
const StatusBadge = ({ status, onToggle, blogId, isToggling }) => {
  const isActive = status === true || status === "true";

  return (
    <button
      onClick={() => onToggle(blogId)}
      disabled={isToggling}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all hover:scale-105 ${
        isActive
          ? "bg-primary/10 text-primary hover:bg-primary/20"
          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      } ${isToggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      title={`Click to ${isActive ? "deactivate" : "activate"} this blog`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-primary/80" : "bg-yellow-500"}`}
      />
      {isToggling ? (
        <>
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {isActive ? "Deactivating..." : "Activating..."}
        </>
      ) : isActive ? (
        "Published"
      ) : (
        "Draft"
      )}
    </button>
  );
};

// Category options for filter
const CATEGORY_OPTIONS = [
  { id: 1, method_name: "All Categories", value: "" },
  { id: 2, method_name: "Mobile App", value: "Mobile App" },
  { id: 3, method_name: "Web Development", value: "Web Development" },
  { id: 4, method_name: "Software Development", value: "Software Development" },
  { id: 5, method_name: "E-commerce", value: "E-commerce" },
  { id: 6, method_name: "Healthcare", value: "Healthcare" },
  {
    id: 7,
    method_name: "AI & Machine Learning",
    value: "AI & Machine Learning",
  },
  { id: 8, method_name: "Blockchain", value: "Blockchain" },
];

// Status options
const STATUS_OPTIONS = [
  { id: 1, method_name: "All Status", value: "" },
  { id: 2, method_name: "Published", value: "published" },
  { id: 3, method_name: "Draft", value: "draft" },
];

// Sort options
const SORT_OPTIONS = [
  { id: 1, method_name: "Newest First", value: "createdAt-desc" },
  { id: 2, method_name: "Oldest First", value: "createdAt-asc" },
  { id: 3, method_name: "A-Z", value: "title-asc" },
  { id: 4, method_name: "Z-A", value: "title-desc" },
];

export default function BlogsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    blogId: null,
    blogTitle: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Build query params
  const queryParams = {
    page,
    limit,
    sortBy,
    sortOrder,
  };

  if (search) queryParams.search = search;
  if (category) queryParams.category = category;
  if (status) queryParams.is_active = status === "published";

  const { data, error, isLoading, refetch } = useGetListBlogsQuery(queryParams);
  const [deleteBlog] = useDeleteBlogMutation();
  const [toggleBlogStatus] = useToggleBlogStatusMutation();

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
      const allIds = blogs.map((blog) => blog.id);
      setSelectedBlogs(allIds);
    } else {
      setSelectedBlogs([]);
    }
  };

  // Handle select single
  const handleSelectSingle = (id, checked) => {
    if (checked) {
      setSelectedBlogs([...selectedBlogs, id]);
    } else {
      setSelectedBlogs(selectedBlogs.filter((item) => item !== id));
    }
  };

  // Handle toggle blog status
  const handleToggleStatus = async (blogId) => {
    try {
      setTogglingId(blogId);

      // ✅ Fix: Pass the ID as an object with id property
      await toggleBlogStatus({ id: blogId }).unwrap();

      // Find the blog to show appropriate message
      const blog = blogs.find((b) => b.id === blogId);
      const newStatus = blog?.is_active ? "deactivated" : "activated";

      toast.success(
        `Blog "${blog?.title}" has been ${newStatus} successfully!`,
      );
      refetch();
    } catch (error) {
      console.error("Error toggling blog status:", error);
      toast.error(
        error?.data?.message ||
          "Failed to update blog status. Please try again.",
      );
    } finally {
      setTogglingId(null);
    }
  };

  // Open delete modal
  const openDeleteModal = (id, title) => {
    setDeleteModal({
      isOpen: true,
      blogId: id,
      blogTitle: title,
    });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModal({
        isOpen: false,
        blogId: null,
        blogTitle: "",
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    const { blogId, blogTitle } = deleteModal;

    try {
      setIsDeleting(true);
      await deleteBlog(blogId).unwrap();
      toast.success(`"${blogTitle}" has been deleted successfully!`);
      setDeleteModal({
        isOpen: false,
        blogId: null,
        blogTitle: "",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error(
        error?.data?.message || "Failed to delete blog. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Get blogs data
  const blogs = data?.data?.blogs || [];
  const pagination = data?.data?.pagination || {};
  const { currentPage = 1, totalPages = 1, totalCount = 0 } = pagination;

  // Calculate start and end index for showing items info
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(currentPage * limit, totalCount);

  // Handle search
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  // Define columns for DataTable with sticky checkbox
  const columns = [
    {
      key: "select",
      label: (
        <Checkbox
          checked={selectedBlogs.length === blogs.length && blogs.length > 0}
          onCheckedChange={handleSelectAll}
          className="mx-2"
        />
      ),
      width: "50px",
      sticky: true,
      render: (_, row) => (
        <Checkbox
          checked={selectedBlogs.includes(row.id)}
          onCheckedChange={(checked) => handleSelectSingle(row.id, checked)}
          className="mx-2"
        />
      ),
      headerClassName: "text-center",
      cellClassName: "text-center",
    },
    {
      key: "thumbnail",
      label: "Thumbnail",
      width: "100px",
      render: (_, row) =>
        row.thumbnail && row.thumbnail !== "default-thumbnail.png" ? (
          <Image
            src={`${baseUriBackend}${row.thumbnail}`}
            alt={row.title}
            width={70}
            height={50}
            className="rounded-lg object-cover h-12 w-20"
          />
        ) : (
          <div className="h-12 w-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs border border-gray-200">
            No image
          </div>
        ),
    },
    {
      key: "title",
      label: "Title",
      field: "title",
      sortable: true,
      render: (value, row) => (
        <Link
          href={`/blogs/${row.slug}`}
          className="font-semibold hover:text-primary/90 transition-colors line-clamp-2"
        >
          {value}
        </Link>
      ),
    },
    {
      key: "category",
      label: "Category",
      field: "category",
      render: (value) => (
        <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-primary">
          {value}
        </span>
      ),
    },
    {
      key: "createBy",
      label: "Created By",
      field: "createBy",
      render: (value) => {
        const fullName = value?.fullName || value || "Unknown";
        const initial = fullName?.charAt(0) || "U";
        return (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary/90 text-xs font-semibold">
              {initial}
            </div>
            <span className="text-sm">{fullName}</span>
          </div>
        );
      },
    },
    {
      key: "createdAt",
      label: "Created At",
      field: "createdAt",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value ? format(new Date(value), "dd MMM yyyy") : "N/A"}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      field: "is_active",
      render: (value, row) => {
        // ✅ Ensure row and row.id exist
        if (!row || !row.id) {
          return <span className="text-gray-400">N/A</span>;
        }
        return (
          <StatusBadge
            status={value}
            onToggle={handleToggleStatus}
            blogId={row.id}
            isToggling={togglingId === row.id}
          />
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      width: "220px",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/blogs/${row.slug}`}
            className="inline-flex items-center justify-center rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-100 transition-colors"
          >
            View
          </Link>
          <Link
            href={`/blogs/edit/${row.id}`}
            className="inline-flex items-center justify-center rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => openDeleteModal(row.id, row.title)}
            className="inline-flex items-center justify-center rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
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
            Blogs
          </h1>
          <p className="text-sm text-gray-500">
            Manage all blog posts from here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedBlogs.length > 0 && (
            <button
              onClick={() => {
                const blog = blogs.find((b) => b.id === selectedBlogs[0]);
                if (blog)
                  openDeleteModal(blog.id, `${selectedBlogs.length} blogs`);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              Delete Selected ({selectedBlogs.length})
            </button>
          )}

          <Link
            href="/admin/blogs/add"
            className="inline-flex items-center gap-2 rounded-lg bg-primary/90 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary"
          >
            <FaPlus size={14} />
            Add Blog
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          {/* Search - Reusable Component */}
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Search blog..."
            showClearButton={true}
          />

          {/* Category - SearchableSelect */}
          <SearchableSelect
            label=""
            placeholder="All Categories"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            options={CATEGORY_OPTIONS}
            className="py-2.5 text-sm"
          />

          {/* Status - SearchableSelect */}
          <SearchableSelect
            label=""
            placeholder="All Status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            options={STATUS_OPTIONS}
            className="py-2.5 text-sm"
          />

          {/* Sorting - SearchableSelect */}
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

      {/* Table with fixed height and scroll */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <DataTable
          columns={columns}
          data={blogs}
          onSort={handleSort}
          currentSort={{ field: sortBy, direction: sortOrder }}
          isLoading={isLoading}
          emptyMessage="No blogs found"
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
        itemTitle={deleteModal.blogTitle}
        isDeleting={isDeleting}
        itemType={selectedBlogs.length > 1 ? "Blogs" : "Blog"}
      />
    </div>
  );
}

