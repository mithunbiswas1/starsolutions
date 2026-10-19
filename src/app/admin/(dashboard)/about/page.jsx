// src/app/(pages)/about/edit/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  useGetAboutQuery,
  useCreateOrUpdateAboutMutation,
} from "@/redux/features/aboutApi";
import { baseUriBackend } from "@/redux/url/url";

// Reusable Components
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { H5, P } from "@/components/ui/Typography";

// Validation Schema
const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .max(100, "Title must be less than 100 characters"),
  short_description: Yup.string()
    .required("Short description is required")
    .max(500, "Short description must be less than 500 characters"),
  chairman_message: Yup.string().required("Chairman message is required"),
  chairman_name: Yup.string()
    .required("Chairman name is required")
    .max(100, "Name must be less than 100 characters"),
  chairman_designation: Yup.string()
    .required("Chairman designation is required")
    .max(100, "Designation must be less than 100 characters"),
  mission: Yup.string().required("Mission is required"),
  vision: Yup.string().required("Vision is required"),
});

export default function EditAboutPage() {
  const router = useRouter();
  const [createOrUpdateAbout, { isLoading }] = useCreateOrUpdateAboutMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch about data
  const {
    data: aboutData,
    isLoading: isLoadingAbout,
    refetch,
  } = useGetAboutQuery();

  // Image states
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [existingBanner, setExistingBanner] = useState(null);

  const [chairmanImage, setChairmanImage] = useState(null);
  const [chairmanPreview, setChairmanPreview] = useState(null);
  const [existingChairman, setExistingChairman] = useState(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      short_description: "",
      chairman_message: "",
      chairman_name: "",
      chairman_designation: "",
      mission: "",
      vision: "",
      is_active: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("short_description", values.short_description);
        formData.append("chairman_message", values.chairman_message);
        formData.append("chairman_name", values.chairman_name);
        formData.append("chairman_designation", values.chairman_designation);
        formData.append("mission", values.mission);
        formData.append("vision", values.vision);
        formData.append("is_active", values.is_active);

        if (bannerImage) {
          formData.append("banner_image", bannerImage);
        }

        if (chairmanImage) {
          formData.append("chairman_image", chairmanImage);
        }

        await createOrUpdateAbout(formData).unwrap();

        toast.success("About page saved successfully!");
        refetch();
        router.push("/admin/about");
      } catch (error) {
        console.error("Error saving about page:", error);
        toast.error(
          error?.data?.message ||
            "Failed to save about page. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Set form values when about data is loaded
  useEffect(() => {
    if (aboutData?.data) {
      const about = aboutData.data;
      formik.setValues({
        title: about.title || "",
        short_description: about.short_description || "",
        chairman_message: about.chairman_message || "",
        chairman_name: about.chairman_name || "",
        chairman_designation: about.chairman_designation || "",
        mission: about.mission || "",
        vision: about.vision || "",
        is_active: about.is_active !== undefined ? about.is_active : true,
      });

      if (about.banner_image) {
        setExistingBanner(about.banner_image);
      }

      if (about.chairman_image) {
        setExistingChairman(about.chairman_image);
      }
    }
  }, [aboutData]);

  // Image handlers
  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
      setBannerImage(file);
      setExistingBanner(null);
    }
  };

  const removeBanner = () => {
    setBannerPreview(null);
    setBannerImage(null);
  };

  const removeExistingBanner = () => {
    setExistingBanner(null);
  };

  const handleChairmanUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setChairmanPreview(url);
      setChairmanImage(file);
      setExistingChairman(null);
    }
  };

  const removeChairman = () => {
    setChairmanPreview(null);
    setChairmanImage(null);
  };

  const removeExistingChairman = () => {
    setExistingChairman(null);
  };

  // Loading state
  if (isLoadingAbout) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading about page...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <H5 className="text-3xl font-bold">Edit About Page</H5>
                <P className="text-gray-600 mt-1">
                  Update your about page content
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
                    Saving...
                  </>
                ) : (
                  "Save About Page"
                )}
              </Button>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-8">
            <div className="space-y-8">
              {/* Banner Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-semibold mb-6">Banner Section</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Input
                      id="title"
                      name="title"
                      label="Title"
                      placeholder="Enter page title"
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

                    <div>
                      <Textarea
                        id="short_description"
                        name="short_description"
                        label="Short Description"
                        placeholder="Enter short description..."
                        value={formik.values.short_description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.short_description &&
                          formik.errors.short_description
                            ? formik.errors.short_description
                            : null
                        }
                        rows={3}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Image
                    </label>

                    {/* Show existing banner */}
                    {existingBanner && !bannerPreview && (
                      <div className="relative">
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image
                            src={`${baseUriBackend}${existingBanner}`}
                            alt="Current banner"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeExistingBanner}
                          className="absolute top-2 right-2 rounded-full bg-red-500 text-white w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {/* Show new banner preview */}
                    {bannerPreview && (
                      <div className="relative">
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image
                            src={bannerPreview}
                            alt="New banner preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeBanner}
                          className="absolute top-2 right-2 rounded-full bg-red-500 text-white w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {/* Upload button */}
                    {!bannerPreview && !existingBanner && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="hidden"
                          id="banner_image"
                        />
                        <label
                          htmlFor="banner_image"
                          className="cursor-pointer block"
                        >
                          <div className="text-4xl mb-2">🖼️</div>
                          <P color="muted" className="mb-1 font-medium">
                            Click to upload banner image
                          </P>
                          <P color="muted" className="text-sm">
                            PNG, JPG, WebP
                          </P>
                        </label>
                      </div>
                    )}

                    {/* Show change button when banner exists */}
                    {!bannerPreview && existingBanner && (
                      <div className="mt-3">
                        <label
                          htmlFor="banner_image_change"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          Change Banner
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerUpload}
                            className="hidden"
                            id="banner_image_change"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Chairman Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-semibold mb-6">Chairman Section</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Input
                      id="chairman_name"
                      name="chairman_name"
                      label="Chairman Name"
                      placeholder="Enter chairman name"
                      value={formik.values.chairman_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.chairman_name &&
                        formik.errors.chairman_name
                          ? formik.errors.chairman_name
                          : null
                      }
                      required
                    />

                    <Input
                      id="chairman_designation"
                      name="chairman_designation"
                      label="Chairman Designation"
                      placeholder="Enter chairman designation"
                      value={formik.values.chairman_designation}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.chairman_designation &&
                        formik.errors.chairman_designation
                          ? formik.errors.chairman_designation
                          : null
                      }
                      required
                    />

                    <div>
                      <Textarea
                        id="chairman_message"
                        name="chairman_message"
                        label="Chairman Message"
                        placeholder="Enter chairman message..."
                        value={formik.values.chairman_message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.chairman_message &&
                          formik.errors.chairman_message
                            ? formik.errors.chairman_message
                            : null
                        }
                        rows={4}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chairman Image
                    </label>

                    {/* Show existing chairman image */}
                    {existingChairman && !chairmanPreview && (
                      <div className="relative">
                        <div className="relative aspect-square max-w-[300px] rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image
                            src={`${baseUriBackend}${existingChairman}`}
                            alt="Current chairman"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeExistingChairman}
                          className="absolute top-2 right-2 rounded-full bg-red-500 text-white w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {/* Show new chairman preview */}
                    {chairmanPreview && (
                      <div className="relative">
                        <div className="relative aspect-square max-w-[300px] rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image
                            src={chairmanPreview}
                            alt="New chairman preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeChairman}
                          className="absolute top-2 right-2 rounded-full bg-red-500 text-white w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {/* Upload button */}
                    {!chairmanPreview && !existingChairman && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleChairmanUpload}
                          className="hidden"
                          id="chairman_image"
                        />
                        <label
                          htmlFor="chairman_image"
                          className="cursor-pointer block"
                        >
                          <div className="text-4xl mb-2">👤</div>
                          <P color="muted" className="mb-1 font-medium">
                            Click to upload chairman image
                          </P>
                          <P color="muted" className="text-sm">
                            PNG, JPG, WebP
                          </P>
                        </label>
                      </div>
                    )}

                    {/* Show change button when chairman image exists */}
                    {!chairmanPreview && existingChairman && (
                      <div className="mt-3">
                        <label
                          htmlFor="chairman_image_change"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          Change Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleChairmanUpload}
                            className="hidden"
                            id="chairman_image_change"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mission & Vision */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-semibold mb-6">Mission & Vision</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <Textarea
                      id="mission"
                      name="mission"
                      label="Mission"
                      placeholder="Enter mission statement..."
                      value={formik.values.mission}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.mission && formik.errors.mission
                          ? formik.errors.mission
                          : null
                      }
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      id="vision"
                      name="vision"
                      label="Vision"
                      placeholder="Enter vision statement..."
                      value={formik.values.vision}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.vision && formik.errors.vision
                          ? formik.errors.vision
                          : null
                      }
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              {/* <div>
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
                    Active (Visible on website)
                  </label>
                </div>
              </div> */}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => router.push("/admin/about")}
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
                    Saving...
                  </>
                ) : (
                  "Save About Page"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

