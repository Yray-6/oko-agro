"use client";

import React, { useEffect, useState } from "react";
import { Truck, X } from "lucide-react";
import { normalizeTrackingNumber } from "@/app/utils/agrotrackHandoff";

interface LinkTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (trackingNumber: string) => Promise<void>;
  orderLabel?: string;
  isLoading?: boolean;
}

const LinkTrackingModal: React.FC<LinkTrackingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  orderLabel,
  isLoading = false,
}) => {
  const [tracking, setTracking] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isLoading, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setTracking("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isLoading) return;
    setTracking("");
    setError("");
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = normalizeTrackingNumber(tracking);

    if (!normalized) {
      setError("Enter a valid AgroTrack tracking number.");
      return;
    }

    setError("");
    await onSubmit(normalized);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md rounded-lg bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="link-tracking-title"
        >
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <h2
              id="link-tracking-title"
              className="text-xl font-semibold text-gray-900"
            >
              Link Tracking
            </h2>
            {!isLoading && (
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 p-6">
              <div className="flex items-start gap-3 rounded-lg border border-sky-100 bg-sky-50 p-4">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
                <p className="text-sm leading-relaxed text-sky-900">
                  Paste the AgroTrack tracking number from your shipment
                  confirmation
                  {orderLabel ? (
                    <>
                      {" "}
                      for <span className="font-medium">{orderLabel}</span>
                    </>
                  ) : null}
                  . This only links tracking — it does not mark the order as
                  shipped.
                </p>
              </div>

              <div>
                <label
                  htmlFor="agrotrack-tracking"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Tracking number <span className="text-red-500">*</span>
                </label>
                <input
                  id="agrotrack-tracking"
                  type="text"
                  value={tracking}
                  onChange={(e) => {
                    setTracking(e.target.value.toUpperCase());
                    setError("");
                  }}
                  placeholder="e.g. ABC123XYZ45"
                  disabled={isLoading}
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 font-mono text-sm tracking-wide transition-colors placeholder:font-sans placeholder:tracking-normal placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-mainGreen disabled:cursor-not-allowed disabled:opacity-50"
                />
                {error ? (
                  <p className="mt-1 text-xs text-red-500">{error}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    You can copy this from AgroTrack after creating the shipment.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 rounded-b-lg border-t border-gray-200 bg-gray-50 p-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !tracking.trim()}
                className="rounded-md bg-mainGreen px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-mainGreen/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Linking..." : "Link Tracking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LinkTrackingModal;
