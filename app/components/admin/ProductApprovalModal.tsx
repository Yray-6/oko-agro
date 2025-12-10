"use client";
import React from "react";
import Image from "next/image";

interface ProductApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: "approve" | "reject";
  productName: string;
  isLoading?: boolean;
}

const ProductApprovalModal: React.FC<ProductApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  productName,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const isApprove = action === "approve";
  const title = isApprove ? "Approve Product Listing?" : "Reject Product Listing?";
  const message = isApprove
    ? `Are you sure you want to approve "${productName}"? This product will be visible to all users on the platform.`
    : `Are you sure you want to reject "${productName}"? This action cannot be undone.`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative min-h-screen flex items-center justify-center py-6 px-4">
        <div
          className="relative bg-white rounded-lg shadow-xl w-full max-w-md py-6 px-6 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isApprove
                  ? "bg-[rgba(11,169,100,0.1)]"
                  : "bg-[rgba(205,0,3,0.1)]"
              }`}
            >
              {isApprove ? (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#0BA964"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 14L12 12M12 12L14 10M12 12L10 10M12 12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#CD0003"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Title */}
          <h2
            className="text-xl font-semibold mb-3"
            style={{
              fontFamily: "Effra, sans-serif",
              color: "#101828",
            }}
          >
            {title}
          </h2>

          {/* Message */}
          <p
            className="text-sm text-[#5B5B5B] mb-6 leading-relaxed"
            style={{
              fontFamily: "Effra, sans-serif",
              lineHeight: "1.5em",
            }}
          >
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 border border-[#EBE7E5] text-[#0D3F11] rounded-[10px] hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: "Effra, sans-serif",
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-2.5 px-4 rounded-[10px] text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isApprove
                  ? "bg-[#0BA964] hover:bg-[#0a9558]"
                  : "bg-[#CD0003] hover:bg-[#b30002]"
              }`}
              style={{
                fontFamily: "Effra, sans-serif",
              }}
            >
              {isLoading
                ? "Processing..."
                : isApprove
                ? "Approve"
                : "Reject"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductApprovalModal;

