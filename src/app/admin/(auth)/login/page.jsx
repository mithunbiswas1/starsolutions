// src/app/(auth)/login/page.jsx
"use client";

import Link from "next/link";
import { useLoginMutation } from "@/redux/features/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const LoginForm = () => {
  const router = useRouter();
  const { login: authLogin, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  // Validation schema
  const validationSchema = Yup.object({
    phone: Yup.string().required("Mobile number is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      phone: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          phone: values.phone,
          password: values.password,
        };

        const result = await login(payload).unwrap();

        // Store tokens and user data using auth context
        if (result?.data) {
          authLogin(
            result.data.user,
            result.data.accessToken,
            result.data.refreshToken,
          );
        }

        toast.success(`Welcome back ${result.data.user.fullName || "User"}!`);

        resetForm();
        router.push("/admin/dashboard");
      } catch (err) {
        toast.error(
          err?.data?.errors?.[0] ||
            err?.data?.message ||
            "Login failed. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="p-4">
      {/* Mobile promo panel */}
      <div className="block lg:hidden lg:col-span-2 lg:h-full bg-primary text-white px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Welcome Back!</h2>
        <p className="text-gray-200">
          Login with your mobile number to continue
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center lg:max-w-3xl mx-auto lg:my-10 p-4 bg-white lg:min-h-140 shadow border border-gray-200 lg:rounded-sm">
        {/* Desktop promo panel */}
        <div className="hidden lg:block lg:col-span-2 lg:h-full bg-primary text-white p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Looks like you're new here!
          </h2>
          <p className="text-gray-200">
            Sign up with your mobile number to get started
          </p>
        </div>

        {/* Right form panel */}
        <div className="lg:col-span-3 lg:pr-4 lg:py-10">
          <form
            onSubmit={formik.handleSubmit}
            className="space-y-4 py-4 lg:py-0"
          >
            {/* Mobile input */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Mobile Number"
                className={`flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
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

            {/* Password input with eye toggle */}
            <div className="relative flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter Password"
                  className={`w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </span>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || formik.isSubmitting}
              className={`w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary-dark transition ${
                isLoading || formik.isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading || formik.isSubmitting ? "Logging in..." : "Login →"}
            </button>
          </form>

          <Link
            href="/admin/registration"
            className="block text-xs text-gray-500 mt-5"
          >
            Don't have an account?{" "}
            <span className="text-primary underline cursor-pointer">
              Register
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

