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
    <form
      onSubmit={formik.handleSubmit}
      className="glass-dark bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6"
    >
      <Input
        id="name"
        name="name"
        label="Name*"
        placeholder="Enter your name"
        className="h-14 sm:h-16 rounded-2xl border border-white/10 bg-white/[0.04] px-6 text-white placeholder:text-gray-500 focus:border-primary/50 focus:bg-white/[0.08]"
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
          className="h-14 sm:h-16 rounded-2xl border border-white/10 bg-white/[0.04] px-6 text-white placeholder:text-gray-500 focus:border-primary/50 focus:bg-white/[0.08]"
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
          className="h-14 sm:h-16 rounded-2xl border border-white/10 bg-white/[0.04] px-6 text-white placeholder:text-gray-500 focus:border-primary/50 focus:bg-white/[0.08]"
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
        className="h-14 sm:h-16 rounded-2xl border border-white/10 bg-white/[0.04] px-6 text-white placeholder:text-gray-500 focus:border-primary/50 focus:bg-white/[0.08]"
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
        <label className="block mb-2 text-sm font-medium text-gray-300">
          Message*
        </label>

        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us about your project requirements..."
          className={`w-full rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-white placeholder:text-gray-500 outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all resize-none ${
            formik.touched.message && formik.errors.message
              ? "border-red-500"
              : ""
          }`}
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.message && formik.errors.message && (
          <p className="mt-1 text-sm text-red-400">{formik.errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="h-16 w-full rounded-full bg-primary text-black text-lg font-bold transition-all duration-300 hover:shadow-[0_0_25px_rgba(46,208,110,0.4)] hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
