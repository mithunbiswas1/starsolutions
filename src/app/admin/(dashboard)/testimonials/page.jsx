// src/app/(pages)/testimonials/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaStar, FaStarHalf } from "react-icons/fa";
import {
  useGetTestimonialListQuery,
  useDeleteTestimonialMutation,
  useToggleTestimonialStatusMutation,
} from "@/redux/features/testimonialApi";
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
const StatusBadge = ({ status, onToggle, testimonialId, isToggling }) => {
  const isActive = status === true || status === "true";

  return (
    <button
      onClick={() => onToggle(testimonialId)}
      disabled={isToggling}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all hover:scale-105 ${
        isActive
          ? "bg-green-50 text-green-600 hover:bg-green-100"
          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      } ${isToggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      title={`Click to ${isActive ? "deactivate" : "activate"} this testimonial`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-yellow-500"}`}
      />
      {isToggling ? (
        <>
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {isActive ? "Deactivating..." : "Activating..."}
        </>
      ) : isActive ? (
        "Active"
      ) : (
        "Inactive"
      )}
    </button>
  );
};

// Rating Stars Component
const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
      ))}
      {hasHalfStar && <FaStarHalf className="text-yellow-400 text-sm" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaStar key={`empty-${i}`} className="text-gray-300 text-sm" />
      ))}
    </div>
  );
};

// Status options
const STATUS_OPTIONS = [
  { id: 1, method_name: "All Status", value: "" },
  { id: 2, method_name: "Active", value: "active" },
  { id: 3, method_name: "Inactive", value: "inactive" },
];

// Rating options
const RATING_OPTIONS = [
  { id: 1, method_name: "All Ratings", value: "" },
  { id: 2, method_name: "5 Stars", value: "5" },
  { id: 3, method_name: "4 Stars", value: "4" },
  { id: 4, method_name: "3 Stars", value: "3" },
  { id: 5, method_name: "2 Stars", value: "2" },
  { id: 6, method_name: "1 Star", value: "1" },
];

// Sort options
const SORT_OPTIONS = [
  { id: 1, method_name: "Newest First", value: "createdAt-desc" },
  { id: 2, method_name: "Oldest First", value: "createdAt-asc" },
  { id: 3, method_name: "A-Z", value: "name-asc" },
  { id: 4, method_name: "Z-A", value: "name-desc" },
  { id: 5, method_name: "Highest Rating", value: "rating-desc" },
  { id: 6, method_name: "Lowest Rating", value: "rating-asc" },
];

