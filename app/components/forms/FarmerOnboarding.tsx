/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Leaf from "@/app/assets/icons/Leaf";
import mail from "@/app/assets/images/mail.png";
import Link from "next/link";
import {
  TextField,
  SelectField,
  FileField,
  countryOptions,
  stateOptions,
  unitOptions,
  farmingExperienceOptions,
  internetAccessOptions,
  currentSellingMethodOptions,
  bankOptions,
  unitOptionsLand,
} from "./FormFields";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UserIcon from "@/app/assets/icons/UserIcon";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useDataStore } from "@/app/store/useDataStore";
import { Crop, RegisterUserRequest } from "@/app/types";
import AnimatedLoading from "@/app/Loading";
import Modal from "../Modal";
import Image from "next/image";

// TypeScript interfaces
interface FormValues {
  // Step 1: Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  farmLocation: string;
  country: string;
  state: string;

  // Step 2: Farm Details
  farmName: string;
  cropsGrown: string[];
  farmSize: string;
  unit: string;
  estimatedAnnualProduction: string;

  // Step 3: Experience Assessment
  farmingExperience: string;
  internetAccess: string;
  currentSellingMethod: string;

  // Step 4: Picture Verification
  farmPhoto: File | null;
  farmerPhoto: File | null;

  // Step 5: Payment Setup
  bankName: string;
  accountNumber: string;

  // Password fields
  password: string;
  confirmPassword: string;
}

const initialValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  farmLocation: "",
  country: "",
  state: "",
  farmName: "",
  cropsGrown: [],
  farmSize: "",
  unit: "",
  estimatedAnnualProduction: "",
  farmingExperience: "",
  internetAccess: "",
  currentSellingMethod: "",
  farmPhoto: null,
  farmerPhoto: null,
  bankName: "",
  accountNumber: "",
  password: "",
  confirmPassword: "",
};

