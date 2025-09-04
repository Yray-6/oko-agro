/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Camera, X, Calendar } from 'lucide-react';
import { 
  TextField, 
  SelectField, 
  cropsOptions,
  unitOptions
} from '../forms/FormFields'; // Import your reusable components
import Image from 'next/image';
import mail from "@/app/assets/images/productSuccess.png"

// TypeScript interfaces
interface ListProductFormValues {
  productName: string;
  cropType: string;
  availableQuantity: string;
  unit: string;
  pricePerUnit: string;
  harvestDate: string;
  storageFarmLocation: string;
  mainPicture: File | null;
  additionalPictures: File[];
}

const initialValues: ListProductFormValues = {
  productName: '',
  cropType: '',
  availableQuantity: '',
  unit: '',
  pricePerUnit: '',
  harvestDate: '',
  storageFarmLocation: '',
  mainPicture: null,
  additionalPictures: [],
};

// Validation schema
const validationSchema = Yup.object({
  productName: Yup.string().required('Product name is required'),
  cropType: Yup.string().required('Crop type is required'),
  availableQuantity: Yup.string().required('Available quantity is required'),
  unit: Yup.string().required('Unit is required'),
  pricePerUnit: Yup.string().required('Price per unit is required'),
  harvestDate: Yup.string().required('Harvest date is required'),
  storageFarmLocation: Yup.string().required('Storage/Farm location is required'),
  mainPicture: Yup.mixed().required('Main picture is required'),
});

interface ListNewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ListNewProductModal: React.FC<ListNewProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (values: ListProductFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Product listing submitted:', values);
      
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Product listing failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    fieldName: string,
    isMultiple: boolean = false
  ) => {
    const files = event.currentTarget.files;
    if (!files) return;

    if (isMultiple) {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(file => file.size <= 10 * 1024 * 1024);
      if (validFiles.length !== fileArray.length) {
        alert('Some files exceed 10MB limit and were not added');
      }
      setFieldValue(fieldName, validFiles);
    } else {
      const file = files[0];
      if (file && file.size <= 10 * 1024 * 1024) {
        setFieldValue(fieldName, file);
      } else {
        alert('File size must be less than 10MB');
      }
    }
  };

  const PictureUploadBox: React.FC<{
    title: string;
    subtitle?: string;
    onClick: () => void;
    files?: File | File[] | null;
    isMultiple?: boolean;
  }> = ({ title, subtitle, onClick, files, isMultiple = false }) => {
    const hasFiles = isMultiple ? 
      (Array.isArray(files) && files.length > 0) : 
      (files !== null);

    return (
      <div 
        onClick={onClick}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-mainGreen hover:bg-gray-50 transition-colors min-h-[200px] flex flex-col items-center justify-center"
      >
        <Camera className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-mainGreen font-medium mb-1">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mb-2">{subtitle}</p>}
        
        {hasFiles && (
          <div className="mt-2">
            {isMultiple ? (
              <p className="text-xs text-green-600">
                {(files as File[]).length} file(s) selected
              </p>
            ) : (
              <p className="text-xs text-green-600">
                {(files as File).name}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl"
          style={{ height: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrollable Content */}
          <div className="h-full flex flex-col">
            {/* Fixed Header */}
            <div className="flex-shrink-0 flex justify-between items-center p-6 ">
              <h2 className="text-xl font-semibold text-black">List New Product</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto py-6 px-12">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, errors, touched }) => (
                  <Form className="space-y-8">
                    {/* Product Pictures Section */}
                    <div>
                      <h3 className="text-base font-medium mb-2">Product Pictures</h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Add clear photos of your product. Good photos get more views!
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Main Picture Upload */}
                        <div>
                          <input
                            type="file"
                            id="mainPicture"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, setFieldValue, 'mainPicture')}
                          />
                          <PictureUploadBox
                            title="Upload Main Picture"
                            onClick={() => document.getElementById('mainPicture')?.click()}
                            files={values.mainPicture}
                          />
                          {errors.mainPicture && touched.mainPicture && (
                            <p className="text-red-500 text-xs mt-1">{errors.mainPicture}</p>
                          )}
                        </div>

                        {/* Additional Pictures Upload */}
                        <div>
                          <input
                            type="file"
                            id="additionalPictures"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, setFieldValue, 'additionalPictures', true)}
                          />
                          <PictureUploadBox
                            title="Additional Pictures"
                            onClick={() => document.getElementById('additionalPictures')?.click()}
                            files={values.additionalPictures}
                            isMultiple={true}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Product Details Section */}
                    <div>
                      <h3 className="text-base font-medium mb-2">Product Details</h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Add information on the product you are listing
                      </p>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextField
                            name="productName"
                            label="Product Name"
                            placeholder="Enter product name"
                            required
                          />
                          
                          <SelectField
                            name="cropType"
                            label="Crop Type"
                            placeholder="Select crop type..."
                            options={cropsOptions}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextField
                            name="availableQuantity"
                            label="Available Quantity"
                            placeholder="Enter available quantity"
                            required
                          />
                          
                          <SelectField
                            name="unit"
                            label="Unit"
                            placeholder="Select unit..."
                            options={unitOptions}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextField
                            name="pricePerUnit"
                            label="Price per unit"
                            placeholder="Enter price per unit"
                            required
                          />
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Harvest Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                name="harvestDate"
                                value={values.harvestDate}
                                onChange={(e) => setFieldValue('harvestDate', e.target.value)}
                                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent transition-colors pr-10"
                              />
                              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.harvestDate && touched.harvestDate && (
                              <p className="text-red-500 text-xs mt-1">{errors.harvestDate}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <TextField
                            name="storageFarmLocation"
                            label="Storage/Farm Location"
                            as="textarea"
                            rows={4}
                            placeholder="Enter storage/farm location"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fixed Action Buttons */}
                    <div className="sticky bottom-0 bg-white pt-6 pb-2 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={onClose}
                          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                        
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 px-6 py-3 bg-mainGreen text-white rounded-md hover:bg-mainGreen/90 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                                <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                              </svg>
                              Submitting Listing...
                            </span>
                          ) : (
                            'Submit Listing'
                          )}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Success Modal Component (also full custom implementation)
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,

  
  buttonText = "Back to my Products"
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
      />
      
      {/* Modal Container */}
      <div className="relative min-h-screen flex items-center justify-center py-6 px-12">
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-xl py-6 px-12 text-center"
          onClick={(e) => e.stopPropagation()}
        >
         {/* Email Icon with Checkmark */}
                <div className="flex justify-center  mb-6">
                  <div className="relative">
                    {/* Email Icon */}
                   <Image src={mail} alt="Email Icon" width={100}/>
        
                
                  </div>
                </div>
        
                {/* Title */}
                <h2 className="text-2xl font-semibold text-mainGreen mb-8">
               Listing Submitted Successfully!
                </h2>
        
                {/* Message */}
                <div className="space-y-4 mb-10">
                  <p className="text-black leading-relaxed">
                    Thank you for adding your product. Our inspection team will review it shortly to ensure it meets quality standards. 
                  </p>
                  <p className="text-black leading-relaxed">
                Our inspection team will review it shortly to ensure it meets quality standards. 
                  </p>
                </div>
        
             
          {/* Continue Button */}
          <button
            onClick={onClose}
            className="w-full py-2 px-6 border border-mainGreen text-mainGreen rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export { ListNewProductModal, SuccessModal };