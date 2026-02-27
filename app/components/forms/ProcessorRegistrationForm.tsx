/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  countryStatesMap,
  cropsOptions,
  bankOptions,
  businessTypes,
} from "./FormFields";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import Tractor from "@/app/assets/icons/Tractor";
import UserIcon from "@/app/assets/icons/UserIcon";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useDataStore } from "@/app/store/useDataStore";
import { RegisterUserRequest } from "@/app/types";
import AnimatedLoading from "@/app/Loading";
import Modal from "../Modal";
import Image from "next/image";

// Updated TypeScript interface to match the unified interface
interface ProcessorFormValues {
  // Step 1: Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyLocation: string;
  country: string;
  state: string;
  businessRegistrationNumber: string;
  yearEstablished: string;

  // Step 2: Company Details
  companyName: string;
  businessType: string;
  processingCapacity: string;
  capacityUnit: string;
  operatingDaysPerWeek: string;
  storageCapacity: string;

  // Step 3: Facility Information
  cropsProcessed: string[];
  minimumOrderQuantity: string;
  qualityStandards: string[];
  operationsType: string;
  certifications: string[];

  // Step 4: Business Verification
  businessLicense: File | null;
  taxIdCertDoc: File | null;

  password: string;
  confirmPassword: string;
}

const initialValues: ProcessorFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  companyLocation: "",
  country: "",
  state: "",
  businessRegistrationNumber: "",
  yearEstablished: "",
  companyName: "",
  businessType: "",
  processingCapacity: "",
  capacityUnit: "",
  operatingDaysPerWeek: "",
  storageCapacity: "",
  cropsProcessed: [],
  minimumOrderQuantity: "",
  qualityStandards: [],
  operationsType: "",
  certifications: [],
  businessLicense: null,
  taxIdCertDoc: null,
  password: "",
  confirmPassword: "",
};

// Additional option arrays specific to processor form
const capacityUnitOptions = [
  { value: "tons", label: "Tons per day" },
  { value: "tons", label: "Tons per week" },
  { value: "tons", label: "Tons per month" },
  { value: "tons", label: "Tons per year" },
];

const operatingDays = [
  { value: "7days", label: "7 days per week" },
  { value: "6days", label: "6 days per week" },
  { value: "5days", label: "5 days per week" },
  { value: "seasonal", label: "Seasonal Operations" },
];

const operationsTypeOptions = [
  { value: "year_round", label: "Year-round operations" },
  { value: "seasonal", label: "Seasonal operations" },
  { value: "contract_based", label: "Contract-based operations" },
];

// Validation schemas for each step
const stepValidationSchemas = [
  // Step 1: Basic Information
  Yup.object({
    firstName: Yup.string().required("Contact person name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    companyLocation: Yup.string().required("Company location is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    businessRegistrationNumber: Yup.string().required("Business registration number is required"),
    yearEstablished: Yup.string().required("Year established is required"),
  }),

  // Step 2: Company Details
  Yup.object({
    companyName: Yup.string().required("Company name is required"),
    businessType: Yup.string().optional(),
    processingCapacity: Yup.string().required("Processing capacity is required"),
    capacityUnit: Yup.string().required("Capacity unit is required"),
    operatingDaysPerWeek: Yup.string().required("Operating days is required"),
    storageCapacity: Yup.string().required("Storage capacity is required"),
  }),

  // Step 3: Facility Information
  Yup.object({
    cropsProcessed: Yup.array().min(1, "Please select at least one crop type"),
    minimumOrderQuantity: Yup.string().required("Minimum order quantity is required"),
    qualityStandards: Yup.array().min(1, "Please select at least one quality standard"),
    operationsType: Yup.string().required("Operations type is required"),
    certifications: Yup.array().min(1, "Please select at least one certification"),
  }),

  // Step 4: Business Verification
  Yup.object({
    businessLicense: Yup.mixed().required("Business license is required"),
    taxIdCertDoc: Yup.mixed().required("Tax ID certificate is required"),
  }),

  // Step 5: Payment & Contract Setup
  Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 7 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  }),
];

const ProcessorRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  // Use the auth store
  const { register, isLoading, error, registrationUserId, clearError } = useAuthStore();

  // Use the data store for all data
  const { 
    crops, 
    qualityStandards, 
    certifications,
    isLoading: dataLoading, 
    cropsLoading,
    qualityStandardsLoading,
    certificationsLoading,
    error: dataError,
    cropsError,
    qualityStandardsError,
    certificationsError,
    fetchAllData
  } = useDataStore();

  const steps = [
    "Basic Information",
    "Company Details",
    "Facility Information",
    "Business Verification",
    "Payment & Contract Setup",
  ];

  // Clear any previous errors when component mounts and fetch all data
  useEffect(() => {
    console.log("🔄 Component mounted, clearing errors and fetching all data");
    clearError();
    fetchAllData();
  }, [clearError, fetchAllData]);

  // Debug registrationUserId changes
  useEffect(() => {
    console.log("📝 Registration User ID changed:", registrationUserId);
    if (registrationUserId) {
      console.log("✅ Registration successful, showing success modal");
      setShowSuccessModal(true);
    }
  }, [registrationUserId]);

  // Convert data to options format for SelectFields
  const cropsOptions = crops.map((crop) => ({
    value: crop.id,
    label: crop.name,
  }));

  const qualityStandardsOptions = qualityStandards.map((standard) => ({
    value: standard.id,
    label: standard.name,
  }));

  const certificationsOptions = certifications.map((cert) => ({
    value: cert.id,
    label: cert.name,
  }));

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    router.push("/verify-otp");
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix and return just the base64 string
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleNext = async (
    validateForm: () => Promise<any>,
    values: ProcessorFormValues
  ) => {
    console.log(`🔍 Validating step ${currentStep + 1}...`);
    const errors = await validateForm();
    const currentStepErrors = Object.keys(errors).filter((key) => {
      const stepFields = getStepFields(currentStep);
      return stepFields.includes(key);
    });

    if (currentStepErrors.length === 0) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getStepFields = (step: number): string[] => {
    const fieldMap = {
      0: [
        "firstName",
        "lastName", 
        "email",
        "phoneNumber",
        "companyLocation",
        "country",
        "state",
        "businessRegistrationNumber",
        "yearEstablished",
      ],
      1: [
        "companyName",
        "businessType",
        "processingCapacity",
        "capacityUnit", 
        "operatingDaysPerWeek",
        "storageCapacity",
      ],
      2: [
        "cropsProcessed",
        "minimumOrderQuantity",
        "qualityStandards",
        "operationsType",
        "certifications",
      ],
      3: ["businessLicense", "taxIdCertDoc"],
      4: ["password", "confirmPassword"],
    };

    return fieldMap[step as keyof typeof fieldMap] || [];
  };

  const handleSubmit = async (values: ProcessorFormValues) => {
    console.log("🚀 Processor form submission started");
    
    try {
      clearError();

      // Validate required files
      if (!values.businessLicense || !values.taxIdCertDoc) {
        alert("Please upload all required documents and photos before submitting");
        return;
      }

      // Validate file sizes before conversion
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (values.businessLicense.size > maxSize) {
        alert(`Business License file is too large (${(values.businessLicense.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 10MB. Please compress the file and try again.`);
        return;
      }
      if (values.taxIdCertDoc.size > maxSize) {
        alert(`Tax ID Certificate file is too large (${(values.taxIdCertDoc.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 10MB. Please compress the file and try again.`);
        return;
      }

      // Convert files to base64
      console.log("🔄 Converting files to base64...");
      
      const businessRegCertDoc = await fileToBase64(values.businessLicense);
      const taxIdCertDoc = await fileToBase64(values.taxIdCertDoc);
      
      // Verify base64 strings (JPEG files start with /9j/ in base64)
      console.log("✅ Base64 strings generated:");
      console.log("- Business Reg Cert (first 10 chars):", businessRegCertDoc.substring(0, 10));
      console.log("- Tax ID Cert (first 10 chars):", taxIdCertDoc.substring(0, 10));

      // Prepare the registration data according to the unified API format
      const registrationData: RegisterUserRequest = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        farmAddress: values.companyLocation, // Using farmAddress field for company location
        country: values.country,
        state: values.state,
        role: "processor",
        password: values.password,
        confirmPassword: values.confirmPassword,
        cropIds: values.cropsProcessed,
        
        // Processor-specific fields
        companyName: values.companyName,
        businessRegNumber: values.businessRegistrationNumber,
        yearEstablished: values.yearEstablished,
        ...(values.businessType && { businessType: values.businessType }),
        processsingCapacitySize: values.processingCapacity, // Note: keeping original field name
        processsingCapacityUnit: values.capacityUnit,
        operatingDaysPerWeek: values.operatingDaysPerWeek,
        storageCapacity: values.storageCapacity,
        minimumOrderQuality: values.minimumOrderQuantity,
        operationsType: values.operationsType,
        qualityStandardIds: values.qualityStandards,
        certificationIds: values.certifications,
        
        // Documents and photos
        businessRegCertDoc,
        taxIdCertDoc,
      };

      console.log("📤 Prepared processor registration data");

      // Call the register function from the store
      await register(registrationData);
      console.log("✅ Register function completed");

    } catch (error: any) {
      console.error("❌ Processor registration failed:", error);
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    fieldName: string
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
      setFieldValue(fieldName, file);
    } else {
      alert("File size must be less than 10MB");
    }
  };

  // Check if there are any loading states or errors for the current step
  const isCurrentStepLoading = () => {
    if (currentStep === 2) {
      return cropsLoading || qualityStandardsLoading || certificationsLoading;
    }
    return false;
  };

  const getCurrentStepError = () => {
    if (currentStep === 2) {
      return cropsError || qualityStandardsError || certificationsError;
    }
    return null;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white/90 rounded-lg shadow-lg">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-mainGreen mb-4 sm:mb-6">
          Processor Registration
        </h1>

        {/* Show error message if any */}
        {(error || dataError || getCurrentStepError()) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error ? "Registration Error" : "Data Loading Error"}
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error || dataError || getCurrentStepError()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center justify-center gap-2 sm:gap-4 min-w-0">
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
        validationSchema={stepValidationSchemas[currentStep]}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, validateForm, errors, touched }) => (
          <Form className="space-y-4 sm:space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 0 && (
              <>
                <div className="flex items-center space-x-2 mb-2 sm:mb-2">
                  <UserIcon />
                  <h2 className="text-base sm:text-lg font-medium">
                    Basic Information
                  </h2>
                </div>
                <p className="text-black text-xs sm:text-sm mb-4 sm:mb-6">
                  Let&apos;s start with your basic details. This helps us create
                  your processor profile.
                </p>
                <div className="space-y-4">
                  <TextField
                    name="companyName"
                    label="Company/Business Name *"
                    placeholder="Enter your company/business name"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      name="firstName"
                      label="Contact Person First Name *"
                      placeholder="Enter contact person first name"
                      required
                    />

                    <TextField
                      name="lastName"
                      label="Contact Person Last Name *"
                      placeholder="Enter contact person last name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      name="email"
                      label="Company Email Address *"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      name="businessRegistrationNumber"
                      label="Business Registration Number *"
                      placeholder="Enter your Registration Number"
                      required
                    />

                    <TextField
                      name="yearEstablished"
                      label="Year Established"
         
                      placeholder="Enter your Year Established"
                      required
                    />
                  </div>

                  <TextField
                    name="companyLocation"
                    label="Company Location"
                    as="textarea"
                    rows={3}
                    placeholder="Enter your company location"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Field
                          name="country"
                          as="select"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent appearance-none pr-10"
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            setFieldValue("country", e.target.value);
                            setFieldValue("state", ""); // Reset state when country changes
                          }}
                        >
                          <option value="" className="text-[#A8A8A8]">
                            Select country
                          </option>
                          {countryOptions.map((option) => (
                            <option key={option.value} value={option.value} className="py-1">
                              {option.label}
                            </option>
                          ))}
                        </Field>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <ErrorMessage name="country" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <SelectField
                      name="state"
                      label="State"
                      placeholder={values.country ? "Select state" : "Select country first"}
                      options={values.country && countryStatesMap[values.country] ? countryStatesMap[values.country] : []}
                      required
                      disabled={!values.country}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Company Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4 sm:mb-1">
                  <Tractor color="black" />
                  <h2 className="text-base sm:text-lg font-medium">
                    Business Details and Capacity
                  </h2>
                </div>
                <p className="text-black text-xs sm:text-sm mb-4 sm:mb-6">
                  Provide details about your processing operations and capacity.
                </p>

                <SelectField
                  name="businessType"
                  label="Type of Business"
                  placeholder="Select business type"
                  options={businessTypes}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    name="processingCapacity"
                    label="Processing Capacity"
                    placeholder="Enter processing capacity"
                    required
                  />

                  <SelectField
                    name="capacityUnit"
                    label="Capacity Unit"
                    placeholder="Select Unit"
                    options={capacityUnitOptions}
                    required
                  />
                </div>

                <SelectField
                  name="operatingDaysPerWeek"
                  label="Operating Days per week"
                  placeholder="Operating Days"
                  options={operatingDays}
                  required
                />

                <TextField
                  name="storageCapacity"
                  label="Storage Capacity (optional)"
                  placeholder="Enter your storage capacity"
                />
              </div>
            )}

            {/* Step 3: Facility Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4 sm:mb-1">
                  <Tractor color="black" />
                  <h2 className="text-base sm:text-lg font-medium">
                    Sourcing Requirements
                  </h2>
                </div>
                <p className="text-black text-xs sm:text-sm mb-4 sm:mb-6">
                  Define what crops you need and your quality requirements.
                </p>

                {/* Crops Processing - Multiple Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Crops you process (Select all that apply) <span className="text-red-500">*</span>
                  </label>
                  
                  {cropsLoading && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading available crops...
                    </div>
                  )}
                  
                  {!cropsLoading && cropsOptions.length > 0 && (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-md bg-gray-50">
                        {cropsOptions.map((crop) => (
                          <label key={crop.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
                            <input
                              type="checkbox"
                              value={crop.value}
                              checked={values.cropsProcessed.includes(crop.value)}
                              onChange={(e) => {
                                const currentValues = values.cropsProcessed || [];
                                if (e.target.checked) {
                                  setFieldValue('cropsProcessed', [...currentValues, crop.value]);
                                } else {
                                  setFieldValue('cropsProcessed', currentValues.filter((val: string) => val !== crop.value));
                                }
                              }}
                              className="h-4 w-4 text-mainGreen focus:ring-mainGreen border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{crop.label}</span>
                          </label>
                        ))}
                      </div>
                      
                      {/* Selected Crops Display */}
                      {values.cropsProcessed && values.cropsProcessed.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Selected crops:</p>
                          <div className="flex flex-wrap gap-2">
                            {values.cropsProcessed.map((cropId: string) => {
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
                                      const currentValues = values.cropsProcessed || [];
                                      setFieldValue('cropsProcessed', currentValues.filter((val: string) => val !== cropId));
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
                </div>

                <TextField
                  name="minimumOrderQuantity"
                  label="Minimum Order Quantity (MOQ) *"
                  placeholder="e.g., 5 tons"
                  required
                />

                {/* Quality Standards - Multiple Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Quality Standards (Select all that apply) <span className="text-red-500">*</span>
                  </label>
                  
                  {qualityStandardsLoading && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading quality standards...
                    </div>
                  )}
                  
                  {!qualityStandardsLoading && qualityStandardsOptions.length > 0 && (
                    <>
                      <div className="grid grid-cols-1 gap-2 p-4 border border-gray-300 rounded-md bg-gray-50">
                        {qualityStandardsOptions.map((standard) => (
                          <label key={standard.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
                            <input
                              type="checkbox"
                              value={standard.value}
                              checked={values.qualityStandards.includes(standard.value)}
                              onChange={(e) => {
                                const currentValues = values.qualityStandards || [];
                                if (e.target.checked) {
                                  setFieldValue('qualityStandards', [...currentValues, standard.value]);
                                } else {
                                  setFieldValue('qualityStandards', currentValues.filter((val: string) => val !== standard.value));
                                }
                              }}
                              className="h-4 w-4 text-mainGreen focus:ring-mainGreen border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{standard.label}</span>
                          </label>
                        ))}
                      </div>
                      
                      {/* Selected Quality Standards Display */}
                      {values.qualityStandards && values.qualityStandards.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Selected quality standards:</p>
                          <div className="flex flex-wrap gap-2">
                            {values.qualityStandards.map((standardId: string) => {
                              const standard = qualityStandardsOptions.find(s => s.value === standardId);
                              return standard ? (
                                <span
                                  key={standardId}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 border border-blue-200"
                                >
                                  {standard.label}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentValues = values.qualityStandards || [];
                                      setFieldValue('qualityStandards', currentValues.filter((val: string) => val !== standardId));
                                    }}
                                    className="ml-2 text-blue-700 hover:text-blue-500 transition-colors"
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
                </div>

                <SelectField
                  name="operationsType"
                  label="Operations Type"
                  placeholder="Select operations type"
                  options={operationsTypeOptions}
                  required
                />

                {/* Certifications - Multiple Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Current Certifications (Select all that apply) <span className="text-red-500">*</span>
                  </label>
                  
                  {certificationsLoading && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading certifications...
                    </div>
                  )}
                  
                  {!certificationsLoading && certificationsOptions.length > 0 && (
                    <>
                      <div className="grid grid-cols-1 gap-2 p-4 border border-gray-300 rounded-md bg-gray-50">
                        {certificationsOptions.map((cert) => (
                          <label key={cert.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
                            <input
                              type="checkbox"
                              value={cert.value}
                              checked={values.certifications.includes(cert.value)}
                              onChange={(e) => {
                                const currentValues = values.certifications || [];
                                if (e.target.checked) {
                                  setFieldValue('certifications', [...currentValues, cert.value]);
                                } else {
                                  setFieldValue('certifications', currentValues.filter((val: string) => val !== cert.value));
                                }
                              }}
                              className="h-4 w-4 text-mainGreen focus:ring-mainGreen border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{cert.label}</span>
                          </label>
                        ))}
                      </div>
                      
                      {/* Selected Certifications Display */}
                      {values.certifications && values.certifications.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Selected certifications:</p>
                          <div className="flex flex-wrap gap-2">
                            {values.certifications.map((certId: string) => {
                              const cert = certificationsOptions.find(c => c.value === certId);
                              return cert ? (
                                <span
                                  key={certId}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700 border border-purple-200"
                                >
                                  {cert.label}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const currentValues = values.certifications || [];
                                      setFieldValue('certifications', currentValues.filter((val: string) => val !== certId));
                                    }}
                                    className="ml-2 text-purple-700 hover:text-purple-500 transition-colors"
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
                </div>
              </div>
            )}

            {/* Step 4: Business Verification */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4 sm:mb-1">
                  <Tractor color="black" />
                  <h2 className="text-base sm:text-lg font-medium">
                    Business Verification
                  </h2>
                </div>
                <p className="text-black text-xs sm:text-sm mb-4 sm:mb-6">
                  Upload documents to verify your business and build trust with farmers.
                </p>

                <FileField
                  name="businessLicense"
                  label="Business License/Registration Certificate"
                  description="Upload your business registration certificate or license to verify your company"
                  icon={<span className="text-gray-400">📄</span>}
                  accept="image/*,.pdf"
                  maxSize="Max 10 MB files are allowed (PDF, JPG, PNG)"
                  onFileChange={handleFileUpload}
                  currentFile={values.businessLicense}
                  required
                />

                <FileField
                  name="taxIdCertDoc"
                  label="Tax ID Certificate"
                  description="Upload your tax identification certificate"
                  icon={<span className="text-gray-400">📋</span>}
                  accept="image/*,.pdf"
                  onFileChange={handleFileUpload}
                  currentFile={values.taxIdCertDoc}
                  required
                />
              </div>
            )}

            {/* Step 5: Payment & Contract Setup */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4 sm:mb-2">
                  <span className="text-gray-600">💳</span>
                  <h2 className="text-base sm:text-lg font-medium">
                    Password Setup & Security
                  </h2>
                </div>
                
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
                  className="px-4 sm:px-6 py-2 sm:py-2 flex items-center justify-center gap-2 border bg-white border-gray-300 rounded-md text-mainGreen hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 text-sm sm:text-base transition-colors order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
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
                    disabled={isLoading || isCurrentStepLoading()}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2 flex items-center justify-center gap-2 bg-mainGreen text-white rounded-md hover:bg-mainGreen/90 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCurrentStepLoading() ? (
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
                        <ChevronRight className="w-5 h-5" /> Proceed
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
                    href="login-processor"
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
        )}
      </Formik>

      {/* Loading Component */}
      {(isLoading || dataLoading) && <AnimatedLoading />}

      {/* Success Modal */}
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
        <div className="flex justify-center mb-6">
          <div className="relative">
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
            Your Processor registration has been received and is currently being evaluated. 
            A mail with your login credentials will be sent to your provided email address 
            after a successful evaluation.
          </p>
        </div>

        {/* Close Button */}
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

export default ProcessorRegistrationForm;