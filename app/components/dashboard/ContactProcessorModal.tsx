'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Send, MessageSquare, Package, MapPin, User, Loader2, CheckCircle, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useNotificationStore } from '@/app/store/useNotificationStore';
import { useProductStore } from '@/app/store/useProductStore';
import { BuyRequest, ProductDetails } from '@/app/types';
import { formatQuantity, getAvailableQuantityKg } from '@/app/helpers';

interface ContactProcessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyRequest: BuyRequest;
  processorId: string;
  processorName: string;
}

const ContactProcessorModal: React.FC<ContactProcessorModalProps> = ({
  isOpen,
  onClose,
  buyRequest,
  processorId,
  processorName,
}) => {
  const { user } = useAuthStore();
  const { sendContactMessage, isSending } = useNotificationStore();
  const { products: allProducts, isFetching: isFetchingProducts, fetchApprovedUserProducts } = useProductStore();
  const [isSent, setIsSent] = useState(false);

  // Listing selection
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [showCropDropdown, setShowCropDropdown] = useState(false);

  // Editable offer fields
  const [quantity, setQuantity] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState(buyRequest.deliveryLocation);
  const [message, setMessage] = useState('');

  // Fetch farmer's own approved products when modal opens
  useEffect(() => {
    if (isOpen && user?.id) {
      fetchApprovedUserProducts(user.id).catch(console.error);
    }
  }, [isOpen, user?.id, fetchApprovedUserProducts]);

  // Show all approved in-stock listings (not limited to the buy-request crop)
  const matchingProducts = useMemo(() => {
    return allProducts.filter((p: ProductDetails) => {
      if (p.approvalStatus !== 'approved') return false;
      const available = getAvailableQuantityKg(p.quantityKg, p.reservedQuantityKg);
      return available > 0;
    });
  }, [allProducts]);

  const selectedProduct = useMemo(() => {
    return matchingProducts.find((p: ProductDetails) => p.id === selectedProductId) || null;
  }, [matchingProducts, selectedProductId]);

  // When a listing is selected, populate price and quantity
  useEffect(() => {
    if (selectedProduct) {
      setPricePerKg(selectedProduct.pricePerKg || '');
      const available = getAvailableQuantityKg(selectedProduct.quantityKg, selectedProduct.reservedQuantityKg);
      const requestedQty = parseFloat(buyRequest.productQuantityKg) || 0;
      const qty = requestedQty > 0 ? Math.min(requestedQty, available) : available;
      setQuantity(String(qty));
    }
  }, [selectedProduct, buyRequest.productQuantityKg]);

  // Initialize/update message template
  useEffect(() => {
    if (isOpen) {
      const farmerName = user ? `${user.firstName} ${user.lastName}` : 'Unknown Farmer';
      const farmName = user?.farmName || 'My Farm';
      const farmLocation = user ? `${user.state}, ${user.country}` : 'Unknown Location';
      const cropName = selectedProduct?.cropType?.name || buyRequest.cropType?.name || 'the requested crop';

      const template = `Hi ${processorName},

I'm ${farmerName} from ${farmName}, and I have ${cropName} available that matches your buy request #${buyRequest.requestNumber}.

My Offer:
• Crop: ${cropName}
• Quantity Available: ${formatQuantity(quantity || '0')}kg
• Price Offer: ₦${pricePerKg || '0'}/kg
• Delivery Location: ${deliveryLocation}

I can fulfill this order. You can view my profile and products for more details, or send me a purchase order directly.

My farm is located in ${farmLocation}.

Looking forward to hearing from you!

Best regards,
${farmerName}`;

      setMessage(template);
    }
  }, [isOpen, quantity, pricePerKg, deliveryLocation, buyRequest, processorName, user, selectedProduct]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedProductId('');
      setQuantity('');
      setPricePerKg('');
      setDeliveryLocation(buyRequest.deliveryLocation);
      setIsSent(false);
      setShowCropDropdown(false);
    }
  }, [isOpen, buyRequest]);

  if (!isOpen) return null;

  const farmerName = user ? `${user.firstName} ${user.lastName}` : 'Unknown Farmer';
  const farmName = user?.farmName || 'My Farm';
  const farmLocation = user ? `${user.state}, ${user.country}` : 'Unknown Location';

  // Validation
  const availableQty = selectedProduct
    ? getAvailableQuantityKg(selectedProduct.quantityKg, selectedProduct.reservedQuantityKg)
    : 0;
  const parsedQuantity = parseFloat(quantity) || 0;
  const quantityExceeds = selectedProduct ? parsedQuantity > availableQty : false;
  const canSend = selectedProductId && parsedQuantity > 0 && !quantityExceeds && pricePerKg && deliveryLocation;

  const handleSendMessage = async () => {
    if (!canSend) return;
    try {
      await sendContactMessage({
        buyRequestId: buyRequest.id,
        processorId: processorId,
        message: message,
        productId: selectedProductId,
      });
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to send contact message:', error);
    }
  };

  const handleClose = () => {
    setIsSent(false);
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[785px] mx-4 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header — green-tinted per Figma */}
        <div className="flex-shrink-0 px-6 py-4" style={{ backgroundColor: 'rgba(209, 236, 224, 0.6)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-mainGreen" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#004829]">Contact Processor</h2>
                <p className="text-[#004829] text-sm">Send interest message</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#004829]" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Success State */}
          {isSent ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600">
                Your interest has been sent to {processorName}. They will receive a notification.
              </p>
            </div>
          ) : (
            <>
              {/* Request Info */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[rgba(0,72,41,0.1)] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-mainGreen" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {buyRequest.cropType?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Request #{buyRequest.requestNumber}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {formatQuantity(buyRequest.productQuantityKg)}kg
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {buyRequest.deliveryLocation?.split(',')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sender Info */}
              <div className="px-6 py-3 border-b border-gray-200 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Sending as: {farmerName}</p>
                  <p className="text-xs text-gray-500">{farmName} • {farmLocation}</p>
                </div>
              </div>

              {/* Offer Details */}
              <div className="px-6 py-6 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Your Offer Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left column */}
                  <div className="space-y-4">
                    {/* Quantity Available */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Quantity Available
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent ${
                            quantityExceeds ? 'border-red-400' : 'border-gray-300'
                          }`}
                          placeholder="Enter quantity in kg"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">kg</span>
                      </div>
                      {quantityExceeds && (
                        <p className="text-xs text-red-500 mt-1">
                          Exceeds available inventory ({formatQuantity(availableQty)}kg)
                        </p>
                      )}
                    </div>

                    {/* Delivery Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Delivery Location
                      </label>
                      <input
                        type="text"
                        value={deliveryLocation}
                        onChange={(e) => setDeliveryLocation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                        placeholder="Enter delivery location"
                      />
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="space-y-4">
                    {/* Price Per Kg */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Price Per Kg (₦)
                      </label>
                      <input
                        type="text"
                        value={pricePerKg}
                        onChange={(e) => setPricePerKg(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                        placeholder="Enter price per kg"
                      />
                    </div>

                    {/* Crop (Listing selector) */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Crop
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCropDropdown(!showCropDropdown)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                      >
                        <span className={selectedProduct ? 'text-gray-900' : 'text-gray-400'}>
                          {selectedProduct
                            ? `${selectedProduct.name} (${formatQuantity(getAvailableQuantityKg(selectedProduct.quantityKg, selectedProduct.reservedQuantityKg))}kg)`
                            : 'Select a listing'}
                        </span>
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </button>

                      {showCropDropdown && (
                        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {isFetchingProducts ? (
                            <div className="px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
                              <Loader2 className="w-4 h-4 animate-spin" /> Loading listings…
                            </div>
                          ) : matchingProducts.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-500">
                              No in-stock listings found.
                            </div>
                          ) : (
                            matchingProducts.map((product: ProductDetails) => {
                              const avail = getAvailableQuantityKg(product.quantityKg, product.reservedQuantityKg);
                              return (
                                <button
                                  key={product.id}
                                  onClick={() => {
                                    setSelectedProductId(product.id);
                                    setShowCropDropdown(false);
                                  }}
                                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                                    selectedProductId === product.id ? 'bg-green-50' : ''
                                  }`}
                                >
                                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {formatQuantity(avail)}kg available • ₦{parseFloat(product.pricePerKg).toLocaleString()}/kg
                                    {product.locationAddress && ` • ${product.locationAddress}`}
                                  </p>
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message to Processor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message to Processor
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent resize-none"
                    placeholder="Your message will be generated automatically..."
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    You can edit the message above. The offer details will be included automatically.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isSent && (
          <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
            <button
              onClick={handleClose}
              disabled={isSending}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-base hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSendMessage}
              disabled={isSending || !canSend}
              className="flex-1 px-4 py-2.5 bg-mainGreen text-white rounded-lg font-medium text-base hover:bg-green-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactProcessorModal;
