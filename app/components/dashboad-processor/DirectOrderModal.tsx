'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  User, 
  Package, 
  MapPin, 
  Loader2, 
  CheckCircle, 
  Upload, 
  FileText,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useBuyRequestStore } from '@/app/store/useRequestStore';
import { Notification, BuyRequest } from '@/app/types';

interface DirectOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification;
  buyRequest: BuyRequest | null;
  onSuccess?: () => void;
}

type Step = 'confirm' | 'upload' | 'success';

const DirectOrderModal: React.FC<DirectOrderModalProps> = ({
  isOpen,
  onClose,
  notification,
  buyRequest,
  onSuccess,
}) => {
  const { directBuyRequest, uploadPurchaseOrder, isUpdating, fetchBuyRequest } = useBuyRequestStore();
  
  const [step, setStep] = useState<Step>('confirm');
  const [purchaseOrderFile, setPurchaseOrderFile] = useState<File | null>(null);
  const [purchaseOrderBase64, setPurchaseOrderBase64] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [directedRequest, setDirectedRequest] = useState<BuyRequest | null>(null);
  const [requestData, setRequestData] = useState<BuyRequest | null>(null);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch buy request if not provided
  useEffect(() => {
    console.log('🔵 [DirectOrderModal] useEffect triggered', {
      isOpen,
      hasBuyRequest: !!buyRequest,
      relatedEntityId: notification.relatedEntityId,
      hasRequestData: !!requestData,
    });

    if (isOpen) {
      // Reset requestData when modal opens to allow fresh fetch
      if (!requestData) {
        if (buyRequest) {
          // Use provided buy request
          console.log('✅ [DirectOrderModal] Using provided buy request');
          setRequestData(buyRequest);
          
          // If already directed to this seller and no PO, go straight to upload step
          if (buyRequest.seller?.id === notification.senderId && !buyRequest.purchaseOrderDoc) {
            console.log('✅ [DirectOrderModal] Order already directed, going to upload step');
            setDirectedRequest(buyRequest);
            setStep('upload');
          }
        } else if (notification.relatedEntityId) {
          // Fetch buy request if not provided
          console.log('📥 [DirectOrderModal] Fetching buy request:', notification.relatedEntityId);
          setIsLoadingRequest(true);
          setError(null);
          fetchBuyRequest(notification.relatedEntityId)
            .then(() => {
              const { currentRequest } = useBuyRequestStore.getState();
              console.log('✅ [DirectOrderModal] Buy request fetched:', {
                hasCurrentRequest: !!currentRequest,
                requestId: currentRequest?.id,
                hasSeller: !!currentRequest?.seller,
                sellerId: currentRequest?.seller?.id,
                notificationSenderId: notification.senderId,
                hasPO: !!currentRequest?.purchaseOrderDoc,
              });
              if (currentRequest) {
                setRequestData(currentRequest);
                
                // If already directed to this seller and no PO, go straight to upload step
                if (currentRequest.seller?.id === notification.senderId && !currentRequest.purchaseOrderDoc) {
                  console.log('✅ [DirectOrderModal] Order already directed, going to upload step');
                  setDirectedRequest(currentRequest);
                  setStep('upload');
                }
              } else {
                console.error('❌ [DirectOrderModal] Buy request not found in store');
                setError('Buy request not found');
              }
            })
            .catch((error) => {
              console.error('❌ [DirectOrderModal] Failed to fetch buy request:', error);
              setError('Failed to load buy request details');
            })
            .finally(() => {
              setIsLoadingRequest(false);
            });
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, notification.relatedEntityId]);

  if (!isOpen) return null;

  const sellerId = notification.senderId;
  const sellerName = notification.senderName || 'Unknown Farmer';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF or image file (JPG, PNG)');
        return;
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setError(null);
      setPurchaseOrderFile(file);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data URL prefix
        const base64Data = base64.split(',')[1] || base64;
        console.log('📄 [DirectOrderModal] File converted to base64:', {
          originalLength: base64.length,
          base64DataLength: base64Data.length,
          hasData: !!base64Data,
        });
        setPurchaseOrderBase64(base64Data);
      };
      reader.onerror = (error) => {
        console.error('❌ [DirectOrderModal] File read error:', error);
        setError('Failed to read file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDirectOrder = async () => {
    if (!sellerId || !requestData?.id) {
      setError('Missing required information');
      return;
    }

    // Check if order is already directed to this seller
    if (requestData.seller?.id === sellerId) {
      console.log('✅ [DirectOrderModal] Order already directed to this seller, proceeding to upload step');
      setDirectedRequest(requestData);
      setStep('upload');
      return;
    }

    try {
      setError(null);
      const result = await directBuyRequest({
        buyRequestId: requestData.id,
        sellerId: sellerId,
      });
      setDirectedRequest(result);
      setStep('upload');
    } catch (err) {
      console.error('Failed to direct order:', err);
      setError('Failed to direct order. Please try again.');
    }
  };

  const handleUploadPurchaseOrder = async () => {
    console.log('🔵 [DirectOrderModal] handleUploadPurchaseOrder called', {
      hasDirectedRequest: !!directedRequest,
      directedRequestId: directedRequest?.id,
      hasPurchaseOrderBase64: !!purchaseOrderBase64,
      purchaseOrderBase64Length: purchaseOrderBase64?.length || 0,
    });

    if (!directedRequest?.id) {
      setError('Missing buy request ID');
      return;
    }

    if (!purchaseOrderBase64) {
      setError('Please select a purchase order document');
      return;
    }

    try {
      setError(null);
      setIsUploading(true);
      console.log('📤 [DirectOrderModal] Calling uploadPurchaseOrder with:', {
        buyRequestId: directedRequest.id,
        hasPurchaseOrderDoc: !!purchaseOrderBase64,
        purchaseOrderDocLength: purchaseOrderBase64.length,
      });
      await uploadPurchaseOrder({
        buyRequestId: directedRequest.id,
        purchaseOrderDoc: purchaseOrderBase64,
      });
      setStep('success');
      
      // Auto close after 2 seconds
      setTimeout(() => {
        handleClose();
        onSuccess?.();
      }, 2000);
    } catch (err) {
      console.error('Failed to upload purchase order:', err);
      setError('Failed to upload purchase order. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkipUpload = () => {
    setStep('success');
    setTimeout(() => {
      handleClose();
      onSuccess?.();
    }, 2000);
  };

  const handleClose = () => {
    setStep('confirm');
    setPurchaseOrderFile(null);
    setPurchaseOrderBase64('');
    setError(null);
    setDirectedRequest(null);
    setRequestData(null); // Reset to null so it can be fetched again
    setIsLoadingRequest(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-mainGreen to-green-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {step === 'confirm' && <Send className="w-5 h-5 text-white" />}
                {step === 'upload' && <Upload className="w-5 h-5 text-white" />}
                {step === 'success' && <CheckCircle className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {step === 'confirm' && 'Direct Order to Seller'}
                  {step === 'upload' && 'Upload Purchase Order'}
                  {step === 'success' && 'Order Directed!'}
                </h2>
                <p className="text-white/80 text-sm">
                  {step === 'confirm' && 'Assign this request to a farmer'}
                  {step === 'upload' && 'Add your purchase order document'}
                  {step === 'success' && 'The farmer will be notified'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Step Progress */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${step === 'confirm' ? 'text-mainGreen' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                step === 'confirm' ? 'bg-mainGreen text-white' : 
                step === 'upload' || step === 'success' ? 'bg-green-100 text-green-600' : 'bg-gray-200'
              }`}>
                {step === 'upload' || step === 'success' ? '✓' : '1'}
              </div>
              <span className="text-xs font-medium">Confirm</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300" />
            <div className={`flex items-center gap-2 ${step === 'upload' ? 'text-mainGreen' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                step === 'upload' ? 'bg-mainGreen text-white' : 
                step === 'success' ? 'bg-green-100 text-green-600' : 'bg-gray-200'
              }`}>
                {step === 'success' ? '✓' : '2'}
              </div>
              <span className="text-xs font-medium">Upload</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300" />
            <div className={`flex items-center gap-2 ${step === 'success' ? 'text-mainGreen' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                step === 'success' ? 'bg-mainGreen text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="text-xs font-medium">Done</span>
            </div>
          </div>
        </div>

        {/* Success State */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Directed Successfully!</h3>
            <p className="text-gray-600">
              {sellerName} will be notified about this order.
            </p>
          </div>
        )}

        {/* Confirm Step */}
        {step === 'confirm' && (
          <>
            {/* Seller Info */}
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{sellerName}</h3>
                  <p className="text-sm text-gray-500">
                    Interested farmer from contact message
                  </p>
                </div>
              </div>
            </div>

            {/* Buy Request Info */}
            {isLoadingRequest ? (
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-mainGreen" />
                <span className="ml-2 text-sm text-gray-600">Loading request details...</span>
              </div>
            ) : requestData ? (
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-mainGreen/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-mainGreen" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      {requestData.cropType?.name || requestData.description || 'Buy Request'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Request #{requestData.requestNumber}
                    </p>
                    {requestData.qualityStandardType && (
                      <p className="text-xs text-gray-500 mt-1">
                        Quality: {requestData.qualityStandardType?.name || 'N/A'}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {requestData.productQuantity} {requestData.productQuantityUnit}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {requestData.deliveryLocation?.split(',')[0] || requestData.deliveryLocation}
                      </span>
                    </div>
                    {requestData.pricePerUnitOffer && (
                      <p className="text-xs text-gray-600 mt-1">
                        Price: ₦{requestData.pricePerUnitOffer}/unit
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="text-center text-sm text-red-600">
                  Failed to load buy request details
                </div>
              </div>
            )}

            {/* Message Preview */}
            <div className="p-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Directing this order will:
                    </p>
                    <ul className="text-sm text-amber-700 mt-2 space-y-1">
                      <li>• Assign {sellerName} as the seller</li>
                      <li>• Remove this request from general listings</li>
                      <li>• Notify the farmer about the order</li>
                      <li>• Allow you to upload a purchase order</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleClose}
                disabled={isUpdating}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDirectOrder}
                disabled={isUpdating || !sellerId || !requestData || isLoadingRequest}
                className="flex-1 px-4 py-2.5 bg-mainGreen text-white rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Directing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Direct Order
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Upload Step */}
        {step === 'upload' && (
          <>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Upload a purchase order document to formalize this order with {sellerName}.
              </p>
              
              {/* File Upload Area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  purchaseOrderFile 
                    ? 'border-mainGreen bg-mainGreen/5' 
                    : 'border-gray-300 hover:border-mainGreen hover:bg-gray-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {purchaseOrderFile ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-mainGreen/10 rounded-full flex items-center justify-center mb-3">
                      <FileText className="w-6 h-6 text-mainGreen" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{purchaseOrderFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(purchaseOrderFile.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPurchaseOrderFile(null);
                        setPurchaseOrderBase64('');
                      }}
                      className="mt-2 text-xs text-red-600 hover:text-red-700"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload purchase order
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, JPG, or PNG up to 10MB
                    </p>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleSkipUpload}
                disabled={isUploading}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Skip for now
              </button>
              <button
                onClick={handleUploadPurchaseOrder}
                disabled={isUploading || !purchaseOrderFile}
                className="flex-1 px-4 py-2.5 bg-mainGreen text-white rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload & Complete
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DirectOrderModal;

