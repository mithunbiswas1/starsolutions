// src/app/(pages)/homepage/banner/add/page.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useCreateHomeBannerMutation } from "@/redux/features/homeBannerApi";

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

export default function AddHomeBannerPage() {
  const router = useRouter();
  const [createBanner, { isLoading }] = useCreateHomeBannerMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image state
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

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
      // Validate image
      if (!bannerImage) {
        toast.error("Please upload a banner image");
        return;
      }

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
        formData.append("banner_image", bannerImage);

        await createBanner(formData).unwrap();

        toast.success("Banner created successfully!");
        router.push("/admin/homepage/banner");
      } catch (error) {
        console.error("Error creating banner:", error);
        toast.error(
          error?.data?.message || "Failed to create banner. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Image handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
      setBannerImage(file);
    }
  };

  const removeImage = () => {
    setBannerPreview(null);
    setBannerImage(null);
  };

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
                <H5 className="text-3xl font-bold">Add New Banner</H5>
                <P className="text-gray-600 mt-1">
                  Create a new home page banner
                </P>
              </div>
              <Button
                variant="primary"
                size="default"
                onClick={formik.handleSubmit}
                disabled={isSubmitting || isLoading}
                className="flex items-center gap-2"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Banner"
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
                  Banner Image <span className="text-red-500">*</span>
                </label>

                {bannerPreview ? (
                  <div className="relative">
                    <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image
                        src={bannerPreview}
                        alt="Banner preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 rounded-full bg-red-500 text-white w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ) : (
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
                        Click to upload banner image
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
                disabled={isSubmitting || isLoading}
                className="flex items-center gap-2"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Banner"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

