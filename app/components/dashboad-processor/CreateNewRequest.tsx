'use client'
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { X, Calendar, Upload, FileText } from 'lucide-react';
import { 
  TextField, 
  SelectField, 
} from '../forms/FormFields';
import { useBuyRequestStore } from '@/app/store/useRequestStore';
import { useDataStore } from '@/app/store/useDataStore';
import { BuyRequest } from '@/app/types';

interface CreateRequestFormValues {
  cropType: string;
  qualityStandard: string;
  requestQuantity: string;
  pricePerKg: string;
  estimatedDeliveryDate: string;
  deliveryLocation: string;
  preferredPaymentMethod: string;
  description: string;
  purchaseOrderDoc: File | null;
}

const initialValues: CreateRequestFormValues = {
  cropType: '',
  qualityStandard: '',
  requestQuantity: '',
  pricePerKg: '',
  estimatedDeliveryDate: '',
  deliveryLocation: '',
  preferredPaymentMethod: '',
  description: '',
  purchaseOrderDoc: null,
};

const paymentMethodOptions = [
  { value: 'pay_on_delivery', label: 'Pay on Delivery' },
  { value: '5_day_post_delivery', label: '5 Day Post Delivery' },
  { value: '15_day_post_delivery', label: '15 Day Post Delivery' },
  { value: '30_day_post_delivery', label: '30 Day Post Delivery' },
  { value: 'cash_and_carry', label: 'Cash and Carry' },
];

// Map all payment methods to 'pay_on_delivery' for backend compatibility
// TODO: Update this when backend enums are updated
const mapPaymentMethodToBackend = (paymentMethod: string): string => {
  const paymentMethodsToMap = [
    'pay_on_delivery',
    '5_day_post_delivery',
    '15_day_post_delivery',
    '30_day_post_delivery',
    'cash_and_carry'
  ];
  
  if (paymentMethodsToMap.includes(paymentMethod)) {
    return 'pay_on_delivery';
  }
  
  return paymentMethod; // Return as-is for other methods (bank_transfer, mobile_money, cash)
};

// Validation schema with conditional validation for purchaseOrderDoc
// purchaseOrderDoc is only required when creating a specific request (sellerId or productId provided)
const createValidationSchema = (isSpecificRequest: boolean) => Yup.object({
  cropType: Yup.string().required('Crop type is required'),
  qualityStandard: Yup.string().required('Quality standard is required'),
  requestQuantity: Yup.string().required('Request quantity is required'),
  pricePerKg: Yup.string().required('Price per kg is required'),
  estimatedDeliveryDate: Yup.string().required('Estimated delivery date is required'),
  deliveryLocation: Yup.string().required('Delivery location is required'),
  preferredPaymentMethod: Yup.string().required('Preferred payment method is required'),
  description: Yup.string().required('Description is required'),
  purchaseOrderDoc: isSpecificRequest
    ? Yup.mixed()
        .required('Purchase order document is required for specific requests')
        .test('fileSize', 'File size must be less than 10MB', (value) => {
          if (!value) return false;
          return (value as File).size <= 10 * 1024 * 1024;
        })
    : Yup.mixed().nullable(),
});



interface CreateNewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (isEdit?: boolean) => void;
  productName?: string;
  productId?: string;
  sellerId?: string;
  cropId?: string;
  buyRequest?: BuyRequest | null; 
}

