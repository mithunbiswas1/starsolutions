// src/app/(pages)/homepage/banner/edit/[id]/page.jsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  useGetHomeBannerByIdQuery,
  useUpdateHomeBannerMutation,
} from "@/redux/features/homeBannerApi";
import { baseUriBackend } from "@/redux/url/url";

// Reusable Components
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import Input from "@/components/ui/Input";
import { H5, P } from "@/components/ui/Typography";

// Validation Schema
const validationSchema = Yup.object({
  first_title: Yup.string()
    .required("First title is required")
    .max(100, "First title must be less than 100 characters"),
  sub_title: Yup.string().max(
    200,
    "Sub title must be less than 200 characters",
  ),
  middle_title: Yup.string()
    .required("Middle title is required")
    .max(100, "Middle title must be less than 100 characters"),
  last_title: Yup.string()
    .required("Last title is required")
    .max(100, "Last title must be less than 100 characters"),
  url: Yup.string()
    .url("Invalid URL format")
    .max(500, "URL must be less than 500 characters"),
  order: Yup.number().min(0, "Order must be a positive number").default(0),
});

export default function EditHomeBannerPage({ params }) {
  const router = useRouter();
  // Unwrap params using React.use() or use the async approach
  const { id } = React.use(params) || params;

  console.log("Banner ID:", id); // This should now show the ID

  const [updateBanner, { isLoading: isUpdating }] =
    useUpdateHomeBannerMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image states
  const [newBannerImage, setNewBannerImage] = useState(null);
  const [newBannerPreview, setNewBannerPreview] = useState(null);
  const [existingBannerImage, setExistingBannerImage] = useState(null);

  // Fetch banner data
  const { data: bannerData, isLoading: isLoadingBanner } =
    useGetHomeBannerByIdQuery(id, {
      skip: !id,
    });

  const formik = useFormik({
    initialValues: {
      first_title: "",
      sub_title: "",
      middle_title: "",
      last_title: "",
      url: "",
      order: 0,
      is_active: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const formData = new FormData();
        formData.append("first_title", values.first_title);
        formData.append("sub_title", values.sub_title);
        formData.append("middle_title", values.middle_title);
        formData.append("last_title", values.last_title);
        formData.append("url", values.url);
        formData.append("order", values.order);
        formData.append("is_active", values.is_active);

        if (newBannerImage) {
          formData.append("banner_image", newBannerImage);
        }

        await updateBanner({ id, data: formData }).unwrap();

        toast.success("Banner updated successfully!");
        router.push("/admin/homepage/banner");
      } catch (error) {
        console.error("Error updating banner:", error);
        toast.error(
          error?.data?.message || "Failed to update banner. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Set form values when banner data is loaded
  useEffect(() => {
    if (bannerData?.data) {
      const banner = bannerData.data;
      formik.setValues({
        first_title: banner.first_title || "",
        sub_title: banner.sub_title || "",
        middle_title: banner.middle_title || "",
        last_title: banner.last_title || "",
        url: banner.url || "",
        order: banner.order || 0,
        is_active: banner.is_active !== undefined ? banner.is_active : true,
      });

      if (banner.banner_image) {
        setExistingBannerImage(banner.banner_image);
      }
    }
  }, [bannerData]);

  // Image handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewBannerPreview(url);
      setNewBannerImage(file);
      setExistingBannerImage(null);
    }
  };

  const removeNewImage = () => {
    setNewBannerPreview(null);
    setNewBannerImage(null);
  };

  const removeExistingImage = () => {
    setExistingBannerImage(null);
  };

  // If no id, show error
  if (!id) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-lg font-medium text-red-600">
                Invalid banner ID
              </p>
              <LinkButton
                href="/admin/homepage/banner"
                variant="outline_primary"
                className="mt-4"
              >
                ← Back to Banners
              </LinkButton>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Loading state
  if (isLoadingBanner) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading banner...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const banner = bannerData?.data;

  if (!banner) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-lg font-medium text-gray-600">
                Banner not found
              </p>
              <LinkButton
                href="/admin/homepage/banner"
                variant="outline_primary"
                className="mt-4"
              >
                ← Back to Banners
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
            href="/admin/homepage/banner"
            variant="outline_primary"
            size="sm"
            className="inline-flex items-center gap-2"
          >
            ← Back to Banners
          </LinkButton>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <H5 className="text-3xl font-bold">Edit Banner</H5>
                <P className="text-gray-600 mt-1">
                  Update your home page banner
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
                  "Update Banner"
                )}
              </Button>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                {/* First Title */}
                <Input
                  id="first_title"
                  name="first_title"
                  label="First Title"
                  placeholder="Enter first title (e.g., Welcome to)"
                  value={formik.values.first_title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.first_title && formik.errors.first_title
                      ? formik.errors.first_title
                      : null
                  }
                  required
                />

                {/* Middle Title */}
                <Input
                  id="middle_title"
                  name="middle_title"
                  label="Middle Title"
                  placeholder="Enter middle title (e.g., Our Creative Agency)"
                  value={formik.values.middle_title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.middle_title && formik.errors.middle_title
                      ? formik.errors.middle_title
                      : null
                  }
                  required
                />

                {/* Last Title */}
                <Input
                  id="last_title"
                  name="last_title"
                  label="Last Title"
                  placeholder="Enter last title (e.g., We Build Amazing Things)"
                  value={formik.values.last_title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.last_title && formik.errors.last_title
                      ? formik.errors.last_title
                      : null
                  }
                  required
                />

                {/* Sub Title */}
                <Input
                  id="sub_title"
                  name="sub_title"
                  label="Sub Title"
                  placeholder="Enter sub title (e.g., Your trusted partner)"
                  value={formik.values.sub_title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.sub_title && formik.errors.sub_title
                      ? formik.errors.sub_title
                      : null
                  }
                  helperText="Optional: A subtitle for the banner"
                />

                {/* URL Field */}
                <Input
                  id="url"
                  name="url"
                  label="Banner URL"
                  type="url"
                  placeholder="https://example.com/page"
                  value={formik.values.url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.url && formik.errors.url
                      ? formik.errors.url
                      : null
                  }
                  helperText="Optional: Link the banner to a specific page"
                />

                {/* Order */}
                {/* <Input
                  id="order"
                  name="order"
                  label="Order"
                  type="number"
                  placeholder="0"
                  value={formik.values.order}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.order && formik.errors.order
                      ? formik.errors.order
                      : null
                  }
                  helperText="Lower numbers appear first"
                /> */}

                {/* Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formik.values.is_active}
                    onChange={formik.handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm font-medium text-gray-700"
                  >
                    Active
                  </label>
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>

                {/* Show existing image */}
                {existingBannerImage && !newBannerPreview && (
                  <div className="relative">
                    <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image
                        src={`${baseUriBackend}${existingBannerImage}`}
                        alt="Current banner"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeExistingImage}
                      className="absolute top-2 right-2 rounded-full bg-red-500 text-white w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      Current image (click × to remove)
                    </p>
                  </div>
                )}

                {/* Show new image preview */}
                {newBannerPreview && (
                  <div className="relative">
                    <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image
                        src={newBannerPreview}
                        alt="New banner preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeNewImage}
                      className="absolute top-2 right-2 rounded-full bg-red-500 text-white w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                    <p className="text-xs text-green-600 mt-2">
                      New image ready to upload
                    </p>
                  </div>
                )}

                {/* Upload button */}
                {!newBannerPreview && !existingBannerImage && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="banner_image"
                    />
                    <label
                      htmlFor="banner_image"
                      className="cursor-pointer block"
                    >
                      <div className="text-5xl mb-4">🖼️</div>
                      <P color="muted" className="mb-1 font-medium">
                        Click to upload new banner image
                      </P>
                      <P color="muted" className="text-sm">
                        PNG, JPG, WebP (Recommended: 1920x1080)
                      </P>
                      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                        Choose Image
                      </div>
                    </label>
                  </div>
                )}

                {/* Show upload button when image exists */}
                {!newBannerPreview && existingBannerImage && (
                  <div className="mt-3">
                    <label
                      htmlFor="banner_image_change"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="banner_image_change"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => router.push("/admin/homepage/banner")}
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
                  "Update Banner"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

