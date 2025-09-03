/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Leaf from '@/app/assets/icons/Leaf';
import Link from 'next/link';
import { 
  TextField, 
  SelectField, 
  FileField,
  countryOptions,
  stateOptions,
  cropsOptions,
  bankOptions
} from './FormFields'; // Import your reusable components
import { ChevronLeft, ChevronRight } from 'lucide-react';

// TypeScript interfaces
interface ProcessorFormValues {
  // Step 1: Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyLocation: string;
  country: string;
  state: string;
  
  // Step 2: Company Details
  companyName: string;
  businessRegistrationNumber: string;
  cropsProcessed: string[];
  processingCapacity: string;
  capacityUnit: string;
  
  // Step 3: Facility Information
  facilityType: string;
  certifications: string[];
  storageCapacity: string;
  qualityStandards: string;
  
  // Step 4: Business Verification
  businessLicense: File | null;
  facilityPhoto: File | null;
  
  // Step 5: Payment & Contract Setup
  bankName: string;
  accountNumber: string;
  preferredPaymentTerms: string;
}

const initialValues: ProcessorFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  companyLocation: '',
  country: '',
  state: '',
  companyName: '',
  businessRegistrationNumber: '',
  cropsProcessed: [],
  processingCapacity: '',
  capacityUnit: '',
  facilityType: '',
  certifications: [],
  storageCapacity: '',
  qualityStandards: '',
  businessLicense: null,
  facilityPhoto: null,
  bankName: '',
  accountNumber: '',
  preferredPaymentTerms: '',
};

// Additional option arrays specific to processor form
const capacityUnitOptions = [
  { value: "Tons per day", label: "Tons per day" },
  { value: "Tons per week", label: "Tons per week" },
  { value: "Tons per month", label: "Tons per month" },
  { value: "Kilograms per day", label: "Kilograms per day" }
];

const facilityTypeOptions = [
  { value: "Small-scale processing unit", label: "Small-scale processing unit" },
  { value: "Medium-scale processing plant", label: "Medium-scale processing plant" },
  { value: "Large-scale industrial facility", label: "Large-scale industrial facility" },
  { value: "Mobile processing unit", label: "Mobile processing unit" },
  { value: "Cooperative processing center", label: "Cooperative processing center" }
];

const certificationOptions = [
  { value: "NAFDAC Registration", label: "NAFDAC Registration" },
  { value: "ISO 22000", label: "ISO 22000 (Food Safety Management)" },
  { value: "HACCP", label: "HACCP (Hazard Analysis Critical Control Points)" },
  { value: "Organic Certification", label: "Organic Certification" },
  { value: "Fair Trade Certification", label: "Fair Trade Certification" },
  { value: "SON Standards", label: "SON (Standards Organization of Nigeria)" },
  { value: "Halal Certification", label: "Halal Certification" },
  { value: "None yet (planning to obtain)", label: "None yet (planning to obtain)" }
];

const qualityStandardsOptions = [
  { value: "Premium grade only", label: "Premium grade only" },
  { value: "Premium and standard grade", label: "Premium and standard grade" },
  { value: "All grades accepted", label: "All grades accepted" },
  { value: "Custom specifications", label: "Custom specifications" }
];

const paymentTermsOptions = [
  { value: "Immediate payment on delivery", label: "Immediate payment on delivery" },
  { value: "Payment within 7 days", label: "Payment within 7 days" },
  { value: "Payment within 14 days", label: "Payment within 14 days" },
  { value: "Payment within 30 days", label: "Payment within 30 days" },
  { value: "50% advance, 50% on delivery", label: "50% advance, 50% on delivery" },
  { value: "30% advance, 70% on delivery", label: "30% advance, 70% on delivery" }
];

// Validation schemas for each step
const stepValidationSchemas = [
  // Step 1: Basic Information
  Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    companyLocation: Yup.string().required('Company location is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
  }),
  
  // Step 2: Company Details
  Yup.object({
    companyName: Yup.string().required('Company name is required'),
    businessRegistrationNumber: Yup.string().required('Business registration number is required'),
    cropsProcessed: Yup.array().min(1, 'Please select at least one crop type'),
    processingCapacity: Yup.string().required('Processing capacity is required'),
    capacityUnit: Yup.string().required('Capacity unit is required'),
  }),
  
  // Step 3: Facility Information
  Yup.object({
    facilityType: Yup.string().required('Please select your facility type'),
    certifications: Yup.array().min(1, 'Please select at least one certification or standard'),
    storageCapacity: Yup.string().required('Storage capacity is required'),
    qualityStandards: Yup.string().required('Please select your quality standards'),
  }),
  
  // Step 4: Business Verification
  Yup.object({
    businessLicense: Yup.mixed().required('Business license is required'),
    facilityPhoto: Yup.mixed().required('Facility photo is required'),
  }),
  
  // Step 5: Payment & Contract Setup
  Yup.object({
    bankName: Yup.string().required('Bank name is required'),
    accountNumber: Yup.string().required('Account number is required'),
    preferredPaymentTerms: Yup.string().required('Please select preferred payment terms'),
  }),
];

const ProcessorRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    'Basic Information',
    'Company Details', 
    'Facility Information',
    'Business Verification',
    'Payment & Contract Setup'
  ];

  
  const handleNext = async (validateForm: () => Promise<any>, values: ProcessorFormValues) => {
    const errors = await validateForm();
    const currentStepErrors = Object.keys(errors).filter(key => {
      const stepFields = getStepFields(currentStep);
      return stepFields.includes(key);
    });

    if (currentStepErrors.length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const getStepFields = (step: number): string[] => {
    switch (step) {
      case 0: return ['firstName', 'lastName', 'email', 'phoneNumber', 'companyLocation', 'country', 'state'];
      case 1: return ['companyName', 'businessRegistrationNumber', 'cropsProcessed', 'processingCapacity', 'capacityUnit'];
      case 2: return ['facilityType', 'certifications', 'storageCapacity', 'qualityStandards'];
      case 3: return ['businessLicense', 'facilityPhoto'];
      case 4: return ['bankName', 'accountNumber', 'preferredPaymentTerms'];
      default: return [];
    }
  };

  const handleSubmit = async (values: ProcessorFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Processor form submitted:', values);
    alert('Registration completed successfully!');
    setIsSubmitting(false);
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
      alert('File size must be less than 10MB');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white/80 rounded-lg shadow-lg">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-mainGreen mb-4 sm:mb-6">Processor Registration</h1>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center justify-center gap-2 sm:gap-4 min-w-0">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0 ${
                  index <= currentStep
                    ? 'bg-mainGreen/50 text-mainGreen'
                    : 'bg-gray-200 text-mainGreen'
                }`}
              >
                {index + 1}
              </div>
              {/* Hide step names on mobile, show abbreviated versions on small screens */}
              <span className={`hidden sm:block text-xs sm:text-sm font-medium whitespace-nowrap ${
                index <= currentStep ? 'text-mainGreen' : 'text-gray-500'
              }`}>
                {step}
              </span>
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
          <div className="space-y-4 sm:space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                  <span className="text-gray-600">👤</span>
                  <h2 className="text-base sm:text-lg font-medium">Basic Information</h2>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">Let&apos;s start with your basic details. This helps us create your processor profile.</p>
                
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
                  name="companyLocation"
                  label="Company Location"
                  as="textarea"
                  rows={3}
                  placeholder="Enter your company location"
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

            {/* Step 2: Company Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                  <span className="text-gray-600">🏢</span>
                  <h2 className="text-base sm:text-lg font-medium">Company Details</h2>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">Tell us about your processing company and operations.</p>
                
                <TextField
                  name="companyName"
                  label="Company Name"
                  placeholder="Enter your company name"
                  required
                />

                <TextField
                  name="businessRegistrationNumber"
                  label="Business Registration Number"
                  placeholder="Enter your business registration number"
                  required
                />

                <SelectField
                  name="cropsProcessed"
                  label="Crops you process (Select all that apply)"
                  options={cropsOptions}
                  multiple={true}
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
              </div>
            )}

            {/* Step 3: Facility Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                  <span className="text-gray-600">🏭</span>
                  <h2 className="text-base sm:text-lg font-medium">Facility Information</h2>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">Provide details about your processing facility and capabilities.</p>
                
                <SelectField
                  name="facilityType"
                  label="Facility Type"
                  placeholder="Select facility type"
                  options={facilityTypeOptions}
                  required
                />

                <SelectField
                  name="certifications"
                  label="Certifications & Standards (Select all that apply)"
                  options={certificationOptions}
                  multiple={true}
                  required
                />

                <div>
                  <TextField
                    name="storageCapacity"
                    label="Storage Capacity"
                    placeholder="e.g., 500 tons"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">This helps farmers understand your capacity to handle their produce</p>
                </div>

                <SelectField
                  name="qualityStandards"
                  label="Quality Standards"
                  placeholder="Select quality requirements"
                  options={qualityStandardsOptions}
                  required
                />
              </div>
            )}

            {/* Step 4: Business Verification */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                  <span className="text-gray-600">📄</span>
                  <h2 className="text-base sm:text-lg font-medium">Business Verification</h2>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">Upload documents to verify your business and build trust with farmers.</p>
                
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
                  name="facilityPhoto"
                  label="Facility Photo"
                  description="A clear photo of your processing facility to show farmers your operations"
                  icon={<span className="text-gray-400">🏭</span>}
                  onFileChange={handleFileUpload}
                  currentFile={values.facilityPhoto}
                  required
                />
              </div>
            )}

            {/* Step 5: Payment & Contract Setup */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                  <span className="text-gray-600">💳</span>
                  <h2 className="text-base sm:text-lg font-medium">Payment & Contract Setup</h2>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">Set up your payment details and preferred contract terms.</p>
                
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

                <div>
                  <SelectField
                    name="preferredPaymentTerms"
                    label="Preferred Payment Terms"
                    placeholder="Select payment terms"
                    options={paymentTermsOptions}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">This helps farmers understand when they&apos;ll receive payment</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 gap-3 sm:gap-0">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-center gap-2 border bg-white border-gray-300 rounded-md text-mainGreen hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 text-sm sm:text-base transition-colors order-2 sm:order-1"
                >
                  <ChevronLeft className="w-4 h-4"/> Previous
                </button>
              )}
              
              <div className={`${currentStep === 0 ? 'w-full' : ''} sm:ml-auto order-1 sm:order-2`}>
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => handleNext(validateForm, values)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-center gap-2 bg-mainGreen text-white rounded-md hover:bg-mainGreen/90 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 text-sm sm:text-base transition-colors"
                  >
                    Proceed <ChevronRight className="w-4 h-4"/>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-mainGreen text-white rounded-md hover:bg-mainGreen/90 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-colors"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                          <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Completing...
                      </span>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Footer Links */}
            <div className="text-center pt-4 sm:pt-6 border-t border-gray-200">
              {currentStep === 0 && (
                <p className="text-xs sm:text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="login-processor" className="text-mainGreen hover:text-mainGreen/80 font-medium transition-colors">
                    Login
                  </Link>
                </p>
              )}
              <div className="mt-2">
                <Link href="/" className="underline font-semibold text-mainGreen hover:text-mainGreen/80 text-xs sm:text-sm transition-colors inline-block hover:scale-105">
                  Back to Homepage
                </Link>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default ProcessorRegistrationForm;