// Validation schemas for each step
const stepValidationSchemas = [
  // Step 1: Basic Information
  Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    farmLocation: Yup.string().required("Farm location is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
  }),

  // Step 2: Farm Details (Updated with number validation)
  Yup.object({
    farmName: Yup.string().required("Farm name is required"),
    cropsGrown: Yup.array().min(1, "Please select at least one crop"),
    farmSize: Yup.string()
      .required("Farm size is required")
      .test('is-positive-number', 'Farm size must be a positive number', function(value) {
        if (!value) return false;
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue > 0;
      })
      .test('max-decimal-places', 'Farm size can have at most 2 decimal places', function(value) {
        if (!value) return true;
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return false;
        const decimalPlaces = (value.split('.')[1] || '').length;
        return decimalPlaces <= 2;
      }),
    unit: Yup.string().required("Unit is required"),
    estimatedAnnualProduction: Yup.string()
      .required("Estimated annual production is required")
      .test('is-positive-number', 'Production must be a positive number', function(value) {
        if (!value) return false;
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue > 0;
      })
      .test('max-decimal-places', 'Production can have at most 2 decimal places', function(value) {
        if (!value) return true;
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return false;
        const decimalPlaces = (value.split('.')[1] || '').length;
        return decimalPlaces <= 2;
      }),
  }),

  // Step 3: Experience Assessment
  Yup.object({
    farmingExperience: Yup.string().required(
      "Please select your farming experience"
    ),
    internetAccess: Yup.string().required(
      "Please select your internet access method"
    ),
    currentSellingMethod: Yup.string().required(
      "Please select your current selling method"
    ),
  }),

  // Step 4: Picture Verification
  Yup.object({
    farmPhoto: Yup.mixed().required("Farm photo is required"),
    farmerPhoto: Yup.mixed().required("Farmer photo is required"),
  }),

  // Step 5: Payment Setup & Password
  Yup.object({
    bankName: Yup.string().required("Bank name is required"),
    accountNumber: Yup.string().min(10, "Account number must be at least 10 characters").required("Account number is required"),
    password: Yup.string()
      .min(7, "Password must be at least 7 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  }),
];

const fullValidationSchema = Yup.object({
  // Step 1: Basic Information
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  farmLocation: Yup.string().required("Farm location is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),

  // Step 2: Farm Details (Updated with number validation)
  farmName: Yup.string().required("Farm name is required"),
  cropsGrown: Yup.array().min(1, "Please select at least one crop"),
  farmSize: Yup.string()
    .required("Farm size is required")
    .test('is-positive-number', 'Farm size must be a positive number', function(value) {
      if (!value) return false;
      const numValue = parseFloat(value);
      return !isNaN(numValue) && numValue > 0;
    })
    .test('max-decimal-places', 'Farm size can have at most 2 decimal places', function(value) {
      if (!value) return true;
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return false;
      const decimalPlaces = (value.split('.')[1] || '').length;
      return decimalPlaces <= 2;
    }),
  unit: Yup.string().required("Unit is required"),
  estimatedAnnualProduction: Yup.string()
    .required("Estimated annual production is required")
    .test('is-positive-number', 'Production must be a positive number', function(value) {
      if (!value) return false;
      const numValue = parseFloat(value);
      return !isNaN(numValue) && numValue > 0;
    })
    .test('max-decimal-places', 'Production can have at most 2 decimal places', function(value) {
      if (!value) return true;
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return false;
      const decimalPlaces = (value.split('.')[1] || '').length;
      return decimalPlaces <= 2;
    }),

  // Step 3: Experience Assessment
  farmingExperience: Yup.string().required(
    "Please select your farming experience"
  ),
  internetAccess: Yup.string().required(
    "Please select your internet access method"
  ),
  currentSellingMethod: Yup.string().required(
    "Please select your current selling method"
  ),

  // Step 4: Picture Verification
  farmPhoto: Yup.mixed().required("Farm photo is required"),
  farmerPhoto: Yup.mixed().required("Farmer photo is required"),

  // Step 5: Payment Setup & Password
  bankName: Yup.string().required("Bank name is required"),
  accountNumber: Yup.string().required("Account number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 7 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});
const FarmerRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const handleCloseModal=()=> {
    setShowSuccessModal(false)
  }
  // Use the auth store
  const { register, isLoading, error, registrationUserId, clearError } =
    useAuthStore();

  // Use the crops store
  const {
    crops,
    isLoading: cropsLoading,
    error: cropsError,
    fetchCrops,
  } = useDataStore();

  const steps = [
    "Basic Information",
    "Farm Details",
    "Experience Assessment",
    "Picture Verification",
    "Payment Setup",
  ];

  // Clear any previous errors when component mounts and fetch crops
  useEffect(() => {
    console.log("🔄 Component mounted, clearing errors and fetching crops");
    clearError();
    fetchCrops();
  }, [clearError, fetchCrops]);

  // Debug registrationUserId changes
  useEffect(() => {
    console.log("📝 Registration User ID changed:", registrationUserId);
    if (registrationUserId) {
      console.log(
        "✅ Registration successful, redirecting to OTP verification"
      );
      router.push("/verify-otp");
    }
  }, [registrationUserId, router]);

  // Convert crops to options format for the SelectField
  const cropsOptions = crops.map((crop) => ({
    value: crop.id,
    label: crop.name,
  }));

  console.log("🌱 Available crops:", cropsOptions);

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleNext = async (
    validateForm: () => Promise<any>,
    values: FormValues
  ) => {
    console.log(`🔍 Validating step ${currentStep + 1}...`);
    console.log("📋 Current values:", values);

    const errors = await validateForm();
    console.log("❌ Validation errors:", errors);

    const currentStepErrors = Object.keys(errors).filter((key) => {
      const stepFields = getStepFields(currentStep);
      return stepFields.includes(key);
    });

    console.log(
      `🎯 Step ${currentStep + 1} specific errors:`,
      currentStepErrors
    );

    if (currentStepErrors.length === 0) {
      console.log(
        `✅ Step ${currentStep + 1} validation passed, moving to next step`
      );
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      console.log(
        `❌ Step ${currentStep + 1} validation failed:`,
        currentStepErrors.map((key) => ({ field: key, error: errors[key] }))
      );
    }
  };

  const handlePrevious = () => {
    console.log(
      `⬅️ Moving back from step ${currentStep + 1} to step ${currentStep}`
    );
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getStepFields = (step: number): string[] => {
    const fieldMap = {
      0: [
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "farmLocation",
        "country",
        "state",
      ],
      1: [
        "farmName",
        "cropsGrown",
        "farmSize",
        "unit",
        "estimatedAnnualProduction",
      ],
      2: ["farmingExperience", "internetAccess", "currentSellingMethod"],
      3: ["farmPhoto", "farmerPhoto"],
      4: ["bankName", "accountNumber", "password", "confirmPassword"],
    };

    const fields = fieldMap[step as keyof typeof fieldMap] || [];
    console.log(`📝 Fields for step ${step + 1}:`, fields);
    return fields;
  };

const handleSubmit = async (
  values: FormValues,
  { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
) => {
  console.log("🚀 Form submission started");
  console.log("📋 Final form values:", values);

  try {
    // Clear any previous errors
    clearError();
    console.log("🧹 Previous errors cleared");

    // Validate all steps before submission
    console.log("🔍 Running full form validation...");
    await fullValidationSchema.validate(values, { abortEarly: false });
    console.log("✅ Full validation passed");

    // Log file validation
    console.log("📸 Photo validation:");
    console.log(
      "- Farm Photo:",
      values.farmPhoto
        ? `${values.farmPhoto.name} (${values.farmPhoto.size} bytes)`
        : "Missing"
    );
    console.log(
      "- Farmer Photo:",
      values.farmerPhoto
        ? `${values.farmerPhoto.name} (${values.farmerPhoto.size} bytes)`
        : "Missing"
    );

    if (!values.farmPhoto || !values.farmerPhoto) {
      console.error("❌ Photos are missing!");
      alert("Please upload both farm and farmer photos before submitting");
      setSubmitting(false);
      return;
    }

    // Convert files to base64
    console.log("🔄 Converting files to base64...");
    const userPhoto = await fileToBase64(values.farmerPhoto);
    const farmPhoto = await fileToBase64(values.farmPhoto);
    console.log("✅ Files converted to base64");
    console.log("- User photo length:", userPhoto.length);
    console.log("- Farm photo length:", farmPhoto.length);

    // Prepare the registration data according to the API format
    // IMPORTANT: Convert numeric fields to strings here
    const registrationData: RegisterUserRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      farmAddress: values.farmLocation,
      country: values.country,
      state: values.state,
      farmName: values.farmName,
      farmSize: String(values.farmSize), // Convert to string
      farmSizeUnit: values.unit as "hectare" | "acre",
      cropIds: values.cropsGrown, // These are now crop IDs from the API
      estimatedAnnualProduction: String(values.estimatedAnnualProduction), // Convert to string
      farmingExperience: values.farmingExperience,
      internetAccess: values.internetAccess,
      howUserSellCrops: values.currentSellingMethod,
      userPhoto: userPhoto,
      farmPhoto: farmPhoto,
      bankName: values.bankName,
      accountNumber: values.accountNumber,
      role: "farmer",
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    console.log("📤 Prepared registration data:", {
      ...registrationData,
      userPhoto: `[Base64 string - ${userPhoto.length} chars]`,
      farmPhoto: `[Base64 string - ${farmPhoto.length} chars]`,
      password: "[HIDDEN]",
      confirmPassword: "[HIDDEN]",
      farmSize: `${registrationData.farmSize} (type: ${typeof registrationData.farmSize})`,
      estimatedAnnualProduction: `${registrationData.estimatedAnnualProduction} (type: ${typeof registrationData.estimatedAnnualProduction})`,
    });

    // Call the register function from the store
    console.log("📞 Calling register function...");
    await register(registrationData);
    console.log("✅ Register function completed");

    // Check if registration was successful
    if (registrationUserId) {
      setShowSuccessModal(true);
      console.log("🎉 Registration successful! User ID:", registrationUserId);
      router.push("/verify-otp");
    } else {
      console.log("⚠️ Registration completed but no user ID returned");
    }
  } catch (validationError: any) {
    if (validationError.name === "ValidationError") {
      console.error("❌ Validation failed:", validationError.errors);
      alert(
        "Please fill in all required fields:\n" +
          validationError.errors.join("\n")
      );
    } else {
      console.error("❌ Registration failed with error:", validationError);
      console.error("❌ Error stack:", validationError.stack);
    }
    setSubmitting(false);
  }
};

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    fieldName: string
  ) => {
    console.log(`📸 File upload triggered for field: ${fieldName}`);
    const file = event.currentTarget.files?.[0];

    if (file) {
      console.log(`📁 File selected:`, {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      if (file.size <= 10 * 1024 * 1024) {
        // 10MB limit
        setFieldValue(fieldName, file);
        console.log(`✅ File set for ${fieldName}`);
      } else {
        console.error(`❌ File too large for ${fieldName}:`, file.size);
        alert("File size must be less than 10MB");
      }
    } else {
      console.log(`❌ No file selected for ${fieldName}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white/90 rounded-lg shadow-lg">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-mainGreen mb-4 sm:mb-6">
          Farmer Registration
        </h1>

        {/* Show error message if any */}
        {(error || cropsError) && (
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
                  {error ? "Registration Error" : "Crops Loading Error"}
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error || cropsError}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-2 sm:gap-4 min-w-0"
            >
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0 ${
                  index <= currentStep
                    ? "bg-mainGreen/50 text-mainGreen"
                    : "bg-gray-200 text-mainGreen"
                }`}
              >
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Current step indicator for mobile */}
        <div className="block sm:hidden text-center mb-4">
          <span className="text-sm font-medium text-mainGreen">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </span>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={
          currentStep === steps.length - 1
            ? fullValidationSchema
            : stepValidationSchemas[currentStep]
        }
        onSubmit={handleSubmit}
        enableReinitialize
        validate={(values) => {
          console.log(
            "🔄 Form validation triggered for current step:",
            currentStep + 1
          );
          console.log("📋 Values being validated:", values);
        }}
      >
        {({
          values,
          setFieldValue,
          validateForm,
          errors,
          touched,
          isSubmitting,
        }) => {
          // Log current form state
          console.log("🔄 Form render - Current step:", currentStep + 1);
          console.log("📋 Current values:", values);
          console.log("❌ Current errors:", errors);
          console.log("👆 Touched fields:", touched);
          console.log("⏳ Is submitting:", isSubmitting);

          return (
            <Form className="space-y-4 sm:space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4 sm:mb-2">
                    <UserIcon />
                    <h2 className="text-base sm:text-lg font-medium">
                      Basic Information
                    </h2>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
                    Let&apos;s start with your basic details. This helps us
                    create your farmer profile.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                      required
                    />

                    <TextField
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      name="email"
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email address"
                      required
                    />

                    <TextField
                      name="phoneNumber"
                      label="Phone Number"
                      type="tel"
                      placeholder="Enter your phone number"
                      prefix="+234"
                      required
                    />
                  </div>

                  <TextField
                    name="farmLocation"
                    label="Farm Location"
                    as="textarea"
                    rows={3}
                    placeholder="Enter your farm location"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectField
                      name="country"
                      label="Country"
                      placeholder="Select country"
                      options={countryOptions}
                      required
                    />

                    <SelectField
                      name="state"
                      label="State"
                      placeholder="Select state"
                      options={stateOptions}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Farm Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4 sm:mb-2">
                    <Leaf color="black" />
                    <h2 className="text-base sm:text-lg font-medium">
                      Farm Details
                    </h2>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
                    Tell us about your farm and what crops you grow.
                  </p>

                  <TextField
                    name="farmName"
                    label="Farm Name"
                    placeholder="Enter your farm name"
                    required
                  />


{/* Updated crops selection with checkboxes */}
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Crops you grow (Select all that apply) <span className="text-red-500">*</span>
  </label>
  
  {cropsLoading && (
    <div className="flex items-center gap-2 text-sm text-gray-500">
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
      Loading available crops...
    </div>
  )}
  
  {!cropsLoading && cropsOptions.length === 0 && (
    <p className="text-sm text-gray-500">
      No crops available. Please try refreshing the page.
    </p>
  )}
  
  {!cropsLoading && cropsOptions.length > 0 && (
    <>
      {/* Checkbox Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-md bg-gray-50">
        {cropsOptions.map((crop) => (
          <label
            key={crop.value}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
          >
            <Field name="cropsGrown">
              {({ field }: { field: any }) => (
                <input
                  type="checkbox"
                  value={crop.value}
                  checked={field.value.includes(crop.value)}
                  onChange={(e) => {
                    const currentValues = field.value || [];
                    if (e.target.checked) {
                      // Add the crop if checked
                      setFieldValue('cropsGrown', [...currentValues, crop.value]);
                    } else {
                      // Remove the crop if unchecked
                      setFieldValue('cropsGrown', currentValues.filter((val: string) => val !== crop.value));
                    }
                  }}
                  className="h-4 w-4 text-mainGreen focus:ring-mainGreen border-gray-300 rounded"
                />
              )}
            </Field>
            <span className="text-sm text-gray-700">{crop.label}</span>
          </label>
        ))}
      </div>
      
      {/* Selected Crops Display */}
      {values.cropsGrown && values.cropsGrown.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Selected crops:</p>
          <div className="flex flex-wrap gap-2">
            {values.cropsGrown.map((cropId: string) => {
              const crop = cropsOptions.find(c => c.value === cropId);
              return crop ? (
                <span
                  key={cropId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-mainGreen/10 text-mainGreen border border-mainGreen/20"
                >
                  {crop.label}
                  <button
                    type="button"
                    onClick={() => {
                      const currentValues = values.cropsGrown || [];
                      setFieldValue('cropsGrown', currentValues.filter((val: string) => val !== cropId));
                    }}
                    className="ml-2 text-mainGreen hover:text-mainGreen/70 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </>
  )}
  
  <ErrorMessage name="cropsGrown" component="div" className="text-red-500 text-sm mt-1" />
</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      name="farmSize"
                      label="Farm Size"
                      placeholder="Enter farm size"
                      type="number"
                      required
                    />

                    <SelectField
                      name="unit"
                      label="Unit"
                      placeholder="Select Unit"
                      options={unitOptionsLand}
                      required
                    />
                  </div>

                  <div>
                    <TextField
                      name="estimatedAnnualProduction"
                      label="Estimated Annual Production"
                      placeholder="e.g 10"
                      type="number"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This helps processors understand your supply capacity (in
                      tons)
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Experience Assessment */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4 sm:mb-2">
                    <Leaf color="black" />
                    <h2 className="text-base sm:text-lg font-medium">
                      Experience Assessment
                    </h2>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
                    Help us customize your experience based on your background.
                  </p>

                  <SelectField
                    name="farmingExperience"
                    label="Farming Experience"
                    placeholder="Select your experience level"
                    options={farmingExperienceOptions}
                    required
                  />

                  <SelectField
                    name="internetAccess"
                    label="Internet Access"
                    placeholder="How do you access the internet?"
                    options={internetAccessOptions}
                    required
                  />

                  <SelectField
                    name="currentSellingMethod"
                    label="How do you currently sell your crops?"
                    placeholder="Select current method"
                    options={currentSellingMethodOptions}
                    required
                  />
                </div>
              )}

              {/* Step 4: Picture Verification */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4 sm:mb-2">
                    <span className="text-gray-600">📷</span>
                    <h2 className="text-base sm:text-lg font-medium">
                      Picture Verification
                    </h2>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
                    Upload photos to verify your farm and build trust with
                    buyers.
                  </p>

                  <FileField
                    name="farmPhoto"
                    label="Farm Photo"
                    description="Take a clear photo of your farm or crops to show buyers your growing operation"
                    onFileChange={handleFileUpload}
                    currentFile={values.farmPhoto}
                    required
                  />

                  <FileField
                    name="farmerPhoto"
                    label="Farmer Photo"
                    description="A clear photo of yourself for profile verification and trust building"
                    icon={<span className="text-gray-400">👤</span>}
                    onFileChange={handleFileUpload}
                    currentFile={values.farmerPhoto}
                    required
                  />
                </div>
              )}

              {/* Step 5: Payment Setup & Password */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4 sm:mb-2">
                    <span className="text-gray-600">💳</span>
                    <h2 className="text-base sm:text-lg font-medium">
                      Payment Setup & Security
                    </h2>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
                    Set up how you&apos;d like to receive payments and secure
                    your account.
                  </p>

                  <SelectField
                    name="bankName"
                    label="Bank Name"
                    placeholder="Select preferred bank"
                    options={bankOptions}
                    required
                  />

                  <TextField
                    name="accountNumber"
                    label="Account Number"
                    placeholder="Enter your account number"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="Enter your password"
                      required
                    />

                    <TextField
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 gap-3 sm:gap-0">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={isLoading}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-center gap-2 border bg-white border-gray-300 rounded-md text-mainGreen hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 text-sm sm:text-base transition-colors order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                )}

                <div
                  className={`${
                    currentStep === 0 ? "w-full" : ""
                  } sm:ml-auto order-1 sm:order-2`}
                >
                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => handleNext(validateForm, values)}
                      disabled={
                        isLoading || (currentStep === 1 && cropsLoading)
                      }
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-center gap-2 bg-mainGreen text-white rounded-md hover:bg-mainGreen/90 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentStep === 1 && cropsLoading ? (
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
                          Loading...
                        </span>
                      ) : (
                        <>
                          Proceed <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-mainGreen text-white rounded-md hover:bg-mainGreen/90 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-colors"
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
                          Completing...
                        </span>
                      ) : (
                        "Complete Registration"
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Footer Links */}
              <div className="text-center pt-4 sm:pt-6 border-t border-gray-200">
                {currentStep === 0 && (
                  <p className="text-xs sm:text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href="login-farmer"
                      className="text-mainGreen hover:text-mainGreen/80 font-medium transition-colors"
                    >
                      Login
                    </Link>
                  </p>
                )}
                <div className="mt-2">
                  <Link
                    href="/"
                    className="underline font-semibold text-mainGreen hover:text-mainGreen/80 text-xs sm:text-sm transition-colors inline-block hover:scale-105"
                  >
                    Back to Homepage
                  </Link>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
      {(isLoading || cropsLoading) && <AnimatedLoading />}
       <Modal
              isOpen={showSuccessModal}
              onClose={handleCloseModal}
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
                  <Image src={mail} alt="Email Icon" width={100} />
                </div>
              </div>
      
              {/* Title */}
              <h2 className="text-2xl font-semibold text-mainGreen mb-8">
                Registration Complete!
              </h2>
      
              {/* Message */}
              <div className="space-y-4 mb-10">
                <p className="text-black leading-relaxed">
                 Your Farmer registration has been received and is currently being evaluated. A mail with your login credentials will be sent to you provided email address after a successful evaluation.
                </p>
              </div>
      
              {/* Back to Login Button */}
              <button
                onClick={handleCloseModal}
                className="w-full py-3 px-6 border border-mainGreen text-mainGreen rounded-md hover:bg-mainGreen hover:text-white transition-colors font-medium"
              >
               Close
              </button>
            </Modal>
    </div>
  );
};

export default FarmerRegistrationForm;
