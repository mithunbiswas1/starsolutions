// src/app/(pages)/homepage/company/edit/[id]/page.jsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  useGetHomeCompanyByIdQuery,
  useUpdateHomeCompanyMutation,
} from "@/redux/features/homeCompanyApi";
import { baseUriBackend } from "@/redux/url/url";

// Reusable Components
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import Input from "@/components/ui/Input";
import { H5, P } from "@/components/ui/Typography";

// Validation Schema
const validationSchema = Yup.object({
  title: Yup.string()
    .required("Company title is required")
    .max(100, "Title must be less than 100 characters"),
  order: Yup.number().min(0, "Order must be a positive number").default(0),
});

export default function EditHomeCompanyPage({ params }) {
  const router = useRouter();
  const { id } = React.use(params) || params;

  console.log("Company ID:", id);

  const [updateCompany, { isLoading: isUpdating }] =
    useUpdateHomeCompanyMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image states
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  // Fetch company data
  const { data: companyData, isLoading: isLoadingCompany } =
    useGetHomeCompanyByIdQuery(id, {
      skip: !id,
    });

  const formik = useFormik({
    initialValues: {
      title: "",
      order: 0,
      is_active: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("order", values.order);
        formData.append("is_active", values.is_active);

        if (newImage) {
          formData.append("image", newImage);
        }

        await updateCompany({ id, data: formData }).unwrap();

        toast.success("Company updated successfully!");
        router.push("/admin/homepage/company");
      } catch (error) {
        console.error("Error updating company:", error);
        toast.error(
          error?.data?.message || "Failed to update company. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Set form values when company data is loaded
  useEffect(() => {
    if (companyData?.data) {
      const company = companyData.data;
      formik.setValues({
        title: company.title || "",
        order: company.order || 0,
        is_active: company.is_active !== undefined ? company.is_active : true,
      });

      if (company.image) {
        setExistingImage(company.image);
      }
    }
  }, [companyData]);

  // Image handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewImagePreview(url);
      setNewImage(file);
      setExistingImage(null);
    }
  };

  const removeNewImage = () => {
    setNewImagePreview(null);
    setNewImage(null);
  };

  const removeExistingImage = () => {
    setExistingImage(null);
  };

  // If no id, show error
  if (!id) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-lg font-medium text-red-600">
                Invalid company ID
              </p>
              <LinkButton
                href="/admin/homepage/company"
                variant="outline_primary"
                className="mt-4"
              >
                ← Back to Companies
              </LinkButton>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Loading state
  if (isLoadingCompany) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading company...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const company = companyData?.data;

  if (!company) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-lg font-medium text-gray-600">
                Company not found
              </p>
              <LinkButton
                href="/admin/homepage/company"
                variant="outline_primary"
                className="mt-4"
              >
                ← Back to Companies
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
            href="/admin/homepage/company"
            variant="outline_primary"
            size="sm"
            className="inline-flex items-center gap-2"
          >
            ← Back to Companies
          </LinkButton>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <H5 className="text-3xl font-bold">Edit Company</H5>
                <P className="text-gray-600 mt-1">
                  Update your company information
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
                  "Update Company"
                )}
              </Button>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                {/* Title */}
                <Input
                  id="title"
                  name="title"
                  label="Company Title"
                  placeholder="Enter company name"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.title && formik.errors.title
                      ? formik.errors.title
                      : null
                  }
                  required
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
                  Company Logo
                </label>

                {/* Show existing image */}
                {existingImage && !newImagePreview && (
                  <div className="relative">
                    <div className="relative aspect-square max-w-[300px] rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image
                        src={`${baseUriBackend}${existingImage}`}
                        alt="Current company logo"
                        fill
                        className="object-contain p-4"
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
                {newImagePreview && (
                  <div className="relative">
                    <div className="relative aspect-square max-w-[300px] rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image
                        src={newImagePreview}
                        alt="New company logo preview"
                        fill
                        className="object-contain p-4"
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
                {!newImagePreview && !existingImage && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="company_image"
                    />
                    <label
                      htmlFor="company_image"
                      className="cursor-pointer block"
                    >
                      <div className="text-5xl mb-4">🏢</div>
                      <P color="muted" className="mb-1 font-medium">
                        Click to upload company logo
                      </P>
                      <P color="muted" className="text-sm">
                        PNG, JPG, WebP (Recommended: 200x200)
                      </P>
                      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                        Choose Image
                      </div>
                    </label>
                  </div>
                )}

                {/* Show upload button when image exists */}
                {!newImagePreview && existingImage && (
                  <div className="mt-3">
                    <label
                      htmlFor="company_image_change"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="company_image_change"
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
                onClick={() => router.push("/admin/homepage/company")}
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
                  "Update Company"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

