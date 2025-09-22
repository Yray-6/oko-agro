"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import Modal from "../Modal";
import Image from "next/image";
import profileSubmitted from "@/app/assets/images/profileSubmitted.png";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

interface ValidationRule {
  id: string;
  label: string;
  regex: RegExp;
}

const SecuritySettings: React.FC = () => {
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation rules
  const validationRules: ValidationRule[] = [
    {
      id: "length",
      label: "At least 8 characters",
      regex: /.{8,}/,
    },
    {
      id: "uppercase",
      label: "At least one uppercase letter",
      regex: /[A-Z]/,
    },
    {
      id: "lowercase",
      label: "At least one lowercase letter",
      regex: /[a-z]/,
    },
    {
      id: "symbol",
      label: "At least one symbol (!@#$%^&*)",
      regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    },
  ];

  const validatePassword = (password: string): boolean => {
    return validationRules.every((rule) => rule.regex.test(password));
  };
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = "Password does not meet requirements";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (
      formData.currentPassword === formData.newPassword &&
      formData.currentPassword.trim()
    ) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Password updated successfully");

      // Reset form after successful update
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
        setShowSuccessModal(true)
    } catch (error) {
      console.error("Password update failed:", error);
      setErrors({ submit: "Failed to update password. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Security Settings
      </h2>

      <div className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-3 text-sm bg-gray-50 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors pr-10"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.currentPassword}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-3 text-sm bg-gray-50 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors pr-10"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
          )}
        </div>

        {/* Password Requirements */}
        {formData.newPassword && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Password Requirements:
            </h4>
            <div className="space-y-2">
              {validationRules.map((rule) => {
                const isValid = rule.regex.test(formData.newPassword);
                return (
                  <div key={rule.id} className="flex items-center gap-2">
                    <div
                      className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                        isValid ? "bg-mainGreen" : "bg-gray-300"
                      }`}
                    >
                      {isValid ? (
                        <Check size={12} className="text-white" />
                      ) : (
                        <X size={12} className="text-gray-500" />
                      )}
                    </div>
                    <span
                      className={`text-xs ${
                        isValid ? "text-mainGreen" : "text-gray-600"
                      }`}
                    >
                      {rule.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-3 text-sm bg-gray-50 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors pr-10"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Update Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            !validatePassword(formData.newPassword) ||
            formData.newPassword !== formData.confirmPassword
          }
          className="w-full py-3 px-4 bg-mainGreen text-white rounded-lg font-medium hover:bg-mainGreen/90 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
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
              Updating Password...
            </div>
          ) : (
            "Update Password"
          )}
        </button>
      </div>
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
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Image src={profileSubmitted} alt="Success Icon" width={100} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-mainGreen mb-8">
          Password Reset Successful!
        </h2>

        {/* Message */}
        <div className="space-y-4 mb-10">
          <p className="text-black leading-relaxed">
            Your password has been successfully reset.
          </p>
        </div>

        {/* Back to Login Button */}
        <button
          onClick={closeSuccessModal}
          className="w-full py-3 px-6 border border-mainGreen text-mainGreen rounded-md hover:bg-mainGreen hover:text-white transition-colors font-medium"
        >
          Back to Successful
        </button>
      </Modal>
    </div>
  );
};

export default SecuritySettings;