const CreateNewRequestModal: React.FC<CreateNewRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productName,
  productId,
  sellerId,
  cropId,
  buyRequest
}) => {
  const { createBuyRequest, updateBuyRequest, isCreating, isUpdating } = useBuyRequestStore();
  const isEditMode = !!buyRequest;
  const { crops, fetchCrops, qualityStandards, fetchQualityStandards } = useDataStore();
  
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix and return just the base64 string
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file upload
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFieldValue: (field: string, value: any) => void,
    fieldName: string
  ) => {
    const files = event.currentTarget.files;
    if (!files) return;

    const file = files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setFieldValue(fieldName, file);
    } else {
      alert('File size must be less than 10MB');
    }
  };

  // Fetch crops and quality standards on mount
  useEffect(() => {
    const loadData = async () => {
      if (isOpen) {
        console.log('📊 Starting data load...');
        setIsDataLoaded(false);
        try {
          const promises = [];
          
          console.log('Current crops length:', crops.length);
          console.log('Current qualityStandards length:', qualityStandards.length);
          
          if (crops.length === 0) {
            console.log('⬇️ Fetching crops...');
            promises.push(fetchCrops());
          }
          if (qualityStandards.length === 0) {
            console.log('⬇️ Fetching quality standards...');
            promises.push(fetchQualityStandards());
          }
          
          if (promises.length > 0) {
            await Promise.all(promises);
            console.log('✅ Data fetch complete');
          } else {
            console.log('ℹ️ Data already loaded, skipping fetch');
          }
          
          console.log('Crops after fetch:', crops.length);
          console.log('Crops data:', crops);
        } catch (error) {
          console.error('❌ Error loading data:', error);
        } finally {
          setIsDataLoaded(true);
          console.log('✅ Data loaded flag set to true');
        }
      }
    };
    
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, crops.length, qualityStandards.length, fetchCrops, fetchQualityStandards]);

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

  // Convert crops to options
  const cropOptions = crops.map(crop => ({
    value: crop.id,
    label: crop.name
  }));

  // Convert quality standards to options
  const qualityOptions = qualityStandards.map(quality => ({
    value: quality.id,
    label: quality.name
  }));

  // Determine if this is a specific request (from farmer-details page)
  const isSpecificRequest = !!(productId || sellerId);

  // Get initial values - handles both create and edit modes
  const getInitialValues = (): CreateRequestFormValues => {
    // If editing, populate from buyRequest
    if (isEditMode && buyRequest) {
      return {
        cropType: buyRequest.cropType.id,
        qualityStandard: buyRequest.qualityStandardType.id,
        requestQuantity: buyRequest.productQuantityKg,
        pricePerKg: buyRequest.pricePerKgOffer,
        estimatedDeliveryDate: buyRequest.estimatedDeliveryDate.split('T')[0],
        deliveryLocation: buyRequest.deliveryLocation,
        preferredPaymentMethod: buyRequest.preferredPaymentMethod,
        description: buyRequest.description,
        purchaseOrderDoc: null,
      };
    }
    
    // If creating new request
    const baseValues = { ...initialValues };
    
    // Pre-fill cropType if cropId is provided
    if (cropId && cropOptions.some(option => option.value === cropId)) {
      baseValues.cropType = cropId;
      console.log('Setting cropType to:', cropId);
    }
    
    // Pre-fill description if productName is provided
    if (productName) {
      baseValues.description = `Request for ${productName}`;
    }
    
    return baseValues;
  };

