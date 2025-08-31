'use client'
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Leaf from '@/app/assets/icons/Leaf';
import Link from 'next/link';

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
    <div className="max-w-2xl mx-auto p-6 bg-white/80 rounded-lg shadow-lg">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-mainGreen mb-6">Processor Registration</h1>
        
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
                <p className="text-gray-600 text-sm mb-6">Let's start with your basic details. This helps us create your processor profile.</p>
                
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Location *</label>
                  <Field
                    as="textarea"
                    name="companyLocation"
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                    placeholder="Enter your company location"
                  />
                  <ErrorMessage name="companyLocation" component="div" className="text-red-500 text-xs mt-1" />
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

            {/* Step 2: Company Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-gray-600">🏢</span>
                  <h2 className="text-lg font-medium">Company Details</h2>
                </div>
                <p className="text-gray-600 text-sm mb-6">Tell us about your processing company and operations.</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <Field
                    name="companyName"
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                    placeholder="Enter your company name"
                  />
                  <ErrorMessage name="companyName" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Registration Number *</label>
                  <Field
                    name="businessRegistrationNumber"
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                    placeholder="Enter your business registration number"
                  />
                  <ErrorMessage name="businessRegistrationNumber" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crops you process (Select all that apply) *</label>
                  <Field
                    as="select"
                    name="cropsProcessed"
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
                    <option value="Cocoa">Cocoa</option>
                    <option value="Palm Oil">Palm Oil</option>
                  </Field>
                  <ErrorMessage name="cropsProcessed" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Processing Capacity *</label>
                    <Field
                      name="processingCapacity"
                      type="text"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                      placeholder="Enter processing capacity"
                    />
                    <ErrorMessage name="processingCapacity" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity Unit *</label>
                    <Field
                      as="select"
                      name="capacityUnit"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                    >
                      <option value="" className="text-[#A8A8A8]">Select Unit</option>
                      <option value="Tons per day">Tons per day</option>
                      <option value="Tons per week">Tons per week</option>
                      <option value="Tons per month">Tons per month</option>
                      <option value="Kilograms per day">Kilograms per day</option>
                    </Field>
                    <ErrorMessage name="capacityUnit" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Facility Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-gray-600">🏭</span>
                  <h2 className="text-lg font-medium">Facility Information</h2>
                </div>
                <p className="text-gray-600 text-sm mb-6">Provide details about your processing facility and capabilities.</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facility Type *</label>
                  <Field
                    as="select"
                    name="facilityType"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                  >
                    <option value="" className="text-[#A8A8A8]">Select facility type</option>
                    <option value="Small-scale processing unit">Small-scale processing unit</option>
                    <option value="Medium-scale processing plant">Medium-scale processing plant</option>
                    <option value="Large-scale industrial facility">Large-scale industrial facility</option>
                    <option value="Mobile processing unit">Mobile processing unit</option>
                    <option value="Cooperative processing center">Cooperative processing center</option>
                  </Field>
                  <ErrorMessage name="facilityType" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certifications & Standards (Select all that apply) *</label>
                  <Field
                    as="select"
                    name="certifications"
                    multiple
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                    size={5}
                  >
                    <option value="NAFDAC Registration">NAFDAC Registration</option>
                    <option value="ISO 22000">ISO 22000 (Food Safety Management)</option>
                    <option value="HACCP">HACCP (Hazard Analysis Critical Control Points)</option>
                    <option value="Organic Certification">Organic Certification</option>
                    <option value="Fair Trade Certification">Fair Trade Certification</option>
                    <option value="SON Standards">SON (Standards Organization of Nigeria)</option>
                    <option value="Halal Certification">Halal Certification</option>
                    <option value="None yet (planning to obtain)">None yet (planning to obtain)</option>
                  </Field>
                  <ErrorMessage name="certifications" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage Capacity *</label>
                  <Field
                    name="storageCapacity"
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                    placeholder="e.g., 500 tons"
                  />
                  <p className="text-xs text-gray-500 mt-1">This helps farmers understand your capacity to handle their produce</p>
                  <ErrorMessage name="storageCapacity" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quality Standards *</label>
                  <Field
                    as="select"
                    name="qualityStandards"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                  >
                    <option value="" className="text-[#A8A8A8]">Select quality requirements</option>
                    <option value="Premium grade only">Premium grade only</option>
                    <option value="Premium and standard grade">Premium and standard grade</option>
                    <option value="All grades accepted">All grades accepted</option>
                    <option value="Custom specifications">Custom specifications</option>
                  </Field>
                  <ErrorMessage name="qualityStandards" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
            )}

            {/* Step 4: Business Verification */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-gray-600">📄</span>
                  <h2 className="text-lg font-medium">Business Verification</h2>
                </div>
                <p className="text-gray-600 text-sm mb-6">Upload documents to verify your business and build trust with farmers.</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business License/Registration Certificate *</label>
                  <p className="text-xs text-gray-500 mb-3">Upload your business registration certificate or license to verify your company</p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="space-y-2">
                      <div className="text-gray-400">📄</div>
                      <div>
                        <input
                          type="file"
                          id="businessLicense"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, setFieldValue, 'businessLicense')}
                        />
                        <label
                          htmlFor="businessLicense"
                          className="cursor-pointer text-mainGreen font-medium hover:text-mainGreen/80"
                        >
                          Upload Business License
                        </label>
                      </div>
                      <p className="text-xs text-gray-400">Max 10 MB files are allowed (PDF, JPG, PNG)</p>
                      {values.businessLicense && (
                        <p className="text-sm text-mainGreen">✓ {values.businessLicense.name}</p>
                      )}
                    </div>
                  </div>
                  <ErrorMessage name="businessLicense" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facility Photo *</label>
                  <p className="text-xs text-gray-500 mb-3">A clear photo of your processing facility to show farmers your operations</p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="space-y-2">
                      <div className="text-gray-400">🏭</div>
                      <div>
                        <input
                          type="file"
                          id="facilityPhoto"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, setFieldValue, 'facilityPhoto')}
                        />
                        <label
                          htmlFor="facilityPhoto"
                          className="cursor-pointer text-mainGreen font-medium hover:text-mainGreen/80"
                        >
                          Upload Facility Photo
                        </label>
                      </div>
                      <p className="text-xs text-gray-400">Max 10 MB files are allowed</p>
                      {values.facilityPhoto && (
                        <p className="text-sm text-mainGreen">✓ {values.facilityPhoto.name}</p>
                      )}
                    </div>
                  </div>
                  <ErrorMessage name="facilityPhoto" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>
            )}

            {/* Step 5: Payment & Contract Setup */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-gray-600">💳</span>
                  <h2 className="text-lg font-medium">Payment & Contract Setup</h2>
                </div>
                <p className="text-gray-600 text-sm mb-6">Set up your payment details and preferred contract terms.</p>
                
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

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Payment Terms *</label>
                  <Field
                    as="select"
                    name="preferredPaymentTerms"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none placeholder:text-[#A8A8A8] focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                  >
                    <option value="" className="text-[#A8A8A8]">Select payment terms</option>
                    <option value="Immediate payment on delivery">Immediate payment on delivery</option>
                    <option value="Payment within 7 days">Payment within 7 days</option>
                    <option value="Payment within 14 days">Payment within 14 days</option>
                    <option value="Payment within 30 days">Payment within 30 days</option>
                    <option value="50% advance, 50% on delivery">50% advance, 50% on delivery</option>
                    <option value="30% advance, 70% on delivery">30% advance, 70% on delivery</option>
                  </Field>
                  <p className="text-xs text-gray-500 mt-1">This helps farmers understand when they'll receive payment</p>
                  <ErrorMessage name="preferredPaymentTerms" component="div" className="text-red-500 text-xs mt-1" />
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
                    className="px-6 py-2 bg-mainGreen text-white rounded-md hover:bg-mainGreen/80 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2"
                  >
                    Proceed →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-mainGreen text-white rounded-md hover:bg-mainGreen/80 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <Link href="login-processor" className="text-mainGreen hover:text-mainGreen/80 font-medium">
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

export default ProcessorRegistrationForm;