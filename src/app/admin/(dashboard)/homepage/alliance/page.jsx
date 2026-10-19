// app/(pages)/homepage/alliance/page.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { format } from "date-fns";
import { toast } from "sonner";
import { baseUriBackend } from "@/redux/url/url";
import {
  useGetAllianceQuery,
  useDeleteAllianceMutation,
  useToggleAllianceStatusMutation,
} from "@/redux/features/homeAllianceApi";
import { Button } from "@/components/ui/Button";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { H5, P } from "@/components/ui/Typography";

export default function AllianceListPage() {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    allianceId: null,
    allianceTitle: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const { data, isLoading, refetch } = useGetAllianceQuery();
  const [deleteAlliance] = useDeleteAllianceMutation();
  const [toggleAllianceStatus] = useToggleAllianceStatusMutation();

  const alliance = data?.data;

  // Handle toggle status
  const handleToggleStatus = async (id) => {
    try {
      setTogglingId(id);
      await toggleAllianceStatus({ id }).unwrap();
      toast.success("Alliance status updated successfully!");
      refetch();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error(error?.data?.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  // Open delete modal
  const openDeleteModal = (id, title) => {
    setDeleteModal({
      isOpen: true,
      allianceId: id,
      allianceTitle: title || "Alliance",
    });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModal({
        isOpen: false,
        allianceId: null,
        allianceTitle: "",
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    const { allianceId, allianceTitle } = deleteModal;

    try {
      setIsDeleting(true);
      await deleteAlliance(allianceId).unwrap();
      toast.success(`"${allianceTitle}" has been deleted successfully!`);
      setDeleteModal({
        isOpen: false,
        allianceId: null,
        allianceTitle: "",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting alliance:", error);
      toast.error(error?.data?.message || "Failed to delete alliance");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading alliance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Alliance Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage your alliance section from here.
          </p>
        </div>

        <Link
          href={
            alliance
              ? `/homepage/alliance/edit/${alliance.id}`
              : "/homepage/alliance/add"
          }
          className="inline-flex items-center gap-2 rounded-lg bg-primary/90 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary"
        >
          {alliance ? (
            <>
              <FaEdit size={14} />
              Edit Alliance
            </>
          ) : (
            <>
              <FaPlus size={14} />
              Create Alliance
            </>
          )}
        </Link>
      </div>

      {alliance ? (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Content Card */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Alliance Images Preview */}
              <div className="p-6 border-b border-gray-200">
                <H5 className="font-semibold mb-4">Alliance Images</H5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: "alliance_image1", label: "Image 1" },
                    { key: "alliance_image2", label: "Image 2" },
                    { key: "alliance_image3", label: "Image 3" },
                    { key: "alliance_image4", label: "Image 4" },
                  ].map((item) => {
                    const imageUrl = alliance[item.key];
                    const hasImage =
                      imageUrl && imageUrl !== "default-alliance.png";
                    return (
                      <div
                        key={item.key}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                      >
                        {hasImage ? (
                          <Image
                            src={`${baseUriBackend}${imageUrl}`}
                            alt={item.label}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            No Image
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats */}
              <div className="p-6">
                <H5 className="font-semibold mb-4">Statistics</H5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-700">
                      {alliance?.experience_year}+
                    </p>
                    <p className="text-sm text-gray-600">Years Experience</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-700">
                      {alliance?.client}+
                    </p>
                    <p className="text-sm text-gray-600">Happy Clients</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-700">
                      {alliance?.projects}+
                    </p>
                    <p className="text-sm text-gray-600">Projects Done</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-orange-700">
                      {alliance?.countries}+
                    </p>
                    <p className="text-sm text-gray-600">Countries Served</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <H5 className="font-semibold mb-4">Quick Actions</H5>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Status
                  </span>
                  <Button
                    variant={alliance?.is_active ? "success" : "warning"}
                    size="sm"
                    onClick={() => handleToggleStatus(alliance.id)}
                    disabled={togglingId === alliance.id}
                    className="flex items-center gap-2"
                  >
                    {togglingId === alliance.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : alliance?.is_active ? (
                      <>
                        <FaToggleOn /> Active
                      </>
                    ) : (
                      <>
                        <FaToggleOff /> Inactive
                      </>
                    )}
                  </Button>
                </div>

                <Link
                  href={`/homepage/alliance/edit/${alliance.id}`}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="text-blue-700 font-medium">
                    Edit Alliance
                  </span>
                  <FaEdit className="text-blue-700" />
                </Link>

                <button
                  onClick={() => openDeleteModal(alliance.id, "Alliance")}
                  className="flex items-center justify-between w-full p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <span className="text-red-700 font-medium">
                    Delete Alliance
                  </span>
                  <FaTrash className="text-red-700" />
                </button>
              </div>
            </div>

            {/* Information */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <H5 className="font-semibold mb-4">Information</H5>
              <div className="space-y-3">
                <div className="flex justify-between p-2 border-b border-gray-100">
                  <span className="text-gray-600">Created</span>
                  <span className="font-semibold">
                    {alliance?.createdAt
                      ? format(new Date(alliance.createdAt), "dd MMM yyyy")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between p-2 border-b border-gray-100">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-semibold">
                    {alliance?.updatedAt
                      ? format(
                          new Date(alliance.updatedAt),
                          "dd MMM yyyy, hh:mm a",
                        )
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between p-2">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-semibold ${
                      alliance?.is_active ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {alliance?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Alliance Created Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your alliance section to display partner logos and
              statistics.
            </p>
            <Link
              href="/admin/homepage/alliance/add"
              className="inline-flex items-center gap-2 rounded-lg bg-primary/90 px-6 py-3 text-sm font-medium text-white transition hover:bg-primary"
            >
              <FaPlus size={14} />
              Create Alliance
            </Link>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        itemTitle={deleteModal.allianceTitle}
        isDeleting={isDeleting}
        itemType="Alliance"
      />
    </div>
  );
}

