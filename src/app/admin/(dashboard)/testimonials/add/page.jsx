// src/app/(pages)/testimonials/add/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

// Reusable Components
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { H5, P } from "@/components/ui/Typography";
import { useCreateTestimonialMutation } from "@/redux/features/testimonialApi";

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .max(100, "Name must be less than 100 characters"),
  position: Yup.string()
    .required("Position is required")
    .max(100, "Position must be less than 100 characters"),
  company: Yup.string()
    .required("Company name is required")
    .max(100, "Company name must be less than 100 characters"),
  message: Yup.string()
    .required("Message is required")
    .max(1000, "Message must be less than 1000 characters"),
  rating: Yup.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5")
    .default(5),
});

export default function AddTestimonialPage() {
  const router = useRouter();
  const [createTestimonial, { isLoading }] = useCreateTestimonialMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msgCharCount, setMsgCharCount] = useState(0);
  const [actionType, setActionType] = useState("publish");

  // Image state
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      position: "",
      company: "",
      message: "",
      rating: 5,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);

      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("position", values.position);
        formData.append("company", values.company);
        formData.append("message", values.message);
        formData.append("rating", values.rating);

        if (image) {
          formData.append("image", image);
        }

        // Set is_active based on action type
        const isActive = actionType === "publish";
        formData.append("is_active", isActive);

        await createTestimonial(formData).unwrap();

        const successMessage = isActive
          ? "Testimonial published successfully!"
          : "Testimonial saved as draft successfully!";

        toast.success(successMessage);
        router.push("/admin/testimonials");
      } catch (error) {
        console.error("Error creating testimonial:", error);
        toast.error(
          error?.data?.message ||
            "Failed to create testimonial. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });

  // Image handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setImage(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImage(null);
  };

  // Handle message change with character count
  const handleMessageChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue("message", value);
    setMsgCharCount(value.length);
  };

  // Handle Save Draft
  const handleSaveDraft = () => {
    setActionType("draft");
    formik.handleSubmit();
  };

  // Handle Publish
  const handlePublish = () => {
    setActionType("publish");
    formik.handleSubmit();
  };

  return (
    <main className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <LinkButton
            href="/admin/testimonials"
            variant="outline_primary"
            size="sm"
            className="inline-flex items-center gap-2"
          >
            ← Back to Testimonials
          </LinkButton>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <H5 className="text-3xl font-bold">Add New Testimonial</H5>
                <P className="text-gray-600 mt-1">
                  Add a new client testimonial
                </P>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="default"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting || isLoading}
                >
                  Save Draft
                </Button>
                <Button
                  variant="primary"
                  size="default"
                  onClick={handlePublish}
                  disabled={isSubmitting || isLoading}
                  className="flex items-center gap-2"
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish"
                  )}
                </Button>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="p-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                {/* Name */}
                <Input
                  id="name"
                  name="name"
                  label="Full Name"
                  placeholder="Enter client name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.name && formik.errors.name
                      ? formik.errors.name
                      : null
                  }
                  required
                />

                {/* Position */}
                <Input
                  id="position"
                  name="position"
                  label="Position"
                  placeholder="e.g., CEO, Founder"
                  value={formik.values.position}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.position && formik.errors.position
                      ? formik.errors.position
                      : null
                  }
                  required
                />

                {/* Company */}
                <Input
                  id="company"
                  name="company"
                  label="Company"
                  placeholder="Company name"
                  value={formik.values.company}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.company && formik.errors.company
                      ? formik.errors.company
                      : null
                  }
                  required
                />

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      id="rating"
                      name="rating"
                      min="1"
                      max="5"
                      step="1"
                      value={formik.values.rating}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                    <span className="text-sm text-gray-500">(1-5 stars)</span>
                  </div>
                  {formik.touched.rating && formik.errors.rating && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.rating}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column - Image & Message */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>

                  {imagePreview ? (
                    <div className="relative">
                      <div className="relative aspect-square max-w-[200px] rounded-full overflow-hidden border-2 border-gray-200">
                        <Image
                          src={imagePreview}
                          alt="Profile preview"
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
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors max-w-[200px]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image"
                      />
                      <label htmlFor="image" className="cursor-pointer block">
                        <div className="text-4xl mb-2">👤</div>
                        <P color="muted" className="text-sm">
                          Click to upload
                        </P>
                        <P color="muted" className="text-xs mt-1">
                          PNG, JPG, WebP
                        </P>
                      </label>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div>
                  <Textarea
                    id="message"
                    name="message"
                    label={
                      <span>
                        Testimonial Message
                        <span className="text-red-500 ml-1">*</span>
                        <span className="text-gray-400 text-xs ml-2">
                          ({msgCharCount}/1000 characters)
                        </span>
                      </span>
                    }
                    placeholder="Write the testimonial message..."
                    value={formik.values.message}
                    onChange={handleMessageChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.message && formik.errors.message
                        ? formik.errors.message
                        : null
                    }
                    rows={5}
                    required
                  />
                  {msgCharCount > 1000 && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1.5 rounded">
                      Character count exceeds 1000. Please shorten your message.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => router.push("/admin/testimonials")}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleSaveDraft}
                disabled={isSubmitting || isLoading}
              >
                Save Draft
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handlePublish}
                disabled={isSubmitting || isLoading}
                className="flex items-center gap-2"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Testimonial"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

