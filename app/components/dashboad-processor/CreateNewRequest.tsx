
'use client'
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { X, Calendar } from 'lucide-react';
import { 
  TextField, 
  SelectField, 
  cropsOptions,
  unitOptions
} from '../forms/FormFields';

// TypeScript interfaces
interface CreateRequestFormValues {
  cropType: string;
  qualityStandard: string;
  requestQuantity: string;
  unit: string;
  pricePerUnit: string;
  estimatedDeliveryDate: string;
  deliveryLocation: string;
  preferredPaymentMethod: string;
}

const initialValues: CreateRequestFormValues = {
  cropType: '',
  qualityStandard: '',
  requestQuantity: '',
  unit: '',
  pricePerUnit: '',
  estimatedDeliveryDate: '',
  deliveryLocation: '',
  preferredPaymentMethod: '',
};

// Quality standards options
const qualityStandardOptions = [
  { value: 'Grade A', label: 'Grade A' },
  { value: 'Grade B', label: 'Grade B' },
  { value: 'Grade C', label: 'Grade C' },
  { value: 'Premium', label: 'Premium' },
  { value: 'Standard', label: 'Standard' },
];

// Payment method options
const paymentMethodOptions = [
  { value: 'Pay on Delivery', label: 'Pay on Delivery' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Mobile Money', label: 'Mobile Money' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Credit', label: 'Credit' },
];

// Validation schema
const validationSchema = Yup.object({
  cropType: Yup.string().required('Crop type is required'),
  qualityStandard: Yup.string().required('Quality standard is required'),
  requestQuantity: Yup.string().required('Request quantity is required'),
  unit: Yup.string().required('Unit is required'),
  pricePerUnit: Yup.string().required('Price per unit is required'),
  estimatedDeliveryDate: Yup.string().required('Estimated delivery date is required'),
  deliveryLocation: Yup.string().required('Delivery location is required'),
  preferredPaymentMethod: Yup.string().required('Preferred payment method is required'),
});

interface CreateNewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productName?: string; // Optional: pre-fill with product name if coming from a specific product
}

const CreateNewRequestModal: React.FC<CreateNewRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productName
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
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (values: CreateRequestFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Request submitted:', values);
      
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Request submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set initial crop type if productName is provided
  const getInitialValues = (): CreateRequestFormValues => {
    if (productName) {
      // Try to match the product name to a crop type
      const matchingCrop = cropsOptions.find(crop => 
        productName.toLowerCase().includes(crop.label.toLowerCase())
      );
      
      return {
        ...initialValues,
        cropType: matchingCrop ? matchingCrop.value : '',
      };
    }
    return initialValues;
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
          className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl"
          style={{ height: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrollable Content */}
          <div className="h-full flex flex-col">
            {/* Fixed Header */}
            <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-black">Create New Request</h2>
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
                initialValues={getInitialValues()}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, errors, touched }) => (
                  <Form className="space-y-8">
                    {/* Product Details Section */}
                    <div>
                      <h3 className="text-base font-medium mb-2">Product Details</h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Add information on the product you are requesting
                      </p>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <SelectField
                            name="cropType"
                            label="Crop Type"
                            placeholder="Select crop type..."
                            options={cropsOptions}
                            required
                          />
                          
                          <SelectField
                            name="qualityStandard"
                            label="Quality Standard"
                            placeholder="Select quality standard..."
                            options={qualityStandardOptions}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextField
                            name="requestQuantity"
                            label="Request Quantity"
                            placeholder="Enter request quantity"
                            type="number"
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
                              Estimated Delivery Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                name="estimatedDeliveryDate"
                                value={values.estimatedDeliveryDate}
                                onChange={(e) => setFieldValue('estimatedDeliveryDate', e.target.value)}
                                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent transition-colors pr-10"
                              />
                              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.estimatedDeliveryDate && touched.estimatedDeliveryDate && (
                              <p className="text-red-500 text-xs mt-1">{errors.estimatedDeliveryDate}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <TextField
                            name="deliveryLocation"
                            label="Delivery Location"
                            as="textarea"
                            rows={4}
                            placeholder="Enter delivery location"
                            required
                          />
                        </div>

                        <div>
                          <SelectField
                            name="preferredPaymentMethod"
                            label="Preferred Payment Method"
                            placeholder="Select payment method..."
                            options={paymentMethodOptions}
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
                              Submitting Request...
                            </span>
                          ) : (
                            'Submit Request'
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

export default CreateNewRequestModal;