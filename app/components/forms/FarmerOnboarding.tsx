/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Leaf from '@/app/assets/icons/Leaf';
import Link from 'next/link';
import { 
  TextField, 
  SelectField, 
  FileField,
  countryOptions,
  stateOptions,
  unitOptions,
  cropsOptions,
  farmingExperienceOptions,
  internetAccessOptions,
  currentSellingMethodOptions,
  bankOptions
} from './FormFields'; // Import your reusable components
import { ChevronLeft, ChevronRight } from 'lucide-react';
import UserIcon from '@/app/assets/icons/UserIcon';

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
}

const initialValues: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  farmLocation: '',
  country: '',
  state: '',
  farmName: '',
  cropsGrown: [],
  farmSize: '',
  unit: '',
  estimatedAnnualProduction: '',
  farmingExperience: '',
  internetAccess: '',
  currentSellingMethod: '',
  farmPhoto: null,
  farmerPhoto: null,
  bankName: '',
  accountNumber: '',
};

// Validation schemas for each step
const stepValidationSchemas = [
  // Step 1: Basic Information
  Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    farmLocation: Yup.string().required('Farm location is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
  }),
  
  // Step 2: Farm Details
  Yup.object({
    farmName: Yup.string().required('Farm name is required'),
    cropsGrown: Yup.array().min(1, 'Please select at least one crop'),
    farmSize: Yup.string().required('Farm size is required'),
    unit: Yup.string().required('Unit is required'),
    estimatedAnnualProduction: Yup.string().required('Estimated annual production is required'),
  }),
  
  // Step 3: Experience Assessment
  Yup.object({
    farmingExperience: Yup.string().required('Please select your farming experience'),
    internetAccess: Yup.string().required('Please select your internet access method'),
    currentSellingMethod: Yup.string().required('Please select your current selling method'),
  }),
  
  // Step 4: Picture Verification
  Yup.object({
    farmPhoto: Yup.mixed().required('Farm photo is required'),
    farmerPhoto: Yup.mixed().required('Farmer photo is required'),
  }),
  
  // Step 5: Payment Setup
  Yup.object({
    bankName: Yup.string().required('Bank name is required'),
    accountNumber: Yup.string().required('Account number is required'),
  }),
];

const FarmerRegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    'Basic Information',
    'Farm Details', 
    'Experience Assessment',
    'Picture Verification',
    'Payment Setup'
  ];


  const handleNext = async (validateForm: () => Promise<any>, values: FormValues) => {
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
      case 0: return ['firstName', 'lastName', 'email', 'phoneNumber', 'farmLocation', 'country', 'state'];
      case 1: return ['farmName', 'cropsGrown', 'farmSize', 'unit', 'estimatedAnnualProduction'];
      case 2: return ['farmingExperience', 'internetAccess', 'currentSellingMethod'];
      case 3: return ['farmPhoto', 'farmerPhoto'];
      case 4: return ['bankName', 'accountNumber'];
      default: return [];
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Form submitted:', values);
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
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white/90 rounded-lg shadow-lg">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-mainGreen mb-4 sm:mb-6">Farmer Registration</h1>
        
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
                <div className="flex items-center space-x-2 mb-4 sm:mb-2">
                     <UserIcon/>
                  <h2 className="text-base sm:text-lg font-medium">Basic Information</h2>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">Let&apos;s start with your basic details. This helps us create your farmer profile.</p>
                
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
                  <Leaf color='black'/>
                  <h2 className="text-base sm:text-lg font-medium">Farm Details</h2>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">Tell us about your farm and what crops you grow.</p>
                
                <TextField
                  name="farmName"
                  label="Farm Name"
                  placeholder="Enter your farm name"
                  required
                />

                <SelectField
                  name="cropsGrown"
                  label="Crops you grow (Select all that apply)"
                  options={cropsOptions}
                  multiple={true}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    name="farmSize"
                    label="Farm Size"
                    placeholder="Enter farm size"
                    required
                  />
                  
                  <SelectField
                    name="unit"
                    label="Unit"
                    placeholder="Select Unit"
                    options={unitOptions}
                    required
                  />
                </div>

                <div>
                  <TextField
                    name="estimatedAnnualProduction"
                    label="Estimated Annual Production"
                    placeholder="e.g 10 Tons per year"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">This helps processors understand your supply capacity</p>
                </div>
              </div>
            )}

            {/* Step 3: Experience Assessment */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4 sm:mb-2">
                  <Leaf color='black'/>
                  <h2 className="text-base sm:text-lg font-medium">Experience Assessment</h2>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">Help us customize your experience based on your background.</p>
                
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
                  <h2 className="text-base sm:text-lg font-medium">Picture Verification</h2>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">Upload photos to verify your farm and build trust with buyers.</p>
                
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

            {/* Step 5: Payment Setup */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4 sm:mb-2">
                  <span className="text-gray-600">💳</span>
                  <h2 className="text-base sm:text-lg font-medium">Payment Setup</h2>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">Set up how you&apos;d like to receive payments for your crops.</p>
                
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
                  <Link href="login-farmer" className="text-mainGreen hover:text-mainGreen/80 font-medium transition-colors">
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

export default FarmerRegistrationForm;