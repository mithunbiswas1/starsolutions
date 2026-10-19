"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { H5, P } from "@/components/ui/Typography";
import {
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
} from "@/redux/features/blogApi";
import { toast } from "sonner";
import { baseUriBackend } from "@/redux/url/url";
import React from "react";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import SearchableSelect from "@/components/ui/SearchableSelect";
import SlugInput from "@/components/ui/SlugInput";
import RichTextEditor from "@/components/ui/RichTextEditor";

// Validation Schema
const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  slug: Yup.string()
    .required("Slug is required")
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be URL-friendly (lowercase, hyphens only)",
    )
    .min(3, "Slug must be at least 3 characters"),
  category: Yup.string().required("Category is required"),
  client: Yup.string().required("Client name is required"),
  duration: Yup.string().required("Project duration is required"),
  short_description: Yup.string()
    .required("Short description is required")
    .max(160, "Short description must be less than 160 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  technologies: Yup.string().required("At least one technology is required"),
  meta_title: Yup.string().max(
    60,
    "Meta title must be less than 60 characters",
  ),
  meta_description: Yup.string().max(
    160,
    "Meta description must be less than 160 characters",
  ),
  seo_keyword: Yup.string(),
});

// Category Options
const categoryOptions = [
  { value: "App Development", method_name: "App Development" },
  { value: "Web Development", method_name: "Web Development" },
  { value: "Software Development", method_name: "Software Development" },
  { value: "E-commerce Solutions", method_name: "E-commerce Solutions" },
  { value: "Digital Marketing", method_name: "Digital Marketing" },
  {
    value: "Search Engine Optimization",
    method_name: "Search Engine Optimization",
  },
  { value: "AI & Automation", method_name: "AI & Automation" },
  { value: "UI/UX Design", method_name: "UI/UX Design" },
];

