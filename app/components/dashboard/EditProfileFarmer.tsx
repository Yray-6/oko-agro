"use client";
import React, { useState } from "react";
import { Edit3, Save, X } from "lucide-react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { User } from "@/app/types";
import Modal from "../Modal";
import Image from "next/image";
import profileSubmitted from "@/app/assets/images/profileSubmitted.png";

interface FormErrors {
  [key: string]: string;
}

interface DisplayFieldProps {
  label: string;
  value: string;
  className?: string;
}

interface EditFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  as?: "input" | "textarea";
  rows?: number;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
}

// Display field for view mode
const DisplayField: React.FC<DisplayFieldProps> = ({
  label,
  value,
  className = "",
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label}
      </label>
      <div className="px-3 py-3 text-sm bg-gray-50 rounded-lg text-gray-600">
        {value || "Not provided"}
      </div>
    </div>
  );
};

// Edit field for edit mode
const EditField: React.FC<EditFieldProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  as = "input",
  rows = 3,
  value,
  onChange,
  error,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {as === "textarea" ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            className="w-full px-3 py-3 text-sm border-0 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainGreen focus:bg-white transition-colors resize-none"
            placeholder={placeholder}
          />
        ) : (
          <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-3 text-sm border-0 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainGreen focus:bg-white transition-colors"
            placeholder={placeholder}
          />
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

const EditProfileFarmer: React.FC = () => {
  const { user } = useAuthStore();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<User>(user ?? ({} as User));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Early return if user is null
  if (!user) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading user information...</p>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email?.trim()) {
      newErrors.email = "email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev: User) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev: FormErrors) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(
        0
      )}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));
      console.log("Updated company data:", formData);
      setShowSuccessModal(true);

      setIsEditing(false);
      setErrors({});
    } catch (error: unknown) {
      console.error("Update failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    setFormData(user); // Reset to original data from auth store
    setErrors({});
    setIsEditing(false);
  };

  const handleEdit = (): void => {
    setFormData(user); // Initialize form with current user data
    setIsEditing(true);
  };
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {getUserInitials()}
              </span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Company Information
          </h2>
        </div>

        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center text-sm gap-2 px-4 py-2 bg-mainGreen text-white rounded-lg hover:bg-mainGreen/90 transition-colors font-medium"
            type="button"
          >
            <Edit3 className="w-4 h-4" />
            Edit Information
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isEditing ? (
            <>
              <EditField
                name="farmName"
                label="Farm Name"
                placeholder="Enter farm name"
                required={false}
                value={formData.farmName ?? ""}
                onChange={handleInputChange}
                error={errors.farmName}
              />

              <DisplayField label="First Name" value={user.firstName ?? ""} />
            </>
          ) : (
            <>
              <DisplayField label="Farm Name" value={user.farmName ?? ""} />

              <DisplayField label="First Name" value={user.firstName ?? ""} />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isEditing ? (
            <>
              <DisplayField label="Last Name" value={user.lastName ?? ""} />
            </>
          ) : (
            <>
              <DisplayField label="Last Name" value={user.lastName ?? ""} />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isEditing ? (
            <>
              <EditField
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter company email address"
                required={true}
                value={formData.email || ""}
                onChange={handleInputChange}
                error={errors.email}
              />

              <EditField
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter phone number"
                required={true}
                value={formData.phoneNumber || ""}
                onChange={handleInputChange}
                error={errors.phoneNumber}
              />
            </>
          ) : (
            <>
              <DisplayField label="Email Address" value={user.email || ""} />

              <DisplayField
                label="Phone Number"
                value={user.phoneNumber || ""}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isEditing ? (
            <>
              <EditField
                name="farmingExperience"
                label="Farming Experience"
                placeholder="Enter Farming Experience"
                required={true}
                value={formData.farmingExperience || ""}
                onChange={handleInputChange}
                error={errors.farmingExperience}
              />
            </>
          ) : (
            <>
              <DisplayField
                label="Farming Experience"
                value={user.farmingExperience || ""}
              />
            </>
          )}
        </div>

        <div>
          {isEditing ? (
            <EditField
              name="farmAddress"
              label="Company/Farm Location"
              as="textarea"
              rows={3}
              placeholder="Enter company/farm location"
              required={true}
              value={formData.farmAddress || ""}
              onChange={handleInputChange}
              error={errors.farmAddress}
            />
          ) : (
            <DisplayField
              label="Company/Farm Location"
              value={user.farmAddress || ""}
            />
          )}
        </div>

        {/* Show validation errors summary */}
        {isEditing && Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Please fix the following errors:
            </h4>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(errors).map(
                ([field, error]: [string, string]) =>
                  error && <li key={field}>• {error}</li>
              )}
            </ul>
          </div>
        )}

        {/* Submit button (only show when editing) */}
        {isEditing && (
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              type="button"
              className="flex items-center gap-2 px-6 py-2 bg-mainGreen text-white rounded-lg hover:bg-mainGreen/90 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <>
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
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
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
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Image src={profileSubmitted} alt="Success Icon" width={100} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-mainGreen mb-8">
          Profile Update Submitted!
        </h2>

        {/* Message */}
        <div className="space-y-4 mb-10">
          <p className="text-black leading-relaxed">
            Your profile update has been submitted successfully. Our team will
            review the changes and your details will be updated accordingly.
          </p>
        </div>

        <button
          onClick={closeSuccessModal}
          className="w-full py-3 px-6 border border-mainGreen text-mainGreen rounded-md hover:bg-mainGreen hover:text-white transition-colors font-medium"
        >
          Back to Settings
        </button>
      </Modal>
    </div>
  );
};

export default EditProfileFarmer;
