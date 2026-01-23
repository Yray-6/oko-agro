'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Package, 
  Loader2, 
  ExternalLink,
  MapPin
} from 'lucide-react';
import { useProductStore } from '@/app/store/useProductStore';
import { useRouter } from 'next/navigation';
import { Notification } from '@/app/types';
import Image from 'next/image';
import rice from '@/app/assets/images/rice.png';

interface ViewFarmerProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification;
  onSuccess?: () => void;
}

// Helper function to get product image
const getProductImage = (cropName: string): string => {
  const cropNameLower = cropName.toLowerCase();
  if (cropNameLower.includes("rice")) return rice.src;
  if (cropNameLower.includes("cassava") || cropNameLower.includes("yam")) return rice.src;
  if (cropNameLower.includes("maize") || cropNameLower.includes("corn")) return rice.src;
  if (cropNameLower.includes("potato")) return rice.src;
  return rice.src; // Default image
};

const ViewFarmerProductsModal: React.FC<ViewFarmerProductsModalProps> = ({
  isOpen,
  onClose,
  notification,
  onSuccess,
}) => {
  const router = useRouter();
  const { products, isFetching, fetchApprovedUserProducts } = useProductStore();
  
  const [error, setError] = useState<string | null>(null);
  
  const farmerId = notification.senderId;
  const farmerName = notification.senderName || 'Farmer';

  // Fetch farmer's products when modal opens
  useEffect(() => {
    if (isOpen && farmerId) {
      setError(null);
      fetchApprovedUserProducts(farmerId).catch((err) => {
        console.error('Failed to fetch farmer products:', err);
        setError('Failed to load farmer products. Please try again.');
      });
    }
  }, [isOpen, farmerId, fetchApprovedUserProducts]);

  if (!isOpen) return null;

  const handleViewFullProfile = () => {
    if (farmerId) {
      router.push(`/dashboard-processor/find-farmer/farmer-details?farmerId=${farmerId}`);
      onClose();
      onSuccess?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-mainGreen to-green-700 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {farmerName}&apos;s Products
                </h2>
                <p className="text-white/80 text-sm">
                  View available products and send a request
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isFetching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-mainGreen" />
              <span className="ml-3 text-gray-600">Loading products...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => farmerId && fetchApprovedUserProducts(farmerId)}
                className="px-4 py-2 bg-mainGreen text-white rounded-lg hover:bg-green-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Available</h3>
              <p className="text-gray-500">
                This farmer hasn&apos;t listed any products yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={getProductImage(product.cropType?.name || 'rice')}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {product.cropType?.name || 'N/A'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {product.price && (
                            <span className="font-medium text-mainGreen">
                              ₦{parseFloat(product.price).toLocaleString()}
                            </span>
                          )}
                          {product.quantity && (
                            <span>
                              {product.quantity} {product.quantityUnit || 'kg'}
                            </span>
                          )}
                        </div>
                        {product.qualityStandard && (
                          <p className="text-xs text-gray-500 mt-2">
                            Quality: {product.qualityStandard.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {products.length > 0 && (
              <span>
                {products.length} product{products.length !== 1 ? 's' : ''} available
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleViewFullProfile}
              disabled={!farmerId}
              className="px-6 py-2 bg-mainGreen text-white rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Full Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFarmerProductsModal;