export default function TestimonialsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedTestimonials, setSelectedTestimonials] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    testimonialId: null,
    testimonialName: "",
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
  if (status) queryParams.is_active = status === "active";
  if (rating) queryParams.rating = rating;

  const { data, error, isLoading, refetch } =
    useGetTestimonialListQuery(queryParams);
  const [deleteTestimonial] = useDeleteTestimonialMutation();
  const [toggleTestimonialStatus] = useToggleTestimonialStatusMutation();

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
      const allIds = testimonials.map((testimonial) => testimonial.id);
      setSelectedTestimonials(allIds);
    } else {
      setSelectedTestimonials([]);
    }
  };

  // Handle select single
  const handleSelectSingle = (id, checked) => {
    if (checked) {
      setSelectedTestimonials([...selectedTestimonials, id]);
    } else {
      setSelectedTestimonials(
        selectedTestimonials.filter((item) => item !== id),
      );
    }
  };

  // Handle toggle testimonial status
  const handleToggleStatus = async (testimonialId) => {
    try {
      setTogglingId(testimonialId);
      await toggleTestimonialStatus({ id: testimonialId }).unwrap();

      const testimonial = testimonials.find((t) => t.id === testimonialId);
      const newStatus = testimonial?.is_active ? "deactivated" : "activated";

      toast.success(
        `Testimonial from "${testimonial?.name}" has been ${newStatus} successfully!`,
      );
      refetch();
    } catch (error) {
      console.error("Error toggling testimonial status:", error);
      toast.error(
        error?.data?.message ||
          "Failed to update testimonial status. Please try again.",
      );
    } finally {
      setTogglingId(null);
    }
  };

  // Open delete modal
  const openDeleteModal = (id, name) => {
    setDeleteModal({
      isOpen: true,
      testimonialId: id,
      testimonialName: name,
    });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModal({
        isOpen: false,
        testimonialId: null,
        testimonialName: "",
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    const { testimonialId, testimonialName } = deleteModal;

    try {
      setIsDeleting(true);
      await deleteTestimonial(testimonialId).unwrap();
      toast.success(`"${testimonialName}" has been deleted successfully!`);
      setDeleteModal({
        isOpen: false,
        testimonialId: null,
        testimonialName: "",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error(
        error?.data?.message ||
          "Failed to delete testimonial. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Get testimonials data
  const testimonials = data?.data?.testimonials || [];
  const pagination = data?.data?.pagination || {};
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
  const truncateText = (text, maxLength = 60) => {
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
            selectedTestimonials.length === testimonials.length &&
            testimonials.length > 0
          }
          onCheckedChange={handleSelectAll}
          className="mx-2"
        />
      ),
      width: "50px",
      sticky: true,
      render: (_, row) => (
        <Checkbox
          checked={selectedTestimonials.includes(row.id)}
          onCheckedChange={(checked) => handleSelectSingle(row.id, checked)}
          className="mx-2"
        />
      ),
      headerClassName: "text-center",
      cellClassName: "text-center",
    },
    {
      key: "image",
      label: "Image",
      width: "80px",
      render: (_, row) =>
        row.image && row.image !== "default-testimonial.png" ? (
          <Image
            src={`${baseUriBackend}${row.image}`}
            alt={row.name}
            width={50}
            height={50}
            className="rounded-full object-cover h-12 w-12 border-2 border-gray-200"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm border-2 border-gray-200">
            {row.name?.charAt(0) || "U"}
          </div>
        ),
    },
    {
      key: "name",
      label: "Name",
      field: "name",
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{row.position}</div>
          <div className="text-xs text-gray-400">{row.company}</div>
        </div>
      ),
    },
    {
      key: "message",
      label: "Message",
      field: "message",
      render: (value) => (
        <span className="text-sm text-gray-600 italic">
          "{truncateText(value, 50)}"
        </span>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      field: "rating",
      sortable: true,
      render: (value) => <RatingStars rating={value || 5} />,
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
        if (!row || !row.id) {
          return <span className="text-gray-400">N/A</span>;
        }
        return (
          <StatusBadge
            status={value}
            onToggle={handleToggleStatus}
            testimonialId={row.id}
            isToggling={togglingId === row.id}
          />
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      width: "200px",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/testimonials/edit/${row.id}`}
            className="inline-flex items-center justify-center rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => openDeleteModal(row.id, row.name)}
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
            Testimonials
          </h1>
          <p className="text-sm text-gray-500">
            Manage all client testimonials from here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedTestimonials.length > 0 && (
            <button
              onClick={() => {
                const testimonial = testimonials.find(
                  (t) => t.id === selectedTestimonials[0],
                );
                if (testimonial)
                  openDeleteModal(
                    testimonial.id,
                    `${selectedTestimonials.length} testimonials`,
                  );
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              Delete Selected ({selectedTestimonials.length})
            </button>
          )}

          <Link
            href="/admin/testimonials/add"
            className="inline-flex items-center gap-2 rounded-lg bg-primary/90 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary"
          >
            <FaPlus size={14} />
            Add Testimonial
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Search testimonials..."
            showClearButton={true}
          />

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

          <SearchableSelect
            label=""
            placeholder="All Ratings"
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
              setPage(1);
            }}
            options={RATING_OPTIONS}
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
          data={testimonials}
          onSort={handleSort}
          currentSort={{ field: sortBy, direction: sortOrder }}
          isLoading={isLoading}
          emptyMessage="No testimonials found"
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
        itemTitle={deleteModal.testimonialName}
        isDeleting={isDeleting}
        itemType={
          selectedTestimonials.length > 1 ? "Testimonials" : "Testimonial"
        }
      />
    </div>
  );
}

