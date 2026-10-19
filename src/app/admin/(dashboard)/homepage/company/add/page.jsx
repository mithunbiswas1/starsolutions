// src/app/(pages)/homepage/company/add/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useCreateHomeCompanyMutation } from "@/redux/features/homeCompanyApi";

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

export default function AddHomeCompanyPage() {
  const router = useRouter();
  const [createCompany, { isLoading }] = useCreateHomeCompanyMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image state
  const [companyImage, setCompanyImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      order: 0,
      is_active: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      // Validate image
      if (!companyImage) {
        toast.error("Please upload a company image");
        return;
      }

      setIsSubmitting(true);

      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("order", values.order);
        formData.append("is_active", values.is_active);
        formData.append("image", companyImage);

        await createCompany(formData).unwrap();

        toast.success("Company created successfully!");
        router.push("/admin/homepage/company");
      } catch (error) {
        console.error("Error creating company:", error);
        toast.error(
          error?.data?.message || "Failed to create company. Please try again.",
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
      setImagePreview(url);
      setCompanyImage(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setCompanyImage(null);
  };

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
                <H5 className="text-3xl font-bold">Add New Company</H5>
                <P className="text-gray-600 mt-1">
                  Add a new company to showcase on the home page
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
                  "Create Company"
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
                  Company Logo <span className="text-red-500">*</span>
                </label>

                {imagePreview ? (
                  <div className="relative">
                    <div className="relative aspect-square max-w-[300px] rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image
                        src={imagePreview}
                        alt="Company logo preview"
                        fill
                        className="object-contain p-4"
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
                disabled={isSubmitting || isLoading}
                className="flex items-center gap-2"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Company"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

