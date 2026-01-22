'use client';

import React, { useState } from 'react';
import { X, Star, Loader2 } from 'lucide-react';
import { BuyRequest } from '@/app/types';
import apiClient from '@/app/utils/apiClient';
import { showToast } from '@/app/hooks/useToast';
import { useAuthStore } from '@/app/store/useAuthStore';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyRequest: BuyRequest;
  onRatingSubmitted?: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  buyRequest,
  onRatingSubmitted,
}) => {
  const { user } = useAuthStore();
  const [score, setScore] = useState<number>(0);
  const [hoveredScore, setHoveredScore] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine who is being rated (opposite of current user)
  const isFarmer = user?.role === 'farmer';
  const ratedUser = isFarmer ? buyRequest.buyer : buyRequest.seller;
  const ratedUserName = isFarmer
    ? (buyRequest.buyer?.companyName || `${buyRequest.buyer?.firstName} ${buyRequest.buyer?.lastName}`)
    : (buyRequest.seller?.farmName || `${buyRequest.seller?.firstName} ${buyRequest.seller?.lastName}`);

  // Format order details
  const orderNumber = buyRequest.requestNumber?.toString() || 'N/A';
  const productName = buyRequest.cropType?.name || buyRequest.description || 'Unknown Product';
  const quantity = `${buyRequest.productQuantity} ${buyRequest.productQuantityUnit}`;
  const orderValue = `₦${(parseFloat(buyRequest.pricePerUnitOffer) * parseFloat(buyRequest.productQuantity)).toLocaleString()}`;
  const productDetails = `${productName} (${quantity} - ${orderValue})`;
  const deliveryLocation = buyRequest.deliveryLocation || 'N/A';
  
  // Format completion date
  const completionDate = buyRequest.orderStateTime || buyRequest.updatedAt;
  const formattedDate = completionDate
    ? new Date(completionDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'N/A';

  const handleSubmit = async () => {
    if (score === 0) {
      showToast('Please select a rating', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post('/ratings', {
        buyRequestId: buyRequest.id,
        score,
        comment: comment.trim() || undefined,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      showToast('Rating submitted successfully!', 'success');
      onRatingSubmitted?.();
      handleClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error submitting rating:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit rating. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setScore(0);
    setHoveredScore(0);
    setComment('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg shadow-lg w-full max-w-[672px] mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#F59F0A]" fill="#F59F0A" />
            <h2 className="text-lg font-semibold text-[#272C34]">
              Rate {isFarmer ? 'Processor' : 'Farmer'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-[#272C34]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Details Section */}
          <div className="bg-[rgba(243,244,246,0.3)] border border-[rgba(229,231,235,0.5)] rounded-lg p-4 space-y-6">
            <div>
              <p className="text-xs font-normal text-black mb-2">
                Order: #{orderNumber}
              </p>
            </div>
            <div className="flex justify-between gap-4">
              <div className="flex-1 space-y-2">
                <p className="text-xs font-normal text-[#6C727F]">
                  Product: {productDetails}
                </p>
                <p className="text-xs font-normal text-[#6C727F]">
                  To: {deliveryLocation}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-normal text-[#6C727F]">
                  Completed: {formattedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="bg-white border border-[rgba(229,231,235,0.5)] rounded-lg p-6">
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-[rgba(60,131,246,0.1)] flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#3C83F6] flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {ratedUserName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>

              {/* Rating Content */}
              <div className="flex-1 space-y-1">
                <h3 className="text-base font-semibold text-[#272C34]">
                  {ratedUserName || 'User'}
                </h3>
                <p className="text-sm font-light text-[#272C34]">
                  How was your experience with this transaction?
                </p>
                
                {/* Star Rating */}
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setScore(star)}
                      onMouseEnter={() => setHoveredScore(star)}
                      onMouseLeave={() => setHoveredScore(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoveredScore || score)
                            ? 'text-[#F59F0A] fill-[#F59F0A]'
                            : 'text-[#6C727F]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white border border-[rgba(229,231,235,0.5)] rounded-lg p-6">
            <div className="space-y-3">
              <label className="block text-base font-semibold text-[#272C34]">
                Additional Comments (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share any additional feedback about your business interaction..."
                className="w-full h-[100px] px-3 py-2 bg-[#FAFAFA] border border-[#E5E7EB] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#004829] focus:border-transparent text-sm text-[#6C727F]"
              />
              <p className="text-xs font-normal text-[#6C727F]">
                Your feedback helps us maintain high service standards.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-md text-sm font-semibold text-[#272C34] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || score === 0}
              className="px-4 py-2.5 bg-[#004829] rounded-md text-sm font-semibold text-white hover:bg-[#003d20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
