// src/app/(pages)/settings/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  useCreateOrUpdateSettingsMutation,
  useGetSettingsQuery,
} from "@/redux/features/settingApi";
import { baseUriBackend } from "@/redux/url/url";

// Reusable Components
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { H5, P } from "@/components/ui/Typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

// Validation Schema
const validationSchema = Yup.object({
  // General
  websiteName: Yup.string().max(100, "Must be less than 100 characters"),
  websiteTitle: Yup.string().max(200, "Must be less than 200 characters"),
  websiteDescription: Yup.string().max(500, "Must be less than 500 characters"),
  websiteKeywords: Yup.string().max(500, "Must be less than 500 characters"),

  // Contact
  phone: Yup.string().max(50, "Must be less than 50 characters"),
  secondaryPhone: Yup.string().max(50, "Must be less than 50 characters"),
  email: Yup.string().email("Invalid email format"),
  supportEmail: Yup.string().email("Invalid email format"),
  address: Yup.string().max(500, "Must be less than 500 characters"),

  // Social
  facebook: Yup.string().url("Invalid URL format"),
  instagram: Yup.string().url("Invalid URL format"),
  linkedin: Yup.string().url("Invalid URL format"),
  twitter: Yup.string().url("Invalid URL format"),
  youtube: Yup.string().url("Invalid URL format"),
  reddit: Yup.string().url("Invalid URL format"),
  tiktok: Yup.string().url("Invalid URL format"),
  github: Yup.string().url("Invalid URL format"),
  pinterest: Yup.string().url("Invalid URL format"),
  whatsapp: Yup.string().url("Invalid URL format"),

  // SEO
  metaTitle: Yup.string().max(60, "Meta title must be less than 60 characters"),
  metaDescription: Yup.string().max(
    160,
    "Meta description must be less than 160 characters",
  ),
  metaKeywords: Yup.string().max(500, "Must be less than 500 characters"),

  // Analytics
  googleAnalyticsId: Yup.string().max(100),
  googleTagManagerId: Yup.string().max(100),

  // Email
  smtpHost: Yup.string().max(200),
  smtpPort: Yup.string().max(10),
  smtpUsername: Yup.string().max(200),
  smtpPassword: Yup.string().max(200),
  fromEmail: Yup.string().email("Invalid email format"),
  fromName: Yup.string().max(100),

  // Footer
  footerAbout: Yup.string().max(500),
  copyright: Yup.string().max(200),
});

