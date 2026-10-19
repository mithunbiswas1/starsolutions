// src/app/(pages)/packages/page.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import {
  useGetPackageListQuery,
  useDeletePackageMutation,
  useTogglePackageStatusMutation,
} from "@/redux/features/packageApi";
import Pagination from "@/components/ui/Pagination";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { format } from "date-fns";
import { toast } from "sonner";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { DataTable } from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";
import SearchInput from "@/components/ui/SearchInput";
import { Check, X } from "lucide-react";

// Status Badge Component with Toggle
const StatusBadge = ({ status, onToggle, packageId, isToggling }) => {
  const isActive = status === true || status === "true";

  return (
    <button
      onClick={() => onToggle(packageId)}
      disabled={isToggling}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all hover:scale-105 ${
        isActive
          ? "bg-green-50 text-green-600 hover:bg-green-100"
          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      } ${isToggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      title={`Click to ${isActive ? "deactivate" : "activate"} this package`}
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

// Theme Badge
const ThemeBadge = ({ theme }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {theme === "dark" ? "Dark" : "Light"}
    </span>
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
  { id: 1, method_name: "Order (ASC)", value: "order-asc" },
  { id: 2, method_name: "Order (DESC)", value: "order-desc" },
  { id: 3, method_name: "Name A-Z", value: "name-asc" },
  { id: 4, method_name: "Name Z-A", value: "name-desc" },
  { id: 5, method_name: "Newest First", value: "createdAt-desc" },
  { id: 6, method_name: "Oldest First", value: "createdAt-asc" },
];

export default function PackagesPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("order");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    packageId: null,
    packageName: "",
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
    useGetPackageListQuery(queryParams);
  const [deletePackage] = useDeletePackageMutation();
  const [togglePackageStatus] = useTogglePackageStatusMutation();

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
      const allIds = packages.map((pkg) => pkg.id);
      setSelectedPackages(allIds);
    } else {
      setSelectedPackages([]);
    }
  };

  // Handle select single
  const handleSelectSingle = (id, checked) => {
    if (checked) {
      setSelectedPackages([...selectedPackages, id]);
    } else {
      setSelectedPackages(selectedPackages.filter((item) => item !== id));
    }
  };

  // Handle toggle package status
  const handleToggleStatus = async (packageId) => {
    try {
      setTogglingId(packageId);
      await togglePackageStatus({ id: packageId }).unwrap();

      const pkg = packages.find((p) => p.id === packageId);
      const newStatus = pkg?.is_active ? "deactivated" : "activated";

      toast.success(
        `Package "${pkg?.name}" has been ${newStatus} successfully!`,
      );
      refetch();
    } catch (error) {
      console.error("Error toggling package status:", error);
      toast.error(
        error?.data?.message ||
          "Failed to update package status. Please try again.",
      );
    } finally {
      setTogglingId(null);
    }
  };

  // Open delete modal
  const openDeleteModal = (id, name) => {
    setDeleteModal({
      isOpen: true,
      packageId: id,
      packageName: name,
    });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModal({
        isOpen: false,
        packageId: null,
        packageName: "",
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    const { packageId, packageName } = deleteModal;

    try {
      setIsDeleting(true);
      await deletePackage(packageId).unwrap();
      toast.success(`"${packageName}" has been deleted successfully!`);
      setDeleteModal({
        isOpen: false,
        packageId: null,
        packageName: "",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error(
        error?.data?.message || "Failed to delete package. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Get packages data
  const packages = data?.data?.packages || [];
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

  // Define columns
  const columns = [
    {
      key: "select",
      label: (
        <Checkbox
          checked={
            selectedPackages.length === packages.length && packages.length > 0
          }
          onCheckedChange={handleSelectAll}
          className="mx-2"
        />
      ),
      width: "50px",
      sticky: true,
      render: (_, row) => (
        <Checkbox
          checked={selectedPackages.includes(row.id)}
          onCheckedChange={(checked) => handleSelectSingle(row.id, checked)}
          className="mx-2"
        />
      ),
      headerClassName: "text-center",
      cellClassName: "text-center",
    },
    {
      key: "name",
      label: "Name",
      field: "name",
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "price",
      label: "Price",
      field: "price",
      sortable: true,
      render: (value) => (
        <span className="font-bold text-gray-900">{value}</span>
      ),
    },
    {
      key: "billing",
      label: "Billing",
      field: "billing",
      render: (value) => <span className="text-sm text-gray-600">{value}</span>,
    },
    {
      key: "theme",
      label: "Theme",
      field: "theme",
      render: (value) => <ThemeBadge theme={value} />,
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
            packageId={row.id}
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
            href={`/packages/edit/${row.id}`}
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
            Packages
          </h1>
          <p className="text-sm text-gray-500">
            Manage all pricing packages from here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedPackages.length > 0 && (
            <button
              onClick={() => {
                const pkg = packages.find((p) => p.id === selectedPackages[0]);
                if (pkg)
                  openDeleteModal(
                    pkg.id,
                    `${selectedPackages.length} packages`,
                  );
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              Delete Selected ({selectedPackages.length})
            </button>
          )}

          <Link
            href="/admin/packages/add"
            className="inline-flex items-center gap-2 rounded-lg bg-primary/90 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary"
          >
            <FaPlus size={14} />
            Add Package
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Search packages..."
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
          data={packages}
          onSort={handleSort}
          currentSort={{ field: sortBy, direction: sortOrder }}
          isLoading={isLoading}
          emptyMessage="No packages found"
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
        itemTitle={deleteModal.packageName}
        isDeleting={isDeleting}
        itemType={selectedPackages.length > 1 ? "Packages" : "Package"}
      />
    </div>
  );
}

