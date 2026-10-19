// src/app/(pages)/homepage/industry/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaGripVertical } from "react-icons/fa";
import {
  useGetHomeIndustryListQuery,
  useDeleteHomeIndustryMutation,
  useToggleHomeIndustryStatusMutation,
} from "@/redux/features/homeIndustryApi";
import Pagination from "@/components/ui/Pagination";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { format } from "date-fns";
import { baseUriBackend } from "@/redux/url/url";
import { toast } from "sonner";
import SearchInput from "@/components/ui/SearchInput";
import { DataTable } from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";
import SearchableSelect from "@/components/ui/SearchableSelect";

// Status Badge Component with Toggle
const StatusBadge = ({ status, onToggle, industryId, isToggling }) => {
  const isActive = status === true || status === "true";

  return (
    <button
      onClick={() => onToggle(industryId)}
      disabled={isToggling}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all hover:scale-105 ${
        isActive
          ? "bg-green-50 text-green-600 hover:bg-green-100"
          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      } ${isToggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      title={`Click to ${isActive ? "deactivate" : "activate"} this industry`}
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

// Status options
const STATUS_OPTIONS = [
  { id: 1, method_name: "All Status", value: "" },
  { id: 2, method_name: "Active", value: "active" },
  { id: 3, method_name: "Inactive", value: "inactive" },
];

// Sort options
const SORT_OPTIONS = [
  { id: 1, method_name: "Newest First", value: "createdAt-desc" },
  { id: 2, method_name: "Oldest First", value: "createdAt-asc" },
  { id: 3, method_name: "A-Z", value: "title-asc" },
  { id: 4, method_name: "Z-A", value: "title-desc" },
  { id: 5, method_name: "Order Ascending", value: "order-asc" },
  { id: 6, method_name: "Order Descending", value: "order-desc" },
];

export default function HomeIndustriesPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    industryId: null,
    industryTitle: "",
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

  const { data, error, isLoading, refetch } =
    useGetHomeIndustryListQuery(queryParams);
  const [deleteIndustry] = useDeleteHomeIndustryMutation();
  const [toggleStatus] = useToggleHomeIndustryStatusMutation();

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
      const allIds = industries.map((industry) => industry.id);
      setSelectedIndustries(allIds);
    } else {
      setSelectedIndustries([]);
    }
  };

  // Handle select single
  const handleSelectSingle = (id, checked) => {
    if (checked) {
      setSelectedIndustries([...selectedIndustries, id]);
    } else {
      setSelectedIndustries(selectedIndustries.filter((item) => item !== id));
    }
  };

  // Handle toggle industry status
  const handleToggleStatus = async (industryId) => {
    try {
      setTogglingId(industryId);
      await toggleStatus({ id: industryId }).unwrap();

      const industry = industries.find((c) => c.id === industryId);
      const newStatus = industry?.is_active ? "deactivated" : "activated";

      toast.success(
        `Industry "${industry?.title}" has been ${newStatus} successfully!`,
      );
      refetch();
    } catch (error) {
      console.error("Error toggling industry status:", error);
      toast.error(
        error?.data?.message ||
          "Failed to update industry status. Please try again.",
      );
    } finally {
      setTogglingId(null);
    }
  };

  // Open delete modal
  const openDeleteModal = (id, title) => {
    setDeleteModal({
      isOpen: true,
      industryId: id,
      industryTitle: title,
    });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModal({
        isOpen: false,
        industryId: null,
        industryTitle: "",
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    const { industryId, industryTitle } = deleteModal;

    try {
      setIsDeleting(true);
      await deleteIndustry(industryId).unwrap();
      toast.success(`"${industryTitle}" has been deleted successfully!`);
      setDeleteModal({
        isOpen: false,
        industryId: null,
        industryTitle: "",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting industry:", error);
      toast.error(
        error?.data?.message || "Failed to delete industry. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Get industries data
  const industries = data?.data?.industries || [];
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

  // Truncate description
  const truncateDescription = (text, maxLength = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Define columns for DataTable
  const columns = [
    {
      key: "select",
      label: (
        <Checkbox
          checked={
            selectedIndustries.length === industries.length &&
            industries.length > 0
          }
          onCheckedChange={handleSelectAll}
          className="mx-2"
        />
      ),
      width: "50px",
      sticky: true,
      render: (_, row) => (
        <Checkbox
          checked={selectedIndustries.includes(row.id)}
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
      width: "120px",
      render: (_, row) =>
        row.image && row.image !== "default-industry.png" ? (
          <>
            {console.log("_abc_image_", `${baseUriBackend}${row.image}`)}
            <Image
              src={`${baseUriBackend}${row.image}`}
              alt={row.title}
              width={80}
              height={60}
              className="rounded-lg object-cover h-6 w-full bg-gray-50"
              unoptimized
            />
          </>
        ) : (
          <div className="h-14 w-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs border border-gray-200">
            No image
          </div>
        ),
    },
    {
      key: "title",
      label: "Title",
      field: "title",
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "description",
      label: "Description",
      field: "description",
      render: (value) => (
        <span className="text-sm text-gray-600">
          {truncateDescription(value, 30)}
        </span>
      ),
    },
    // {
    //   key: "order",
    //   label: "Order",
    //   field: "order",
    //   sortable: true,
    //   render: (value) => (
    //     <span className="inline-flex items-center gap-1">
    //       <FaGripVertical className="text-gray-400 text-xs" />
    //       {value || 0}
    //     </span>
    //   ),
    // },
    {
      key: "createdBy",
      label: "Created By",
      field: "createdBy",
      render: (value) => {
        const fullName = value?.fullName || value?.userName || "Unknown";
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
        if (!row || !row.id) {
          return <span className="text-gray-400">N/A</span>;
        }
        return (
          <StatusBadge
            status={value}
            onToggle={handleToggleStatus}
            industryId={row.id}
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
            href={`/homepage/industry/edit/${row.id}`}
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
            Home Industries
          </h1>
          <p className="text-sm text-gray-500">
            Manage all home page industries from here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedIndustries.length > 0 && (
            <button
              onClick={() => {
                const industry = industries.find(
                  (c) => c.id === selectedIndustries[0],
                );
                if (industry)
                  openDeleteModal(
                    industry.id,
                    `${selectedIndustries.length} industries`,
                  );
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              Delete Selected ({selectedIndustries.length})
            </button>
          )}

          <Link
            href="/admin/homepage/industry/add"
            className="inline-flex items-center gap-2 rounded-lg bg-primary/90 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary"
          >
            <FaPlus size={14} />
            Add Industry
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Search industries..."
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
          data={industries}
          onSort={handleSort}
          currentSort={{ field: sortBy, direction: sortOrder }}
          isLoading={isLoading}
          emptyMessage="No industries found"
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
        itemTitle={deleteModal.industryTitle}
        isDeleting={isDeleting}
        itemType={selectedIndustries.length > 1 ? "Industries" : "Industry"}
      />
    </div>
  );
}