const handleSubmit = async (values: CreateRequestFormValues) => {
  try {
    if (isEditMode && buyRequest) {
      // Update existing request - DON'T send cropId or isGeneral
      await updateBuyRequest({
        buyRequestId: buyRequest.id,
        description: values.description,
        qualityStandardId: values.qualityStandard,
        productQuantityKg: String(values.requestQuantity),
        pricePerKgOffer: String(values.pricePerKg),
        estimatedDeliveryDate: values.estimatedDeliveryDate,
        deliveryLocation: values.deliveryLocation,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        preferredPaymentMethod: mapPaymentMethodToBackend(values.preferredPaymentMethod) as any,
        ...(buyRequest.product?.id && { productId: buyRequest.product.id }),
      });
      
      onSuccess(true); // true indicates it's an edit
    } else {
      // Create new request
      // All requests are general (isGeneral: true) by default
      // Only specific requests (from farmer-details page) are not general
      const isGeneral = !isSpecificRequest;
      
      // Convert purchase order file to base64 if provided (only for specific requests)
      let purchaseOrderDocBase64: string | undefined;
      if (!isGeneral && values.purchaseOrderDoc) {
        purchaseOrderDocBase64 = await fileToBase64(values.purchaseOrderDoc);
      }

      await createBuyRequest({
        description: values.description,
        cropId: values.cropType,
        qualityStandardId: values.qualityStandard,
        productQuantityKg: String(values.requestQuantity),
        pricePerKgOffer: String(values.pricePerKg),
        estimatedDeliveryDate: values.estimatedDeliveryDate,
        deliveryLocation: values.deliveryLocation,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        preferredPaymentMethod: mapPaymentMethodToBackend(values.preferredPaymentMethod) as any,
        isGeneral: isGeneral,
        ...(productId && { productId }),
        ...(sellerId && { sellerId }),
        ...(purchaseOrderDocBase64 && { purchaseOrderDoc: purchaseOrderDocBase64 }),
      });
      
      onSuccess(false); // false indicates it's a create
    }
  } catch (error) {
    console.error('Request submission failed:', error);
  }
};
  // Show loading state while data is being fetched
  if (!isDataLoaded) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl p-8">
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-mainGreen" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span className="ml-3 text-gray-600">Loading form data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl"
          style={{ height: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-black">
                  {isEditMode ? 'Edit Buy Request' : 'Create New Request'}
                </h2>
                {isSpecificRequest && !isEditMode && (
                  <p className="text-sm text-gray-500 mt-1">
                    Creating specific request for selected farmer/product
                  </p>
                )}
                {!isSpecificRequest && !isEditMode && (
                  <p className="text-sm text-gray-500 mt-1">
                    Creating general request visible to all farmers
                  </p>
                )}
                {isEditMode && (
                  <p className="text-sm text-gray-500 mt-1">
                    Request #{buyRequest?.requestNumber}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto py-6 px-12">
              <Formik
                initialValues={getInitialValues()}
                validationSchema={createValidationSchema(isSpecificRequest)}
                onSubmit={handleSubmit}
                enableReinitialize={true}
              >
                {({ values, setFieldValue, errors, touched }) => (
                  <Form className="space-y-8">
                    <div>
                      <h3 className="text-base font-medium mb-2">Product Details</h3>
                      <p className="text-sm text-gray-600 mb-6">
                        {isEditMode 
                          ? 'Update the information for your buy request' 
                          : 'Add information on the product you are requesting'
                        }
                      </p>

                      <div className="space-y-6">
                        <div>
                          <TextField
                            name="description"
                            label="Description"
                            as="textarea"
                            rows={3}
                            placeholder="Describe your buy request..."
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <SelectField
                            name="cropType"
                            label="Crop Type"
                            placeholder="Select crop type..."
                            options={cropOptions}
                            required
                          />
                          
                          <SelectField
                            name="qualityStandard"
                            label="Quality Standard"
                            placeholder="Select quality standard..."
                            options={qualityOptions}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextField
                            name="requestQuantity"
                            label="Request Quantity (kg)"
                            placeholder="Enter request quantity in kg"
                            type="number"
                            required
                          />
                          
                          <TextField
                            name="pricePerKg"
                            label="Price per kg"
                            placeholder="Enter price per kg"
                            type="number"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
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
                                min={new Date().toISOString().split('T')[0]}
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
                            rows={3}
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

                        {/* Request Type Info */}
                        {!isEditMode && (
                          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Request Type
                                </label>
                                <p className="text-xs text-gray-500">
                                  {isSpecificRequest 
                                    ? 'This is a specific request for the selected farmer/product. Purchase order document is required.'
                                    : 'This is a general request that will be visible to all farmers'
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Purchase Order Upload - Only show for specific requests (from farmer-details page) */}
                        {isSpecificRequest && !isEditMode && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Purchase Order Document <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-gray-500 mb-3">
                              Upload the purchase order document for this specific request (PDF, DOC, DOCX - Max 10MB)
                            </p>
                            <input
                              type="file"
                              id="purchaseOrderDoc"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, setFieldValue, 'purchaseOrderDoc')}
                            />
                            <div
                              onClick={() => document.getElementById('purchaseOrderDoc')?.click()}
                              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-mainGreen hover:bg-gray-50 transition-colors min-h-[150px] flex flex-col items-center justify-center"
                            >
                              {values.purchaseOrderDoc ? (
                                <>
                                  <FileText className="w-8 h-8 text-mainGreen mb-2" />
                                  <p className="text-mainGreen font-medium mb-1">
                                    {values.purchaseOrderDoc.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Click to change file
                                  </p>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                  <p className="text-mainGreen font-medium mb-1">
                                    Upload Purchase Order
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    PDF, DOC, or DOCX (Max 10MB)
                                  </p>
                                </>
                              )}
                            </div>
                            {errors.purchaseOrderDoc && touched.purchaseOrderDoc && (
                              <p className="text-red-500 text-xs mt-1">{errors.purchaseOrderDoc}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="sticky bottom-0 bg-white pt-6 pb-2 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={onClose}
                          disabled={isCreating || isUpdating}
                          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                        
                        <button
                          type="submit"
                          disabled={isCreating || isUpdating}
                          className="flex-1 px-6 py-3 bg-mainGreen text-white rounded-md hover:bg-mainGreen/90 focus:outline-none focus:ring-2 focus:ring-mainGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                          {(isCreating || isUpdating) ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                                <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                              </svg>
                              {isEditMode ? 'Updating Request...' : 'Submitting Request...'}
                            </span>
                          ) : (
                            isEditMode ? 'Update Request' : 'Submit Request'
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