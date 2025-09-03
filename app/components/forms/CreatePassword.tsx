"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedLoading from "@/app/Loading";
import Modal from "../Modal";
import Image from "next/image";
import mailVerify from "@/app/assets/images/email-verified.png";
interface CreatePasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

const CreatePasswordForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<CreatePasswordFormValues>({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<CreatePasswordFormValues>>({});
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Partial<CreatePasswordFormValues> = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof CreatePasswordFormValues,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call for password creation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("New password created:", formData);

      // Show success modal instead of direct navigation
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Password creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    setShowSuccessModal(false);
    // Navigate to login page
    router.push("/login-farmer");
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = [
    "",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-emerald-500",
  ];

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 bg-white/80 rounded-lg shadow-lg max-w-md mx-auto lg:mx-0">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-mainGreen mb-2">
            Create New Password
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm">
            Enter your new preferred password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* New Password Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                className="w-full px-3 py-2 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent pr-10 transition-colors"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
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

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${strengthColors[passwordStrength]}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength >= 3
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Use 8+ characters with uppercase, lowercase, numbers, and
                  symbols
                </div>
              </div>
            )}

            {errors.newPassword && (
              <div className="text-red-500 text-xs mt-1 bg-red-50 p-2 rounded-md">
                {errors.newPassword}
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="w-full px-3 py-2 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent pr-10 transition-colors"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
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
            {errors.confirmPassword && (
              <div className="text-red-500 text-xs mt-1 bg-red-50 p-2 rounded-md">
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-2.5 sm:py-3 bg-mainGreen text-white text-xs sm:text-sm font-medium rounded-md hover:bg-mainGreen/90 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
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
                Creating Password...
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </form>

        {/* Back to Homepage Link */}
        <div className="text-center pt-6 sm:pt-8 mt-6 sm:mt-12 border-t border-gray-200">
          <Link
            href="/"
            className="text-xs sm:text-sm text-mainGreen underline font-semibold hover:text-mainGreen/80 transition-colors inline-block hover:scale-105"
          >
            Back to Homepage
          </Link>
        </div>

        {isSubmitting && <AnimatedLoading />}
      </div>

      {/* Password Reset Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={closeSuccessModal}
        size="md"
        showCloseButton={false}
        className="text-center"
        closeOnOverlayClick={false}
        closeOnEscape={false}
      >
        {/* Email Icon with Checkmark */}
        <div className="flex justify-center  mb-6">
          <div className="relative">
            {/* Email Icon */}
            <Image src={mailVerify} alt="Email Icon" width={100} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-mainGreen mb-8">
          Password Reset Succesful!
        </h2>

        {/* Message */}
        <div className="space-y-4 mb-10">
          <p className="text-black leading-relaxed">
            Your password reset request is successful. Please, proceed to login
            with your new password to access your dashboard
          </p>
        </div>

        {/* Back to Login Button */}
        <button
          onClick={handleBackToLogin}
          className="w-full py-3 px-6 border border-mainGreen text-mainGreen rounded-md hover:bg-mainGreen hover:text-white transition-colors font-medium"
        >
          Back to Login
        </button>
      </Modal>
    </>
  );
};

export default CreatePasswordForm;
