// app/(pages)/homepage/alliance/add/page.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

// Components
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import Input from "@/components/ui/Input";
import { H5, P } from "@/components/ui/Typography";
import { useCreateOrUpdateAllianceMutation } from "@/redux/features/homeAllianceApi";

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

export default function AddAlliancePage() {
  const router = useRouter();
  const [createAlliance, { isLoading }] = useCreateOrUpdateAllianceMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image states
  const [allianceImage1, setAllianceImage1] = useState(null);
  const [allianceImage1Preview, setAllianceImage1Preview] = useState(null);
  const [allianceImage2, setAllianceImage2] = useState(null);
  const [allianceImage2Preview, setAllianceImage2Preview] = useState(null);
  const [allianceImage3, setAllianceImage3] = useState(null);
  const [allianceImage3Preview, setAllianceImage3Preview] = useState(null);
  const [allianceImage4, setAllianceImage4] = useState(null);
  const [allianceImage4Preview, setAllianceImage4Preview] = useState(null);

  const formik = useFormik({
    initialValues: {
      experience_year: "",
      client: "",
      projects: "",
      countries: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      // Validate images
      if (
        !allianceImage1 &&
        !allianceImage2 &&
        !allianceImage3 &&
        !allianceImage4
      ) {
        toast.error("Please upload at least one alliance image");
        return;
      }

      setIsSubmitting(true);

      try {
        const formData = new FormData();

        // Alliance fields
        formData.append("experience_year", values.experience_year);
        formData.append("client", values.client);
        formData.append("projects", values.projects);
        formData.append("countries", values.countries);

        // Alliance images
        if (allianceImage1) formData.append("alliance_image1", allianceImage1);
        if (allianceImage2) formData.append("alliance_image2", allianceImage2);
        if (allianceImage3) formData.append("alliance_image3", allianceImage3);
        if (allianceImage4) formData.append("alliance_image4", allianceImage4);

        formData.append("is_active", "true");

        await createAlliance(formData).unwrap();
        toast.success("Alliance created successfully!");
        router.push("/admin/homepage/alliance");
      } catch (error) {
        console.error("Error creating alliance:", error);
        toast.error(
          error?.data?.message ||
            "Failed to create alliance. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Image handlers
  const handleAllianceImageUpload = (setter, setPreview) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setter(file);
    }
  };

  const removeAllianceImage = (setter, setPreview) => () => {
    setPreview(null);
    setter(null);
  };

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
                <H5 className="text-3xl font-bold">Create Alliance</H5>
                <P className="text-gray-600 mt-1">
                  Set up your alliance section
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
                  "Create Alliance"
                )}
              </Button>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                {/* Years Experience */}
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

                {/* Clients */}
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

                {/* Projects */}
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

                {/* Countries */}
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
                    {
                      label: "Image 1",
                      state: allianceImage1Preview,
                      setter: setAllianceImage1,
                      setPreview: setAllianceImage1Preview,
                    },
                    {
                      label: "Image 2",
                      state: allianceImage2Preview,
                      setter: setAllianceImage2,
                      setPreview: setAllianceImage2Preview,
                    },
                    {
                      label: "Image 3",
                      state: allianceImage3Preview,
                      setter: setAllianceImage3,
                      setPreview: setAllianceImage3Preview,
                    },
                    {
                      label: "Image 4",
                      state: allianceImage4Preview,
                      setter: setAllianceImage4,
                      setPreview: setAllianceImage4Preview,
                    },
                  ].map((item, index) => (
                    <div key={index} className="relative">
                      {item.state ? (
                        <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={item.state}
                            alt={`Alliance ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              item.setPreview(null);
                              item.setter(null);
                            }}
                            className="absolute top-1 right-1 rounded-full bg-red-500 text-white w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center aspect-square flex items-center justify-center hover:border-primary transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAllianceImageUpload(
                              item.setter,
                              item.setPreview,
                            )}
                            className="hidden"
                            id={`alliance_image${index + 1}`}
                          />
                          <label
                            htmlFor={`alliance_image${index + 1}`}
                            className="cursor-pointer block w-full"
                          >
                            <div className="text-3xl mb-1">🖼️</div>
                            <P color="muted" className="text-xs">
                              {item.label}
                            </P>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
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
                disabled={isSubmitting || isLoading}
                className="flex items-center gap-2"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Alliance"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

