// app/(pages)/homepage/alliance/edit/[id]/page.jsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  useGetAllianceByIdQuery,
  useCreateOrUpdateAllianceMutation,
  useDeleteAllianceImageMutation,
} from "@/redux/features/homeAllianceApi";
import { baseUriBackend } from "@/redux/url/url";

// Components
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import Input from "@/components/ui/Input";
import { H5, P } from "@/components/ui/Typography";

// Validation Schema
const validationSchema = Yup.object({
  experience_year: Yup.number()
    .required("Experience year is required")
    .min(0, "Must be greater than 0"),
  client: Yup.number()
    .required("Client count is required")
    .min(0, "Must be greater than 0"),
  projects: Yup.number()
    .required("Projects count is required")
    .min(0, "Must be greater than 0"),
  countries: Yup.number()
    .required("Countries count is required")
    .min(0, "Must be greater than 0"),
});

export default function EditAlliancePage({ params }) {
  const router = useRouter();
  const { id } = React.use(params) || params;

  const [updateAlliance, { isLoading: isUpdating }] =
    useCreateOrUpdateAllianceMutation();
  const [deleteAllianceImage] = useDeleteAllianceImageMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingImage, setDeletingImage] = useState(null);

  // Image states
  const [allianceImage1, setAllianceImage1] = useState(null);
  const [allianceImage1Preview, setAllianceImage1Preview] = useState(null);
  const [allianceImage2, setAllianceImage2] = useState(null);
  const [allianceImage2Preview, setAllianceImage2Preview] = useState(null);
  const [allianceImage3, setAllianceImage3] = useState(null);
  const [allianceImage3Preview, setAllianceImage3Preview] = useState(null);
  const [allianceImage4, setAllianceImage4] = useState(null);
  const [allianceImage4Preview, setAllianceImage4Preview] = useState(null);

  // Existing image states
  const [existingImages, setExistingImages] = useState({
    alliance_image1: null,
    alliance_image2: null,
    alliance_image3: null,
    alliance_image4: null,
  });

  // Fetch alliance data
  const {
    data: allianceData,
    isLoading: isLoadingAlliance,
    refetch,
  } = useGetAllianceByIdQuery(id, { skip: !id });

  const formik = useFormik({
    initialValues: {
      experience_year: "",
      client: "",
      projects: "",
      countries: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const formData = new FormData();

        formData.append("experience_year", values.experience_year);
        formData.append("client", values.client);
        formData.append("projects", values.projects);
        formData.append("countries", values.countries);

        // New images
        if (allianceImage1) formData.append("alliance_image1", allianceImage1);
        if (allianceImage2) formData.append("alliance_image2", allianceImage2);
        if (allianceImage3) formData.append("alliance_image3", allianceImage3);
        if (allianceImage4) formData.append("alliance_image4", allianceImage4);

        // Preserve existing images that haven't been removed
        // The backend will keep existing images if not replaced

        await updateAlliance(formData).unwrap();
        toast.success("Alliance updated successfully!");
        router.push("/admin/homepage/alliance");
      } catch (error) {
        console.error("Error updating alliance:", error);
        toast.error(
          error?.data?.message ||
            "Failed to update alliance. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Set form values when alliance data is loaded
  useEffect(() => {
    if (allianceData?.data) {
      const alliance = allianceData.data;
      formik.setValues({
        experience_year: alliance.experience_year || "",
        client: alliance.client || "",
        projects: alliance.projects || "",
        countries: alliance.countries || "",
      });

      setExistingImages({
        alliance_image1: alliance.alliance_image1 || null,
        alliance_image2: alliance.alliance_image2 || null,
        alliance_image3: alliance.alliance_image3 || null,
        alliance_image4: alliance.alliance_image4 || null,
      });
    }
  }, [allianceData]);

  // Image handlers
  const handleAllianceImageUpload = (setter, setPreview) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setter(file);
    }
  };

  const removeNewImage = (setter, setPreview) => () => {
    setPreview(null);
    setter(null);
  };

  const removeExistingImage = async (imageKey) => {
    try {
      setDeletingImage(imageKey);
      await deleteAllianceImage({ id, imageKey }).unwrap();
      toast.success("Alliance image deleted successfully!");
      setExistingImages({ ...existingImages, [imageKey]: null });
      refetch();
    } catch (error) {
      toast.error("Failed to delete image");
    } finally {
      setDeletingImage(null);
    }
  };

  // If no id, show error
  if (!id) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-lg font-medium text-red-600">
                Invalid alliance ID
              </p>
              <LinkButton
                href="/admin/homepage/alliance"
                variant="outline_primary"
                className="mt-4"
              >
                ← Back to Alliance
              </LinkButton>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Loading state
  if (isLoadingAlliance) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading alliance...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const alliance = allianceData?.data;

  if (!alliance) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-lg font-medium text-gray-600">
                Alliance not found
              </p>
              <LinkButton
                href="/admin/homepage/alliance"
                variant="outline_primary"
                className="mt-4"
              >
                ← Back to Alliance
              </LinkButton>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <LinkButton
            href="/admin/homepage/alliance"
            variant="outline_primary"
            size="sm"
            className="inline-flex items-center gap-2"
          >
            ← Back to Alliance
          </LinkButton>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <H5 className="text-3xl font-bold">Edit Alliance</H5>
                <P className="text-gray-600 mt-1">
                  Update your alliance section
                </P>
              </div>
              <Button
                variant="primary"
                size="default"
                onClick={formik.handleSubmit}
                disabled={isSubmitting || isUpdating}
                className="flex items-center gap-2"
              >
                {isSubmitting || isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Alliance"
                )}
              </Button>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                <Input
                  id="experience_year"
                  name="experience_year"
                  label="Years Experience"
                  type="number"
                  placeholder="e.g., 15"
                  value={formik.values.experience_year}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.experience_year &&
                    formik.errors.experience_year
                      ? formik.errors.experience_year
                      : null
                  }
                  required
                />

                <Input
                  id="client"
                  name="client"
                  label="Happy Clients"
                  type="number"
                  placeholder="e.g., 500"
                  value={formik.values.client}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.client && formik.errors.client
                      ? formik.errors.client
                      : null
                  }
                  required
                />

                <Input
                  id="projects"
                  name="projects"
                  label="Projects Done"
                  type="number"
                  placeholder="e.g., 1200"
                  value={formik.values.projects}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.projects && formik.errors.projects
                      ? formik.errors.projects
                      : null
                  }
                  required
                />

                <Input
                  id="countries"
                  name="countries"
                  label="Countries Served"
                  type="number"
                  placeholder="e.g., 50"
                  value={formik.values.countries}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.countries && formik.errors.countries
                      ? formik.errors.countries
                      : null
                  }
                  required
                />
              </div>

              {/* Right Column - Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Alliance Images
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "alliance_image1", label: "Image 1", index: 1 },
                    { key: "alliance_image2", label: "Image 2", index: 2 },
                    { key: "alliance_image3", label: "Image 3", index: 3 },
                    { key: "alliance_image4", label: "Image 4", index: 4 },
                  ].map((item) => {
                    const imageStates = [
                      allianceImage1Preview,
                      allianceImage2Preview,
                      allianceImage3Preview,
                      allianceImage4Preview,
                    ];
                    const imageSetters = [
                      setAllianceImage1,
                      setAllianceImage2,
                      setAllianceImage3,
                      setAllianceImage4,
                    ];
                    const imagePreviews = [
                      setAllianceImage1Preview,
                      setAllianceImage2Preview,
                      setAllianceImage3Preview,
                      setAllianceImage4Preview,
                    ];

                    const idx = item.index - 1;
                    const hasNewImage = imageStates[idx];
                    const hasExistingImage =
                      existingImages[item.key] &&
                      existingImages[item.key] !== "default-alliance.png";

                    return (
                      <div key={item.key} className="relative">
                        {/* Show new image preview */}
                        {hasNewImage && (
                          <div className="relative aspect-square rounded-lg overflow-hidden border border-green-500">
                            <Image
                              src={hasNewImage}
                              alt={item.label}
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                imagePreviews[idx](null);
                                imageSetters[idx](null);
                              }}
                              className="absolute top-1 right-1 rounded-full bg-red-500 text-white w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-sm"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                              New
                            </div>
                          </div>
                        )}

                        {/* Show existing image */}
                        {!hasNewImage && hasExistingImage && (
                          <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                            <Image
                              src={`${baseUriBackend}/${existingImages[item.key]}`}
                              alt={item.label}
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(item.key)}
                              disabled={deletingImage === item.key}
                              className="absolute top-1 right-1 rounded-full bg-red-500 text-white w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-sm opacity-0 group-hover:opacity-100"
                            >
                              {deletingImage === item.key ? "..." : "×"}
                            </button>
                            <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                              Current
                            </div>
                          </div>
                        )}

                        {/* Upload button when no image */}
                        {!hasNewImage && !hasExistingImage && (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center aspect-square flex items-center justify-center hover:border-primary transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAllianceImageUpload(
                                imageSetters[idx],
                                imagePreviews[idx],
                              )}
                              className="hidden"
                              id={`alliance_image_${item.index}`}
                            />
                            <label
                              htmlFor={`alliance_image_${item.index}`}
                              className="cursor-pointer block w-full"
                            >
                              <div className="text-3xl mb-1">🖼️</div>
                              <P color="muted" className="text-xs">
                                {item.label}
                              </P>
                            </label>
                          </div>
                        )}

                        {/* Change image button when image exists */}
                        {(hasNewImage || hasExistingImage) && (
                          <div className="mt-1">
                            <label
                              htmlFor={`alliance_image_change_${item.index}`}
                              className="text-xs text-primary cursor-pointer hover:underline"
                            >
                              Change image
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAllianceImageUpload(
                                imageSetters[idx],
                                imagePreviews[idx],
                              )}
                              className="hidden"
                              id={`alliance_image_change_${item.index}`}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Upload alliance partner logos (PNG, JPG, WebP)
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => router.push("/admin/homepage/alliance")}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={isSubmitting || isUpdating}
                className="flex items-center gap-2"
              >
                {isSubmitting || isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Alliance"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

