"use client";

import Link from "next/link";
import { useRegistrationMutation } from "@/redux/features/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";

const RegisterForm = () => {
  const router = useRouter();
  const [registration, { isLoading: regLoading }] = useRegistrationMutation();

  // Validation schema
  const validationSchema = Yup.object({
    userName: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters"),
    fullName: Yup.string()
      .required("Full Name is required")
      .min(2, "Full Name must be at least 2 characters"),
    phone: Yup.string().required("Mobile number is required"),
    email: Yup.string().email("Please enter a valid email address").optional(),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    role: Yup.string().default("admin"),
  });

  const formik = useFormik({
    initialValues: {
      userName: "",
      fullName: "",
      phone: "",
      email: "",
      password: "",
      role: "admin",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          userName: values.userName,
          fullName: values.fullName,
          phone: values.phone,
          email: values.email || undefined,
          password: values.password,
          role: values.role,
        };

        const res = await registration(payload).unwrap();

        if (res?.success) {
          toast.success("Registration successful! Please login.");
          resetForm();
          router.push("/admin/login");
        } else {
          if (res?.errors && Array.isArray(res.errors)) {
            res.errors.forEach((errorMessage) => toast.error(errorMessage));
          } else {
            toast.error(res?.message || "Registration failed");
          }
        }
      } catch (err) {
        toast.error(
          err?.data?.errors?.[0] ||
            err?.data?.message ||
            "Something went wrong",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="p-4">
      <div className="block lg:hidden bg-primary text-white px-4 py-8 rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Join us today!</h2>
        <p className="text-gray-200">
          Create an account with your mobile number to get started
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center lg:max-w-3xl mx-auto lg:my-10 p-4 bg-white lg:min-h-140 shadow border border-gray-200 lg:rounded-sm">
        <div className="hidden lg:block lg:col-span-2 lg:h-full bg-primary text-white p-8 rounded-md">
          <h2 className="text-2xl font-semibold mb-6">Join us today!</h2>
          <p className="text-gray-200">
            Create an account with your mobile number to get started
          </p>
        </div>

        <div className="lg:col-span-3 lg:pr-4 lg:py-10">
          <form
            onSubmit={formik.handleSubmit}
            className="space-y-4 py-4 lg:py-0"
          >
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Full Name"
                className={`border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                  formik.touched.fullName && formik.errors.fullName
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.fullName}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="userName"
                value={formik.values.userName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Username"
                className={`border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                  formik.touched.userName && formik.errors.userName
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.userName && formik.errors.userName && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.userName}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Mobile Number"
                className={`border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                  formik.touched.phone && formik.errors.phone
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.phone}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Email <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Email (Optional)"
                className={`border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Password"
                className={`border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={regLoading || formik.isSubmitting}
              className={`w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary-dark transition ${
                regLoading || formik.isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {regLoading || formik.isSubmitting
                ? "Registering..."
                : "Register →"}
            </button>
          </form>

          <Link href="/admin/login" className="block text-xs text-gray-500 mt-5">
            Already have an account?{" "}
            <span className="text-primary underline cursor-pointer">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

