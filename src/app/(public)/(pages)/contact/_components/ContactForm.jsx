// src/app/(pages)/contact/_components/ContactForm.jsx

"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import { Loader2 } from "lucide-react";
import { useCreateClientMessageMutation } from "@/redux/features/clientMessageApi";

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

export default function ContactForm() {
  const [createMessage, { isLoading }] = useCreateClientMessageMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await createMessage(values).unwrap();
        console.log("Message sent:", response);
        toast.success("Message sent successfully! We'll get back to you soon.");
        resetForm();
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error(
          error?.data?.message || "Failed to send message. Please try again.",
        );
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8">
      <Input
        id="name"
        name="name"
        label="Name*"
        placeholder="Enter your name"
        className="h-16 rounded-2xl border-0 bg-gray-200 px-6 text-lg"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.name && formik.errors.name ? formik.errors.name : null
        }
        required
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email*"
          placeholder="Enter your email"
          className="h-16 rounded-2xl border-0 bg-gray-200 px-6 text-lg"
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

        <Input
          id="phone"
          name="phone"
          type="tel"
          label="Phone*"
          placeholder="Enter your phone"
          className="h-16 rounded-2xl border-0 bg-gray-200 px-6 text-lg"
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
      </div>

      <Input
        id="subject"
        name="subject"
        label="Subject*"
        placeholder="Enter message subject"
        className="h-16 rounded-2xl border-0 bg-gray-200 px-6 text-lg"
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

      <div>
        <label className="block mb-3 text-sm font-medium text-gray_deep">
          Message*
        </label>

        <textarea
          id="message"
          name="message"
          rows={6}
          placeholder="Tell us about your project..."
          className={`w-full rounded-2xl border-0 bg-gray-200 px-6 py-5 text-base outline-none focus:ring-1 focus:ring-primary resize-none ${
            formik.touched.message && formik.errors.message
              ? "ring-2 ring-red-500"
              : ""
          }`}
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.message && formik.errors.message && (
          <p className="mt-1 text-sm text-red-600">{formik.errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="h-20 w-full rounded-full bg-black text-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
