// src/app/(pages)/homepage/industry/add/page.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useCreateHomeIndustryMutation } from "@/redux/features/homeIndustryApi";

// Reusable Components
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { H5, P } from "@/components/ui/Typography";

// Validation Schema
const validationSchema = Yup.object({
  title: Yup.string()
    .required("Industry title is required")
    .max(100, "Title must be less than 100 characters"),
  description: Yup.string()
    .required("Industry description is required")
    .max(500, "Description must be less than 500 characters"),
  order: Yup.number().min(0, "Order must be a positive number").default(0),
});

export default function AddHomeIndustryPage() {
  const router = useRouter();
  const [createIndustry, { isLoading }] = useCreateHomeIndustryMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descCharCount, setDescCharCount] = useState(0);

  // Image state
  const [industryImage, setIndustryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      order: 0,
      is_active: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      // Validate image
      if (!industryImage) {
        toast.error("Please upload an industry image");
        return;
      }

      setIsSubmitting(true);

      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("order", values.order);
        formData.append("is_active", values.is_active);
        formData.append("image", industryImage);

        await createIndustry(formData).unwrap();

        toast.success("Industry created successfully!");
        router.push("/admin/homepage/industry");
      } catch (error) {
        console.error("Error creating industry:", error);
        toast.error(
          error?.data?.message ||
            "Failed to create industry. Please try again.",
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
      setIndustryImage(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setIndustryImage(null);
  };

  // Handle description change with character count
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue("description", value);
    setDescCharCount(value.length);
  };

  return (
    <main className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <LinkButton
            href="/admin/homepage/industry"
            variant="outline_primary"
            size="sm"
            className="inline-flex items-center gap-2"
          >
            ← Back to Industries
          </LinkButton>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <H5 className="text-3xl font-bold">Add New Industry</H5>
                <P className="text-gray-600 mt-1">
                  Add a new industry to showcase on the home page
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
                  "Create Industry"
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
                  label="Industry Title"
                  placeholder="Enter industry name"
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

                {/* Description */}
                <div>
                  <Textarea
                    id="description"
                    name="description"
                    label={
                      <span>
                        Description
                        <span className="text-red-500 ml-1">*</span>
                        <span className="text-gray-400 text-xs ml-2">
                          ({descCharCount}/500 characters)
                        </span>
                      </span>
                    }
                    placeholder="Enter industry description..."
                    value={formik.values.description}
                    onChange={handleDescriptionChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.description && formik.errors.description
                        ? formik.errors.description
                        : null
                    }
                    rows={4}
                    required
                  />
                  {descCharCount > 500 && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1.5 rounded">
                      ⚠️ Character count exceeds 500. Please shorten your
                      description.
                    </div>
                  )}
                </div>

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
                  Industry Image <span className="text-red-500">*</span>
                </label>

                {imagePreview ? (
                  <div className="relative">
                    <div className="relative aspect-square max-w-[300px] rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image
                        src={imagePreview}
                        alt="Industry image preview"
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
                      id="industry_image"
                    />
                    <label
                      htmlFor="industry_image"
                      className="cursor-pointer block"
                    >
                      <div className="text-5xl mb-4">🏭</div>
                      <P color="muted" className="mb-1 font-medium">
                        Click to upload industry image
                      </P>
                      <P color="muted" className="text-sm">
                        PNG, JPG, WebP (Recommended: 400x300)
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
                onClick={() => router.push("/admin/homepage/industry")}
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
                  "Create Industry"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

