'use client';

import React, { useState } from 'react';
import { X, Send, MessageSquare, Package, MapPin, User, Loader2, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useNotificationStore } from '@/app/store/useNotificationStore';
import { BuyRequest } from '@/app/types';

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
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  // Generate message template
  const farmerName = user ? `${user.firstName} ${user.lastName}` : 'Unknown Farmer';
  const farmName = user?.farmName || 'My Farm';
  const farmLocation = user ? `${user.state}, ${user.country}` : 'Unknown Location';
  const cropName = buyRequest.cropType?.name || 'the requested crop';
  
  const messageTemplate = `Hi ${processorName},

I'm ${farmerName} from ${farmName}, and I have ${cropName} available that matches your buy request #${buyRequest.requestNumber}.

Request Details:
• Crop: ${cropName}
• Quantity Needed: ${buyRequest.productQuantity} ${buyRequest.productQuantityUnit}
• Price Offer: ₦${buyRequest.pricePerUnitOffer}/unit
• Delivery Location: ${buyRequest.deliveryLocation}

I can fulfill this order. You can view my profile and products for more details, or send me a purchase order directly.

My farm is located in ${farmLocation}.

Looking forward to hearing from you!

Best regards,
${farmerName}`;

  const handleSendMessage = async () => {
    try {
      await sendContactMessage({
        buyRequestId: buyRequest.id,
        processorId: processorId,
        message: messageTemplate,
      });
      setIsSent(true);
      // Auto close after 2 seconds
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-mainGreen to-green-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Contact Processor</h2>
                <p className="text-white/80 text-sm">Send interest message</p>
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
                <div className="w-12 h-12 bg-mainGreen/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-mainGreen" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">
                    {buyRequest.cropType?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Request #{buyRequest.requestNumber}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {buyRequest.productQuantity} {buyRequest.productQuantityUnit}
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

            {/* Message Preview */}
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Preview
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                  {messageTemplate}
                </pre>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-amber-400 rounded-full"></span>
                This message will be sent automatically - it cannot be edited
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleClose}
                disabled={isSending}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={isSending}
                className="flex-1 px-4 py-2.5 bg-mainGreen text-white rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
          </>
        )}
      </div>
    </div>
  );
};

export default ContactProcessorModal;

