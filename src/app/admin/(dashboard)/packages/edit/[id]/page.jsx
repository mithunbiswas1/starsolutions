// src/app/(pages)/packages/edit/[id]/page.jsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { H5, P } from "@/components/ui/Typography";
import {
  useGetPackageByIdQuery,
  useUpdatePackageMutation,
} from "@/redux/features/packageApi";
import { Plus, X } from "lucide-react";
import React from "react";

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string().required("Package name is required").max(100),
  price: Yup.string().required("Price is required").max(50),
  billing: Yup.string().required("Billing information is required").max(100),
  description: Yup.string().required("Description is required").max(500),
  buttonText: Yup.string().max(50),
  theme: Yup.string().oneOf(["light", "dark"]),
  badge: Yup.string().max(50),
  features: Yup.array()
    .of(Yup.string().required("Feature is required"))
    .min(1, "At least one feature is required"),
  order: Yup.number().default(0),
});

export default function EditPackagePage({ params }) {
  const router = useRouter();
  const { id } = React.use(params);

  const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState("update");

  // Fetch package data
  const { data: packageData, isLoading: isLoadingPackage } =
    useGetPackageByIdQuery(id, {
      skip: !id,
    });

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      billing: "",
      description: "",
      buttonText: "Get Started",
      theme: "light",
      badge: "",
      features: [""],
      order: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        // Filter out empty features
        const filteredFeatures = values.features.filter((f) => f.trim() !== "");

        if (filteredFeatures.length === 0) {
          toast.error("Please add at least one feature");
          setIsSubmitting(false);
          return;
        }

        const packageData = {
          ...values,
          features: filteredFeatures,
          is_active: actionType === "update",
        };

        await updatePackage({ id, data: packageData }).unwrap();

        const successMessage =
          actionType === "update"
            ? "Package updated and published successfully!"
            : "Package saved as draft successfully!";

        toast.success(successMessage);
        router.push("/admin/packages");
      } catch (error) {
        console.error("Error updating package:", error);
        toast.error(
          error?.data?.message || "Failed to update package. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Set form values when package data is loaded
  useEffect(() => {
    if (packageData?.data) {
      const pkg = packageData.data;
      formik.setValues({
        name: pkg.name || "",
        price: pkg.price || "",
        billing: pkg.billing || "",
        description: pkg.description || "",
        buttonText: pkg.buttonText || "Get Started",
        theme: pkg.theme || "light",
        badge: pkg.badge || "",
        features: pkg.features || [""],
        order: pkg.order || 0,
      });
    }
  }, [packageData]);

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
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-lg font-medium text-red-600">
                Invalid package ID
              </p>
              <LinkButton href="/admin/packages" variant="primary" className="mt-4">
                ← Back to Packages
              </LinkButton>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Loading state
  if (isLoadingPackage) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading package...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const pkg = packageData?.data;

  if (!pkg) {
    return (
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-lg font-medium text-gray-600">
                Package not found
              </p>
              <LinkButton href="/admin/packages" variant="primary" className="mt-4">
                ← Back to Packages
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
            href="/admin/packages"
            variant="outline_primary"
            size="sm"
            className="inline-flex items-center gap-2"
          >
            ← Back to Packages
          </LinkButton>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <H5 className="text-3xl font-bold">Edit Package</H5>
                <P className="text-gray-600 mt-1">Update package details</P>
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

          <form className="p-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6 max-w-3xl">
              {/* Name */}
              <Input
                id="name"
                name="name"
                label="Package Name"
                placeholder="e.g., Starter, Professional"
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

              {/* Price & Billing */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  id="price"
                  name="price"
                  label="Price"
                  placeholder="e.g., $299, Custom"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.price && formik.errors.price
                      ? formik.errors.price
                      : null
                  }
                  required
                />
                <Input
                  id="billing"
                  name="billing"
                  label="Billing"
                  placeholder="e.g., One-time consultation, Per project"
                  value={formik.values.billing}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.billing && formik.errors.billing
                      ? formik.errors.billing
                      : null
                  }
                  required
                />
              </div>

              {/* Description */}
              <Textarea
                id="description"
                name="description"
                label="Description"
                placeholder="Brief description of the package"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description && formik.errors.description
                    ? formik.errors.description
                    : null
                }
                rows={3}
                required
              />

              {/* Button Text & Theme */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  id="buttonText"
                  name="buttonText"
                  label="Button Text"
                  placeholder="e.g., Get Started, Contact Sales"
                  value={formik.values.buttonText}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.buttonText && formik.errors.buttonText
                      ? formik.errors.buttonText
                      : null
                  }
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Theme
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={formik.values.theme}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                  {formik.touched.theme && formik.errors.theme && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.theme}
                    </p>
                  )}
                </div>
              </div>

              {/* Badge */}
              <Input
                id="badge"
                name="badge"
                label="Badge (Optional)"
                placeholder="e.g., Most Popular, Best Value"
                value={formik.values.badge}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.badge && formik.errors.badge
                    ? formik.errors.badge
                    : null
                }
              />

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="space-y-3">
                  {formik.values.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        name={`features.${index}`}
                        placeholder={`Feature ${index + 1}`}
                        value={feature}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.features?.[index] &&
                          formik.errors.features?.[index]
                            ? formik.errors.features[index]
                            : null
                        }
                        className="flex-1"
                      />
                      {formik.values.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newFeatures = formik.values.features.filter(
                              (_, i) => i !== index,
                            );
                            formik.setFieldValue("features", newFeatures);
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    formik.setFieldValue("features", [
                      ...formik.values.features,
                      "",
                    ]);
                  }}
                  className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  <Plus size={18} />
                  Add Feature
                </button>
                {formik.touched.features && formik.errors.features && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.features}
                  </p>
                )}
              </div>

              {/* Order */}
              {/* <Input
                id="order"
                name="order"
                label="Display Order"
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
                helperText="Lower number appears first"
              /> */}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => router.push("/admin/packages")}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleSaveDraft}
                disabled={isSubmitting || isUpdating}
              >
                Save Draft
              </Button>
              <Button
                variant="primary"
                size="lg"
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
          </form>
        </div>
      </div>
    </main>
  );
}

