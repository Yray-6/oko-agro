'use client'
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useDisputeStore } from '@/app/store/useDisputeStore';
import { BuyRequest } from '@/app/types';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyRequest: BuyRequest;
  onDisputeCreated?: () => void;
}

const DisputeModal: React.FC<DisputeModalProps> = ({
  isOpen,
  onClose,
  buyRequest,
  onDisputeCreated,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const { createDispute, isCreating } = useDisputeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!reason.trim()) {
      setError('Please provide a reason for the dispute');
      return;
    }

    if (reason.trim().length < 10) {
      setError('Reason must be at least 10 characters long');
      return;
    }

    try {
      await createDispute({
        buyRequestId: buyRequest.id,
        reason: reason.trim(),
      });
      
      setReason('');
      if (onDisputeCreated) {
        onDisputeCreated();
      }
      onClose();
    } catch (error) {
      // Error is already handled in the store with toast
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setReason('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
      />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Create Dispute</h2>
            <button
              onClick={handleClose}
              disabled={isCreating}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Order Information:</strong> {buyRequest.cropType?.name || buyRequest.description} - 
                Request #{buyRequest.requestNumber}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Dispute <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setError('');
                  }}
                  rows={6}
                  placeholder="Please provide a detailed reason for this dispute..."
                  disabled={isCreating}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 10 characters required. Please be as detailed as possible.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isCreating}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isCreating || !reason.trim()}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Submitting...' : 'Submit Dispute'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeModal;
