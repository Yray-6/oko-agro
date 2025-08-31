'use client'
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Leaf from '@/app/assets/icons/Leaf';
import Link from 'next/link';

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
    <div className="max-w-2xl mx-auto p-6 bg-white/80 rounded-lg shadow-lg">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-mainGreen mb-6">Farmer Registration</h1>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center justify-center gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-mainGreen/50 text-mainGreen'
                    : 'bg-gray-200 text-mainGreen'
                }`}
              >
                {index + 1}
              </div>
      
            </div>
          ))}
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={stepValidationSchemas[currentStep]}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, validateForm, errors, touched }) => (
          <div className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-gray-600">👤</span>
                  <h2 className="text-lg font-medium">Basic Information</h2>
                </div>
                <p className="text-gray-600 text-sm mb-6">Let's start with your basic details. This helps us create your farmer profile.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 mb-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <Field
                      name="firstName"
                      type="text"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                    <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <Field
                      name="lastName"
                      type="text"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                      placeholder="Enter your last name"
                    />
                    <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 mb-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm min-w-0 flex-shrink-0">
                        +234
                      </span>
                      <Field
                        name="phoneNumber"
                        type="tel"
                        className="w-full min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-r-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                <div className='mb-6'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Farm Location *</label>
                  <Field
                    as="textarea"
                    name="farmLocation"
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                    placeholder="Enter your farm location"
                  />
                  <ErrorMessage name="farmLocation" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <Field
                      as="select"
                      name="country"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                    >
                      <option value="" className="text-[#A8A8A8]">Select country</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Kenya">Kenya</option>
                    </Field>
                    <ErrorMessage name="country" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <Field
                      as="select"
                      name="state"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                    >
                      <option value="" className="text-[#A8A8A8]">Select state</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Ogun">Ogun</option>
                    </Field>
                    <ErrorMessage name="state" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Farm Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                <Leaf color='black'/>
                  <h2 className="text-lg font-medium">Farm Details</h2>
                </div>
                <p className="text-gray-600 text-sm mb-6">Tell us about your farm and what crops you grow.</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name *</label>
                  <Field
                    name="farmName"
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                    placeholder="Enter your farm name"
                  />
                  <ErrorMessage name="farmName" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crops you grow (Select all that apply) *</label>
                  <Field
                    as="select"
                    name="cropsGrown"
                    multiple
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                    size={4}
                  >
                    <option value="Rice">Rice</option>
                    <option value="Maize">Maize</option>
                    <option value="Cassava">Cassava</option>
                    <option value="Yam">Yam</option>
                    <option value="Plantain">Plantain</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Pepper">Pepper</option>
                    <option value="Onion">Onion</option>
                  </Field>
                  <ErrorMessage name="cropsGrown" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size *</label>
                    <Field
                      name="farmSize"
                      type="text"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                      placeholder="Enter farm size"
                    />
                    <ErrorMessage name="farmSize" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <Field
                      as="select"
                      name="unit"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                    >
                      <option value="" className="text-[#A8A8A8]">Select Unit</option>
                      <option value="Hectares">Hectares</option>
                      <option value="Acres">Acres</option>
                      <option value="Square meters">Square meters</option>
                    </Field>
                    <ErrorMessage name="unit" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Annual Production *</label>
                  <Field
                    name="estimatedAnnualProduction"
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                    placeholder="e.g 10 Tons per year"
                  />
                  <p className="text-xs text-gray-500 mt-1">This helps processors understand your supply capacity</p>
                  <ErrorMessage name="estimatedAnnualProduction" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
            )}

            {/* Step 3: Experience Assessment */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <Leaf color='black'/>
                  <h2 className="text-lg font-medium">Experience Assessment</h2>
                </div>
                <p className="text-gray-600 text-sm mb-6">Help us customize your experience based on your background.</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Farming Experience *</label>
                  <Field
                    as="select"
                    name="farmingExperience"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                  >
                    <option value="" className="text-[#A8A8A8]">Select your experience level</option>
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="2-10 years">2-10 years</option>
                    <option value="More than 10 years">More than 10 years</option>
                  </Field>
                  <ErrorMessage name="farmingExperience" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internet Access *</label>
                  <Field
                    as="select"
                    name="internetAccess"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                  >
                    <option value="" className="text-[#A8A8A8]">How do you access the internet?</option>
                    <option value="Smartphone with daily internet">Smartphone with daily internet</option>
                    <option value="Smartphone with occasional internet">Smartphone with occasional internet</option>
                    <option value="Computer/laptop">Computer/laptop</option>
                    <option value="Internet cafe">Internet cafe</option>
                    <option value="No regular internet access">No regular internet access</option>
                  </Field>
                  <ErrorMessage name="internetAccess" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How do you currently sell your crops? *</label>
                  <Field
                    as="select"
                    name="currentSellingMethod"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                  >
                    <option value="" className="text-[#A8A8A8]">Select current method</option>
                    <option value="Local markets">Local markets</option>
                    <option value="Middlemen/traders">Middlemen/traders</option>
                    <option value="Direct to consumers">Direct to consumers</option>
                    <option value="Cooperatives">Cooperatives</option>
                    <option value="Online platforms">Online platforms</option>
                    <option value="Processing companies">Processing companies</option>
                  </Field>
                  <ErrorMessage name="currentSellingMethod" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
            )}

            {/* Step 4: Picture Verification */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-gray-600">📷</span>
                  <h2 className="text-lg font-medium">Picture Verification</h2>
                </div>
                <p className="text-gray-600 text-sm mb-6">Upload photos to verify your farm and build trust with buyers.</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Farm Photo *</label>
                  <p className="text-xs text-gray-500 mb-3">Take a clear photo of your farm or crops to show buyers your growing operation</p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="space-y-2">
                      <div className="text-gray-400">📤</div>
                      <div>
                        <input
                          type="file"
                          id="farmPhoto"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, setFieldValue, 'farmPhoto')}
                        />
                        <label
                          htmlFor="farmPhoto"
                          className="cursor-pointer text-mainGreen font-medium hover:text-mainGreen/80"
                        >
                          Upload Farm Photo
                        </label>
                      </div>
                      <p className="text-xs text-gray-400">Max 10 MB files are allowed</p>
                      {values.farmPhoto && (
                        <p className="text-sm text-mainGreen">✓ {values.farmPhoto.name}</p>
                      )}
                    </div>
                  </div>
                  <ErrorMessage name="farmPhoto" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Farmer Photo *</label>
                  <p className="text-xs text-gray-500 mb-3">A clear photo of yourself for profile verification and trust building</p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="space-y-2">
                      <div className="text-gray-400">👤</div>
                      <div>
                        <input
                          type="file"
                          id="farmerPhoto"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, setFieldValue, 'farmerPhoto')}
                        />
                        <label
                          htmlFor="farmerPhoto"
                          className="cursor-pointer text-mainGreen font-medium hover:text-mainGreen/80"
                        >
                          Upload Profile Picture
                        </label>
                      </div>
                      <p className="text-xs text-gray-400">Max 10 MB files are allowed</p>
                      {values.farmerPhoto && (
                        <p className="text-sm text-mainGreen">✓ {values.farmerPhoto.name}</p>
                      )}
                    </div>
                  </div>
                  <ErrorMessage name="farmerPhoto" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
            )}

            {/* Step 5: Payment Setup */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-gray-600">💳</span>
                  <h2 className="text-lg font-medium">Payment Setup</h2>
                </div>
                <p className="text-gray-600 text-sm mb-6">Set up how you'd like to receive payments for your crops.</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
                  <Field
                    as="select"
                    name="bankName"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                  >
                    <option value="" className="text-[#A8A8A8]">Select preferred bank</option>
                    <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                    <option value="Zenith Bank">Zenith Bank</option>
                    <option value="GTBank">GTBank</option>
                    <option value="Access Bank">Access Bank</option>
                    <option value="UBA">UBA</option>
                    <option value="Fidelity Bank">Fidelity Bank</option>
                    <option value="FCMB">FCMB</option>
                    <option value="Stanbic IBTC">Stanbic IBTC</option>
                  </Field>
                  <ErrorMessage name="bankName" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
                  <Field
                    name="accountNumber"
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                    placeholder="Enter your account number"
                  />
                  <ErrorMessage name="accountNumber" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2"
                >
                  ← Previous
                </button>
              )}
              
              <div className="ml-auto">
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => handleNext(validateForm, values)}
                    className="px-6 py-2 bg-mainGreen text-white rounded-md hover:bg-mainGreen/50 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2"
                  >
                    Proceed →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-mainGreen text-white rounded-md hover:bg-mainGreen/50 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Completing...' : 'Complete Registration'}
                  </button>
                )}
              </div>
            </div>

            {/* Footer Links */}
            <div className="text-center pt-6 border-t border-gray-200">
              {currentStep === 0 && (
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="login-farmer" className="text-mainGreen hover:text-mainGreen/80 font-medium">
                    Login
                  </Link>
                </p>
              )}
              <div className="mt-2">
                <Link href="/" className="text-sm text-mainGreen hover:text-mainGreen/80">
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