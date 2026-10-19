// src/app/(pages)/messages/add/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useCreateClientMessageMutation } from "@/redux/features/clientMessageApi";

// Reusable Components
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { H5, P } from "@/components/ui/Typography";

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format")
    .max(100, "Email must be less than 100 characters"),
  phone: Yup.string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 characters")
    .max(20, "Phone number must be less than 20 characters"),
  subject: Yup.string()
    .required("Subject is required")
    .max(200, "Subject must be less than 200 characters"),
  message: Yup.string()
    .required("Message is required")
    .max(2000, "Message must be less than 2000 characters"),
});

export default function AddMessagePage() {
  const router = useRouter();
  const [createMessage, { isLoading }] = useCreateClientMessageMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        await createMessage(values).unwrap();
        toast.success("Message sent successfully!");
        router.push("/admin/messages");
      } catch (error) {
        console.error("Error creating message:", error);
        toast.error(
          error?.data?.message || "Failed to send message. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <main className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <LinkButton
            href="/admin/messages"
            variant="outline_primary"
            size="sm"
            className="inline-flex items-center gap-2"
          >
            ← Back to Messages
          </LinkButton>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <H5 className="text-3xl font-bold">Add New Message</H5>
                <P className="text-gray-600 mt-1">
                  Create a new client message manually
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
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Name & Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  id="name"
                  name="name"
                  label="Full Name"
                  placeholder="Enter full name"
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
                <Input
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter email address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.email && formik.errors.email
                      ? formik.errors.email
                      : null
                  }
                  required
                />
              </div>

              {/* Phone & Subject */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  placeholder="Enter phone number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.phone && formik.errors.phone
                      ? formik.errors.phone
                      : null
                  }
                  required
                />
                <Input
                  id="subject"
                  name="subject"
                  label="Subject"
                  placeholder="Enter message subject"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.subject && formik.errors.subject
                      ? formik.errors.subject
                      : null
                  }
                  required
                />
              </div>

              {/* Message */}
              <Textarea
                id="message"
                name="message"
                label="Message"
                placeholder="Write your message here..."
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.message && formik.errors.message
                    ? formik.errors.message
                    : null
                }
                rows={6}
                required
                helperText={`${formik.values.message.length}/2000 characters`}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => router.push("/admin/messages")}
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
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