export default function EditBlogPage({ params }) {
  const router = useRouter();

  // DescCorrect way to get params in Next.js 15/16 client component
  const { id } = React.use(params);

  console.log("Blog ID from params:", id);

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shortDescCharCount, setShortDescCharCount] = useState(0);
  const [descCharCount, setDescCharCount] = useState(0);
  const [actionType, setActionType] = useState("update"); // "update" or "draft"

  // Image states
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  // Fetch blog data - only if id exists
  const { data: blogData, isLoading: isLoadingBlog } = useGetBlogByIdQuery(id, {
    skip: !id,
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      slug: "",
      category: "",
      client: "",
      duration: "",
      short_description: "",
      description: "",
      technologies: "",
      meta_title: "",
      meta_description: "",
      seo_keyword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("slug", values.slug);
        formData.append("short_description", values.short_description);
        formData.append("description", values.description);
        formData.append("category", values.category);
        formData.append("client", values.client);
        formData.append("duration", values.duration);

        const technologiesArray = values.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech !== "");
        formData.append("technologies", JSON.stringify(technologiesArray));

        if (thumbnail) {
          formData.append("thumbnail", thumbnail);
        }
        if (banner) {
          formData.append("banner", banner);
        }
        gallery.forEach((file) => {
          formData.append("gallery", file);
        });

        formData.append("meta_title", values.meta_title || "");
        formData.append("meta_description", values.meta_description || "");
        formData.append("seo_keyword", values.seo_keyword || "");

        // Set is_active based on action type
        const isActive = actionType === "update";
        formData.append("is_active", isActive);

        await updateBlog({ id, data: formData }).unwrap();

        const successMessage = isActive
          ? "Case study updated and published successfully!"
          : "Case study saved as draft successfully!";

        toast.success(successMessage);
        router.push("/admin/blogs");
      } catch (error) {
        console.error("Error updating case study:", error);
        toast.error(
          error?.data?.message ||
            "Failed to update case study. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Set form values when blog data is loaded
  useEffect(() => {
    if (blogData?.data) {
      const blog = blogData.data;
      formik.setValues({
        title: blog.title || "",
        slug: blog.slug || "",
        category: blog.category || "",
        client: blog.client || "",
        duration: blog.duration || "",
        short_description: blog.short_description || "",
        description: blog.description || "",
        technologies: blog.technologies?.join(", ") || "",
        meta_title: blog.meta_title || "",
        meta_description: blog.meta_description || "",
        seo_keyword: blog.seo_keyword || "",
      });

      // Set character counts
      setShortDescCharCount(blog.short_description?.length || 0);

      // Extract plain text from description for character count
      if (blog.description) {
        const temp = document.createElement("div");
        temp.innerHTML = blog.description;
        const plainText = temp.textContent || temp.innerText || "";
        setDescCharCount(plainText.length);
      }

      // Set existing gallery images
      if (blog.gallery && blog.gallery.length > 0) {
        setExistingGallery(blog.gallery);
      }
    }
  }, [blogData]);

  // Image handlers
  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
      setThumbnail(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnailPreview(null);
    setThumbnail(null);
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
      setBanner(file);
    }
  };

  const removeBanner = () => {
    setBannerPreview(null);
    setBanner(null);
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newGallery = [...gallery, ...files];
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setGallery(newGallery);
      setGalleryPreviews([...galleryPreviews, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index) => {
    const newGallery = gallery.filter((_, i) => i !== index);
    const newPreviews = galleryPreviews.filter((_, i) => i !== index);
    setGallery(newGallery);
    setGalleryPreviews(newPreviews);
  };

  const removeExistingGalleryImage = (index) => {
    const newExisting = existingGallery.filter((_, i) => i !== index);
    setExistingGallery(newExisting);
  };

  // Handle short description change with character count
  const handleShortDescriptionChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue("short_description", value);
    setShortDescCharCount(value.length);
  };

  // Handle description change with character count
  const handleDescriptionChange = (content) => {
    formik.setFieldValue("description", content);
    const temp = document.createElement("div");
    temp.innerHTML = content;
    const plainText = temp.textContent || temp.innerText || "";
    setDescCharCount(plainText.length);
  };

  // Auto-generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    formik.setFieldValue("title", title);
    if (
      !formik.values.slug ||
      formik.values.slug === generateSlug(formik.values.title)
    ) {
      formik.setFieldValue("slug", generateSlug(title));
    }
  };

  // Handle Save Draft
  const handleSaveDraft = () => {
    setActionType("draft");
    formik.handleSubmit();
  };

  // Handle Update (Publish)
  const handleUpdate = () => {
    setActionType("update");
    formik.handleSubmit();
  };

  // If no id, show error
  if (!id) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-lg font-medium text-red-600">
                Invalid blog ID
              </p>
              <Link
                href="/admin/blogs"
                className="mt-4 inline-block text-green-600 hover:underline"
              >
                ← Back to Blogs
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Loading state
  if (isLoadingBlog) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading case study...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const blog = blogData?.data;

  if (!blog) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-lg font-medium text-gray-600">
                Case study not found
              </p>
              <Link
                href="/admin/blogs"
                className="mt-4 inline-block text-green-600 hover:underline"
              >
                ← Back to Blogs
              </Link>
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
            href="/admin/blogs"
            variant="outline_primary"
            size="sm"
            className="inline-flex items-center gap-2"
          >
            ← Back to Case Studies
          </LinkButton>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <H5 className="text-3xl font-bold">Edit Case Study</H5>
                <P className="text-gray-600 mt-1">
                  Update your case study post
                </P>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="default"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting || isUpdating}
                >
                  Save Draft
                </Button>
                <Button
                  variant="primary"
                  size="default"
                  onClick={handleUpdate}
                  disabled={isSubmitting || isUpdating}
                  className="flex items-center gap-2"
                >
                  {isSubmitting || isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update & Publish"
                  )}
                </Button>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Prevent default form submission
            }}
            className="p-8"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content - Left */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <Input
                  id="title"
                  name="title"
                  label="Title"
                  placeholder="Enter case study title..."
                  value={formik.values.title}
                  onChange={handleTitleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.title && formik.errors.title
                      ? formik.errors.title
                      : null
                  }
                  required
                />

                {/* Slug */}
                <SlugInput
                  title={formik.values.title}
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.slug && formik.errors.slug
                      ? formik.errors.slug
                      : null
                  }
                  required
                  prefix="/blogs/"
                  label="Slug"
                  placeholder="your-case-study-slug"
                />

                {/* Category & Client */}
                <div className="grid md:grid-cols-2 gap-4">
                  <SearchableSelect
                    id="category"
                    name="category"
                    label="Category"
                    placeholder="Select Category"
                    options={categoryOptions}
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.category && formik.errors.category
                        ? formik.errors.category
                        : null
                    }
                    required
                  />

                  <Input
                    id="client"
                    name="client"
                    label="Client"
                    placeholder="Client name"
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
                </div>

                {/* Duration & Technologies */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    id="duration"
                    name="duration"
                    label="Duration"
                    placeholder="e.g., 3 months, 6 weeks"
                    value={formik.values.duration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.duration && formik.errors.duration
                        ? formik.errors.duration
                        : null
                    }
                    required
                  />

                  <Input
                    id="technologies"
                    name="technologies"
                    label="Technologies"
                    placeholder="React, Next.js, MongoDB, etc."
                    value={formik.values.technologies}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.technologies && formik.errors.technologies
                        ? formik.errors.technologies
                        : null
                    }
                    required
                  />
                </div>

                {/* Short Description - Textarea Field */}
                <div>
                  <Textarea
                    id="short_description"
                    name="short_description"
                    label={
                      <span>
                        Short Description
                        <span className="text-red-500 ml-1">*</span>
                        <span className="text-gray-400 text-xs ml-2">
                          ({shortDescCharCount}/160 characters)
                        </span>
                      </span>
                    }
                    placeholder="Write a brief description about the case study..."
                    value={formik.values.short_description}
                    onChange={handleShortDescriptionChange}
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
                  {shortDescCharCount > 160 && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1.5 rounded">
                      ⚠️ Character count exceeds 160. Please shorten your
                      description.
                    </div>
                  )}
                </div>

                {/* Description - Rich Text Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                    <span className="text-red-500 ml-1">*</span>
                    <span className="text-gray-400 text-xs ml-2">
                      ({descCharCount} characters)
                    </span>
                  </label>
                  <RichTextEditor
                    value={formik.values.description}
                    onChange={handleDescriptionChange}
                    placeholder="Write detailed description about the case study..."
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1.5 rounded">
                      {formik.errors.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar - Right */}
              <div className="space-y-6">
                {/* Thumbnail */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <H5 className="font-semibold mb-3">Thumbnail</H5>
                  {thumbnailPreview || blog?.thumbnail ? (
                    <div className="relative">
                      <div className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={
                            thumbnailPreview ||
                            `${baseUriBackend}${blog.thumbnail}`
                          }
                          alt="Thumbnail preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      {(thumbnailPreview || blog?.thumbnail) && (
                        <Button
                          variant="danger"
                          size="xs"
                          className="absolute top-2 right-2 rounded-full w-8 h-8 p-0 flex items-center justify-center"
                          onClick={removeThumbnail}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                        id="thumbnail"
                      />
                      <label
                        htmlFor="thumbnail"
                        className="cursor-pointer block"
                      >
                        <div className="text-4xl mb-2">🖼️</div>
                        <P color="muted" className="mb-1">
                          Click to upload thumbnail
                        </P>
                        <P color="muted" className="text-sm">
                          PNG, JPG, WebP
                        </P>
                      </label>
                    </div>
                  )}
                </div>

                {/* Banner */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <H5 className="font-semibold mb-3">Banner</H5>
                  {bannerPreview || blog?.banner ? (
                    <div className="relative">
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={
                            bannerPreview || `${baseUriBackend}${blog.banner}`
                          }
                          alt="Banner preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      {(bannerPreview || blog?.banner) && (
                        <Button
                          variant="danger"
                          size="xs"
                          className="absolute top-2 right-2 rounded-full w-8 h-8 p-0 flex items-center justify-center"
                          onClick={removeBanner}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="hidden"
                        id="banner"
                      />
                      <label htmlFor="banner" className="cursor-pointer block">
                        <div className="text-4xl mb-2">📸</div>
                        <P color="muted" className="mb-1">
                          Click to upload banner
                        </P>
                        <P color="muted" className="text-sm">
                          PNG, JPG, WebP
                        </P>
                      </label>
                    </div>
                  )}
                </div>

                {/* Gallery */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <H5 className="font-semibold mb-3">Gallery</H5>

                  {/* Existing gallery images */}
                  {existingGallery.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">
                        Existing Images ({existingGallery.length})
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {existingGallery.map((image, index) => (
                          <div
                            key={`existing-${index}`}
                            className="relative aspect-square rounded-lg overflow-hidden"
                          >
                            <Image
                              src={`${baseUriBackend}${image}`}
                              alt={`Gallery image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <Button
                              variant="danger"
                              size="xs"
                              className="absolute top-1 right-1 rounded-full w-5 h-5 p-0 flex items-center justify-center text-xs"
                              onClick={() => removeExistingGalleryImage(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New gallery preview grid */}
                  {galleryPreviews.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">
                        New Images ({galleryPreviews.length})
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {galleryPreviews.map((preview, index) => (
                          <div
                            key={`new-${index}`}
                            className="relative aspect-square rounded-lg overflow-hidden"
                          >
                            <Image
                              src={preview}
                              alt={`New gallery image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <Button
                              variant="danger"
                              size="xs"
                              className="absolute top-1 right-1 rounded-full w-5 h-5 p-0 flex items-center justify-center text-xs"
                              onClick={() => removeGalleryImage(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                      id="gallery"
                    />
                    <label htmlFor="gallery" className="cursor-pointer block">
                      <div className="text-3xl mb-1">🖼️</div>
                      <P color="muted" className="text-sm mb-1">
                        Click to upload gallery images
                      </P>
                      <P color="muted" className="text-xs">
                        Multiple images supported
                      </P>
                    </label>
                  </div>
                  {existingGallery.length + gallery.length > 0 && (
                    <P color="muted" className="text-xs mt-2">
                      {existingGallery.length + gallery.length} image(s) total
                    </P>
                  )}
                </div>

                {/* SEO Settings */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <H5 className="font-semibold mb-3">SEO Settings</H5>

                  <div className="space-y-4">
                    <Input
                      id="meta_title"
                      name="meta_title"
                      label={
                        <span>
                          Meta Title
                          <span className="text-gray-400 text-xs ml-2">
                            ({formik.values.meta_title.length}/60)
                          </span>
                        </span>
                      }
                      placeholder="SEO optimized title"
                      value={formik.values.meta_title}
                      onChange={formik.handleChange}
                    />

                    <Textarea
                      id="meta_description"
                      name="meta_description"
                      label={
                        <span>
                          Meta Description
                          <span className="text-gray-400 text-xs ml-2">
                            ({formik.values.meta_description.length}/160)
                          </span>
                        </span>
                      }
                      placeholder="Meta description for SEO"
                      value={formik.values.meta_description}
                      onChange={formik.handleChange}
                      rows={2}
                    />

                    <Input
                      id="seo_keyword"
                      name="seo_keyword"
                      label="SEO Keywords"
                      placeholder="keyword1, keyword2, keyword3"
                      value={formik.values.seo_keyword}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting || isUpdating}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleUpdate}
                    disabled={isSubmitting || isUpdating}
                  >
                    {isSubmitting || isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update & Publish"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