export default function SettingsPage() {
  const router = useRouter();
  const [createOrUpdateSettings, { isLoading }] =
    useCreateOrUpdateSettingsMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Fetch settings data
  const {
    data: settingsData,
    isLoading: isLoadingSettings,
    refetch,
  } = useGetSettingsQuery();

  // Image states
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [existingLogo, setExistingLogo] = useState(null);

  const [logoWhiteFile, setLogoWhiteFile] = useState(null);
  const [logoWhitePreview, setLogoWhitePreview] = useState(null);
  const [existingLogoWhite, setExistingLogoWhite] = useState(null);

  const [faviconFile, setFaviconFile] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [existingFavicon, setExistingFavicon] = useState(null);

  const [ogImageFile, setOgImageFile] = useState(null);
  const [ogImagePreview, setOgImagePreview] = useState(null);
  const [existingOgImage, setExistingOgImage] = useState(null);

  const formik = useFormik({
    initialValues: {
      // General
      websiteName: "",
      websiteTitle: "",
      websiteDescription: "",
      websiteKeywords: "",
      // Contact
      phone: "",
      secondaryPhone: "",
      email: "",
      supportEmail: "",
      address: "",
      googleMapEmbed: "",
      googleMapLink: "",
      // Social
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      youtube: "",
      reddit: "",
      tiktok: "",
      github: "",
      pinterest: "",
      whatsapp: "",
      // SEO
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      // Analytics
      googleAnalyticsId: "",
      googleTagManagerId: "",
      // Email
      smtpHost: "",
      smtpPort: "",
      smtpUsername: "",
      smtpPassword: "",
      fromEmail: "",
      fromName: "",
      // Footer
      footerAbout: "",
      copyright: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const formData = new FormData();

        // Append all text fields
        Object.keys(values).forEach((key) => {
          if (values[key] !== undefined && values[key] !== null) {
            formData.append(key, values[key]);
          }
        });

        // Append files
        if (logoFile) formData.append("logo", logoFile);
        if (logoWhiteFile) formData.append("logoWhite", logoWhiteFile);
        if (faviconFile) formData.append("favicon", faviconFile);
        if (ogImageFile) formData.append("openGraphImage", ogImageFile);

        await createOrUpdateSettings(formData).unwrap();

        toast.success("Settings saved successfully!");
        refetch();
      } catch (error) {
        console.error("Error saving settings:", error);
        toast.error(
          error?.data?.message || "Failed to save settings. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Set form values when settings data is loaded
  useEffect(() => {
    if (settingsData?.data) {
      const settings = settingsData.data;
      formik.setValues({
        // General
        websiteName: settings.websiteName || "",
        websiteTitle: settings.websiteTitle || "",
        websiteDescription: settings.websiteDescription || "",
        websiteKeywords: settings.websiteKeywords || "",
        // Contact
        phone: settings.phone || "",
        secondaryPhone: settings.secondaryPhone || "",
        email: settings.email || "",
        supportEmail: settings.supportEmail || "",
        address: settings.address || "",
        googleMapEmbed: settings.googleMapEmbed || "",
        googleMapLink: settings.googleMapLink || "",
        // Social
        facebook: settings.facebook || "",
        instagram: settings.instagram || "",
        linkedin: settings.linkedin || "",
        twitter: settings.twitter || "",
        youtube: settings.youtube || "",
        reddit: settings.reddit || "",
        tiktok: settings.tiktok || "",
        github: settings.github || "",
        pinterest: settings.pinterest || "",
        whatsapp: settings.whatsapp || "",
        // SEO
        metaTitle: settings.metaTitle || "",
        metaDescription: settings.metaDescription || "",
        metaKeywords: settings.metaKeywords || "",
        // Analytics
        googleAnalyticsId: settings.googleAnalyticsId || "",
        googleTagManagerId: settings.googleTagManagerId || "",
        // Email
        smtpHost: settings.smtpHost || "",
        smtpPort: settings.smtpPort || "",
        smtpUsername: settings.smtpUsername || "",
        smtpPassword: settings.smtpPassword || "",
        fromEmail: settings.fromEmail || "",
        fromName: settings.fromName || "",
        // Footer
        footerAbout: settings.footerAbout || "",
        copyright: settings.copyright || "",
      });

      if (settings.logo) setExistingLogo(settings.logo);
      if (settings.logoWhite) setExistingLogoWhite(settings.logoWhite);
      if (settings.favicon) setExistingFavicon(settings.favicon);
      if (settings.openGraphImage) setExistingOgImage(settings.openGraphImage);
    }
  }, [settingsData]);

  // Image handlers
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      setLogoFile(file);
      setExistingLogo(null);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
  };

  const removeExistingLogo = () => {
    setExistingLogo(null);
  };

  // Logo White handlers
  const handleLogoWhiteUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoWhitePreview(url);
      setLogoWhiteFile(file);
      setExistingLogoWhite(null);
    }
  };

  const removeLogoWhite = () => {
    setLogoWhitePreview(null);
    setLogoWhiteFile(null);
  };

  const removeExistingLogoWhite = () => {
    setExistingLogoWhite(null);
  };

  const handleFaviconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFaviconPreview(url);
      setFaviconFile(file);
      setExistingFavicon(null);
    }
  };

  const removeFavicon = () => {
    setFaviconPreview(null);
    setFaviconFile(null);
  };

  const removeExistingFavicon = () => {
    setExistingFavicon(null);
  };

  const handleOgImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setOgImagePreview(url);
      setOgImageFile(file);
      setExistingOgImage(null);
    }
  };

  const removeOgImage = () => {
    setOgImagePreview(null);
    setOgImageFile(null);
  };

  const removeExistingOgImage = () => {
    setExistingOgImage(null);
  };

  // Loading state
  if (isLoadingSettings) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading settings...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const ImageUpload = ({
    label,
    existingImage,
    preview,
    onUpload,
    onRemove,
    onRemoveExisting,
    id,
    accept = "image/*",
    previewClassName = "aspect-video",
    fallbackText = "Click to upload image",
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {existingImage && !preview && (
        <div className="relative">
          <div
            className={`relative ${previewClassName} rounded-lg overflow-hidden border-2 border-gray-200 max-w-[300px]`}
          >
            <Image
              src={`${baseUriBackend}${existingImage}`}
              alt={label}
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={onRemoveExisting}
            className="absolute top-2 right-2 rounded-full bg-red-500 text-white w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {preview && (
        <div className="relative">
          <div
            className={`relative ${previewClassName} rounded-lg overflow-hidden border-2 border-gray-200 max-w-[300px]`}
          >
            <Image
              src={preview}
              alt={`${label} preview`}
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 rounded-full bg-red-500 text-white w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {!preview && !existingImage && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors max-w-[300px]">
          <input
            type="file"
            accept={accept}
            onChange={onUpload}
            className="hidden"
            id={id}
          />
          <label htmlFor={id} className="cursor-pointer block">
            <div className="text-4xl mb-2">
              {label.includes("Logo")
                ? "🏢"
                : label.includes("Favicon")
                  ? "⭐"
                  : label.includes("OG")
                    ? "📸"
                    : "🖼️"}
            </div>
            <P color="muted" className="text-sm">
              {fallbackText}
            </P>
            <P color="muted" className="text-xs mt-1">
              PNG, JPG, WebP
            </P>
          </label>
        </div>
      )}

      {(preview || existingImage) && (
        <div className="mt-2">
          <label
            htmlFor={`${id}_change`}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Change Image
            <input
              type="file"
              accept={accept}
              onChange={onUpload}
              className="hidden"
              id={`${id}_change`}
            />
          </label>
        </div>
      )}
    </div>
  );

  return (
    <main className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <H5 className="text-3xl font-bold">Website Settings</H5>
                <P className="text-gray-600 mt-1">
                  Configure your website settings
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
                  "Save Settings"
                )}
              </Button>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex flex-wrap gap-2 mb-8">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="footer">Footer</TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    id="websiteName"
                    name="websiteName"
                    label="Website Name"
                    placeholder="Your Website Name"
                    value={formik.values.websiteName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.websiteName && formik.errors.websiteName
                        ? formik.errors.websiteName
                        : null
                    }
                  />
                  <Input
                    id="websiteTitle"
                    name="websiteTitle"
                    label="Website Title"
                    placeholder="Your Website Title"
                    value={formik.values.websiteTitle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.websiteTitle && formik.errors.websiteTitle
                        ? formik.errors.websiteTitle
                        : null
                    }
                  />
                </div>

                <Textarea
                  id="websiteDescription"
                  name="websiteDescription"
                  label="Website Description"
                  placeholder="Brief description of your website"
                  value={formik.values.websiteDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.websiteDescription &&
                    formik.errors.websiteDescription
                      ? formik.errors.websiteDescription
                      : null
                  }
                  rows={3}
                />

                <Input
                  id="websiteKeywords"
                  name="websiteKeywords"
                  label="Website Keywords (SEO)"
                  placeholder="keyword1, keyword2, keyword3"
                  value={formik.values.websiteKeywords}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.websiteKeywords &&
                    formik.errors.websiteKeywords
                      ? formik.errors.websiteKeywords
                      : null
                  }
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <ImageUpload
                    label="Black Logo"
                    existingImage={existingLogo}
                    preview={logoPreview}
                    onUpload={handleLogoUpload}
                    onRemove={removeLogo}
                    onRemoveExisting={removeExistingLogo}
                    id="logo"
                    previewClassName="aspect-square max-w-[200px]"
                  />

                  <ImageUpload
                    label="Logo White"
                    existingImage={existingLogoWhite}
                    preview={logoWhitePreview}
                    onUpload={handleLogoWhiteUpload}
                    onRemove={removeLogoWhite}
                    onRemoveExisting={removeExistingLogoWhite}
                    id="logoWhite"
                    previewClassName="aspect-square max-w-[200px]"
                    fallbackText="Click to upload white logo"
                  />

                  <ImageUpload
                    label="Favicon (Fav)"
                    existingImage={existingFavicon}
                    preview={faviconPreview}
                    onUpload={handleFaviconUpload}
                    onRemove={removeFavicon}
                    onRemoveExisting={removeExistingFavicon}
                    id="favicon"
                    previewClassName="aspect-square max-w-[200px]"
                  />
                </div>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    id="phone"
                    name="phone"
                    label="Phone"
                    placeholder="+1 234 567 8900"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.phone && formik.errors.phone
                        ? formik.errors.phone
                        : null
                    }
                  />
                  <Input
                    id="secondaryPhone"
                    name="secondaryPhone"
                    label="Secondary Phone"
                    placeholder="+1 234 567 8901"
                    value={formik.values.secondaryPhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.secondaryPhone &&
                      formik.errors.secondaryPhone
                        ? formik.errors.secondaryPhone
                        : null
                    }
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="info@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.email && formik.errors.email
                        ? formik.errors.email
                        : null
                    }
                  />
                  <Input
                    id="supportEmail"
                    name="supportEmail"
                    label="Support Email"
                    type="email"
                    placeholder="support@example.com"
                    value={formik.values.supportEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.supportEmail && formik.errors.supportEmail
                        ? formik.errors.supportEmail
                        : null
                    }
                  />
                </div>

                <Textarea
                  id="address"
                  name="address"
                  label="Address"
                  placeholder="123 Street, City, Country"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.address && formik.errors.address
                      ? formik.errors.address
                      : null
                  }
                  rows={3}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <Textarea
                    id="googleMapEmbed"
                    name="googleMapEmbed"
                    label="Google Maps Embed URL"
                    placeholder="<iframe src='...'></iframe>"
                    value={formik.values.googleMapEmbed}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.googleMapEmbed &&
                      formik.errors.googleMapEmbed
                        ? formik.errors.googleMapEmbed
                        : null
                    }
                    rows={3}
                  />
                  <Input
                    id="googleMapLink"
                    name="googleMapLink"
                    label="Google Maps Link"
                    placeholder="https://maps.google.com/..."
                    value={formik.values.googleMapLink}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.googleMapLink &&
                      formik.errors.googleMapLink
                        ? formik.errors.googleMapLink
                        : null
                    }
                  />
                </div>
              </TabsContent>

              {/* Social Media Tab */}
              <TabsContent value="social" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    id="facebook"
                    name="facebook"
                    label="Facebook"
                    placeholder="https://facebook.com/username"
                    value={formik.values.facebook}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.facebook && formik.errors.facebook
                        ? formik.errors.facebook
                        : null
                    }
                  />
                  <Input
                    id="instagram"
                    name="instagram"
                    label="Instagram"
                    placeholder="https://instagram.com/username"
                    value={formik.values.instagram}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.instagram && formik.errors.instagram
                        ? formik.errors.instagram
                        : null
                    }
                  />
                  <Input
                    id="linkedin"
                    name="linkedin"
                    label="LinkedIn"
                    placeholder="https://linkedin.com/company/username"
                    value={formik.values.linkedin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.linkedin && formik.errors.linkedin
                        ? formik.errors.linkedin
                        : null
                    }
                  />
                  <Input
                    id="twitter"
                    name="twitter"
                    label="Twitter (X)"
                    placeholder="https://twitter.com/username"
                    value={formik.values.twitter}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.twitter && formik.errors.twitter
                        ? formik.errors.twitter
                        : null
                    }
                  />
                  <Input
                    id="youtube"
                    name="youtube"
                    label="YouTube"
                    placeholder="https://youtube.com/@channel"
                    value={formik.values.youtube}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.youtube && formik.errors.youtube
                        ? formik.errors.youtube
                        : null
                    }
                  />
                  <Input
                    id="reddit"
                    name="reddit"
                    label="Reddit"
                    placeholder="https://reddit.com/r/community"
                    value={formik.values.reddit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.reddit && formik.errors.reddit
                        ? formik.errors.reddit
                        : null
                    }
                  />
                  <Input
                    id="tiktok"
                    name="tiktok"
                    label="TikTok"
                    placeholder="https://tiktok.com/@username"
                    value={formik.values.tiktok}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.tiktok && formik.errors.tiktok
                        ? formik.errors.tiktok
                        : null
                    }
                  />
                  <Input
                    id="github"
                    name="github"
                    label="GitHub"
                    placeholder="https://github.com/username"
                    value={formik.values.github}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.github && formik.errors.github
                        ? formik.errors.github
                        : null
                    }
                  />
                  <Input
                    id="pinterest"
                    name="pinterest"
                    label="Pinterest"
                    placeholder="https://pinterest.com/username"
                    value={formik.values.pinterest}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.pinterest && formik.errors.pinterest
                        ? formik.errors.pinterest
                        : null
                    }
                  />
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    label="WhatsApp"
                    placeholder="https://wa.me/1234567890"
                    value={formik.values.whatsapp}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.whatsapp && formik.errors.whatsapp
                        ? formik.errors.whatsapp
                        : null
                    }
                  />
                </div>
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-6">
                <Input
                  id="metaTitle"
                  name="metaTitle"
                  label="Meta Title"
                  placeholder="Page title for search engines"
                  value={formik.values.metaTitle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.metaTitle && formik.errors.metaTitle
                      ? formik.errors.metaTitle
                      : null
                  }
                  helperText={`${formik.values.metaTitle?.length || 0}/60 characters`}
                />

                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  label="Meta Description"
                  placeholder="Brief description for search engines"
                  value={formik.values.metaDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.metaDescription &&
                    formik.errors.metaDescription
                      ? formik.errors.metaDescription
                      : null
                  }
                  rows={3}
                  helperText={`${formik.values.metaDescription?.length || 0}/160 characters`}
                />

                <Input
                  id="metaKeywords"
                  name="metaKeywords"
                  label="Meta Keywords"
                  placeholder="keyword1, keyword2, keyword3"
                  value={formik.values.metaKeywords}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.metaKeywords && formik.errors.metaKeywords
                      ? formik.errors.metaKeywords
                      : null
                  }
                />

                <ImageUpload
                  label="Open Graph Image (OG Image)"
                  existingImage={existingOgImage}
                  preview={ogImagePreview}
                  onUpload={handleOgImageUpload}
                  onRemove={removeOgImage}
                  onRemoveExisting={removeExistingOgImage}
                  id="ogImage"
                  previewClassName="aspect-video max-w-[400px]"
                  fallbackText="Click to upload OG image (1200x630 recommended)"
                />
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    id="googleAnalyticsId"
                    name="googleAnalyticsId"
                    label="Google Analytics ID (GA4)"
                    placeholder="G-XXXXXXXXXX"
                    value={formik.values.googleAnalyticsId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.googleAnalyticsId &&
                      formik.errors.googleAnalyticsId
                        ? formik.errors.googleAnalyticsId
                        : null
                    }
                  />
                  <Input
                    id="googleTagManagerId"
                    name="googleTagManagerId"
                    label="Google Tag Manager ID"
                    placeholder="GTM-XXXXXXX"
                    value={formik.values.googleTagManagerId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.googleTagManagerId &&
                      formik.errors.googleTagManagerId
                        ? formik.errors.googleTagManagerId
                        : null
                    }
                  />
                </div>
              </TabsContent>

              {/* Email Tab */}
              <TabsContent value="email" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    id="smtpHost"
                    name="smtpHost"
                    label="SMTP Host"
                    placeholder="smtp.example.com"
                    value={formik.values.smtpHost}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.smtpHost && formik.errors.smtpHost
                        ? formik.errors.smtpHost
                        : null
                    }
                  />
                  <Input
                    id="smtpPort"
                    name="smtpPort"
                    label="SMTP Port"
                    placeholder="587"
                    value={formik.values.smtpPort}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.smtpPort && formik.errors.smtpPort
                        ? formik.errors.smtpPort
                        : null
                    }
                  />
                  <Input
                    id="smtpUsername"
                    name="smtpUsername"
                    label="SMTP Username"
                    placeholder="user@example.com"
                    value={formik.values.smtpUsername}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.smtpUsername && formik.errors.smtpUsername
                        ? formik.errors.smtpUsername
                        : null
                    }
                  />
                  <Input
                    id="smtpPassword"
                    name="smtpPassword"
                    label="SMTP Password"
                    type="password"
                    placeholder="••••••••"
                    value={formik.values.smtpPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.smtpPassword && formik.errors.smtpPassword
                        ? formik.errors.smtpPassword
                        : null
                    }
                  />
                  <Input
                    id="fromEmail"
                    name="fromEmail"
                    label="From Email"
                    type="email"
                    placeholder="noreply@example.com"
                    value={formik.values.fromEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.fromEmail && formik.errors.fromEmail
                        ? formik.errors.fromEmail
                        : null
                    }
                  />
                  <Input
                    id="fromName"
                    name="fromName"
                    label="From Name"
                    placeholder="Your Company Name"
                    value={formik.values.fromName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.fromName && formik.errors.fromName
                        ? formik.errors.fromName
                        : null
                    }
                  />
                </div>
              </TabsContent>

              {/* Footer Tab */}
              <TabsContent value="footer" className="space-y-6">
                <Textarea
                  id="footerAbout"
                  name="footerAbout"
                  label="Footer About"
                  placeholder="Brief description about your company for the footer"
                  value={formik.values.footerAbout}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.footerAbout && formik.errors.footerAbout
                      ? formik.errors.footerAbout
                      : null
                  }
                  rows={4}
                />

                <Input
                  id="copyright"
                  name="copyright"
                  label="Copyright"
                  placeholder="© 2024 Your Company. All rights reserved."
                  value={formik.values.copyright}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.copyright && formik.errors.copyright
                      ? formik.errors.copyright
                      : null
                  }
                />
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
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
                  "Save All Settings"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
