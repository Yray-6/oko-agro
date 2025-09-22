"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedLoading from "@/app/Loading";
import Modal from "../Modal";
import { useAuthStore } from "@/app/store/useAuthStore";
import { LoginUserRequest } from "@/app/types";

// TypeScript interfaces
interface LoginFormValues {
  email: string;
  password: string;
}

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const ProcessorLoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  // Auth store
  const { login, isLoading, error, isAuthenticated, user, clearError } =
    useAuthStore();

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case "farmer":
          router.push("/dashboard");
          break;
        case "processor":
          router.push("/dashboard-processor");
          break;
        default:
          // Handle unknown roles
          break;
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      clearError();

      const loginData: LoginUserRequest = {
        email: values.email,
        password: values.password,
      };

      await login(loginData);

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      // Error is handled by the store
      console.error("Login failed:", error);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Navigate to processor dashboard after modal closes
    router.push("/dashboard-processor");
  };


  return (
    <>
      {isLoading && <AnimatedLoading />}
      <div className="p-4 sm:p-6 lg:p-8 bg-white/80 rounded-lg shadow-lg max-w-md mx-auto lg:mx-0">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-mainGreen mb-2">
            Login as Processor
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm">
            Welcome back — your growth journey continues.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Login Failed
                </h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form className="space-y-4 sm:space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Email Address *
                </label>
                <Field
                  name="email"
                  type="email"
                  disabled={isLoading}
                  className="w-full px-3 py-2 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Onarubeduwaie@gmail.com"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(e); // Let Formik handle the change first
                    clearError(); // Then clear the error
                  }}
                  onBlur={handleBlur}
                  value={values.email}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    disabled={isLoading}
                    className="w-full px-3 py-2 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent pr-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="••••••••••••"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e); // Let Formik handle the change first
                      clearError(); // Then clear the error
                    }}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  href="/reset-password"
                  className="text-xs sm:text-sm text-mainGreen hover:text-mainGreen/80 font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-2.5 sm:py-3 bg-mainGreen text-white text-xs sm:text-sm font-medium rounded-md hover:bg-mainGreen/90 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                      />
                      <path
                        fill="currentColor"
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Logging In...
                  </span>
                ) : (
                  "Log In"
                )}
              </button>

              {/* Sign Up Link */}
              <div className="text-center pt-3 sm:pt-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register-processor"
                    className="text-mainGreen hover:text-mainGreen/80 font-medium transition-colors"
                  >
                    Create an Account
                  </Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>

        {/* Back to Homepage Link */}
        <div className="text-center pt-6 sm:pt-8 mt-2 border-t border-gray-200">
          <Link
            href="/"
            className="text-xs sm:text-sm text-mainGreen underline font-semibold hover:text-mainGreen/80 transition-colors inline-block hover:scale-105"
          >
            Back to Homepage
          </Link>
        </div>

        <Modal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          size="sm"
          showCloseButton={false}
          className="text-center"
          closeOnOverlayClick={false}
          closeOnEscape={false}
        >
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-mainGreen/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-mainGreen"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-mainGreen mb-2">
            Login Successful!
          </h2>

          {/* Simple message */}
          <p className="text-sm text-gray-600 mb-4">
            Redirecting to dashboard...
          </p>
        </Modal>
      </div>
    </>
  );
};

export default ProcessorLoginForm;
