"use client";

import React, { useEffect, useState } from "react";
import { Truck, X } from "lucide-react";
import type { ArrangeTransitRequest, BuyRequest } from "@/app/types";
import {
  buildArrangeTransitPrefill,
  NIGERIAN_STATE_OPTIONS,
} from "@/app/utils/agrotrackHandoff";

interface ArrangeTransitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ArrangeTransitRequest) => Promise<void>;
  buyRequest: BuyRequest | null;
  isLoading?: boolean;
}

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-mainGreen disabled:cursor-not-allowed disabled:opacity-50";

const ArrangeTransitModal: React.FC<ArrangeTransitModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  buyRequest,
  isLoading = false,
}) => {
  const [form, setForm] = useState<ArrangeTransitRequest | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !buyRequest) return;
    setForm(buildArrangeTransitPrefill(buyRequest));
    setError("");
  }, [isOpen, buyRequest]);

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

  if (!isOpen || !form) return null;

  const handleClose = () => {
    if (isLoading) return;
    setError("");
    onClose();
  };

  const update = <K extends keyof ArrangeTransitRequest>(
    key: K,
    value: ArrangeTransitRequest[K],
  ) => {
    setForm((current) => (current ? { ...current, [key]: value } : current));
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const required: Array<[keyof ArrangeTransitRequest, string]> = [
      ["pickupState", "Pickup state"],
      ["pickupLga", "Pickup LGA"],
      ["pickupStreetAddress", "Pickup address"],
      ["pickupContactName", "Pickup contact"],
      ["pickupPhone", "Pickup phone"],
      ["deliveryState", "Delivery state"],
      ["deliveryLga", "Delivery LGA"],
      ["deliveryStreetAddress", "Delivery address"],
      ["deliveryName", "Recipient name"],
      ["deliveryPhone", "Recipient phone"],
      ["cargoType", "Cargo type"],
    ];

    for (const [key, label] of required) {
      if (!String(form[key] ?? "").trim()) {
        setError(`${label} is required.`);
        return;
      }
    }

    if (!form.cargoWeight || form.cargoWeight <= 0) {
      setError("Cargo weight must be greater than 0.");
      return;
    }
    if (!form.cargoValue || form.cargoValue <= 0) {
      setError("Cargo value must be greater than 0.");
      return;
    }

    setError("");
    await onSubmit({
      ...form,
      pickupState: form.pickupState.trim(),
      pickupLga: form.pickupLga.trim(),
      pickupStreetAddress: form.pickupStreetAddress.trim(),
      pickupContactName: form.pickupContactName.trim(),
      pickupPhone: form.pickupPhone.trim(),
      deliveryState: form.deliveryState.trim(),
      deliveryLga: form.deliveryLga.trim(),
      deliveryStreetAddress: form.deliveryStreetAddress.trim(),
      deliveryName: form.deliveryName.trim(),
      deliveryPhone: form.deliveryPhone.trim(),
      deliveryEmail: form.deliveryEmail?.trim() || undefined,
      cargoType: form.cargoType.trim(),
    });
  };

  const orderLabel = buyRequest
    ? `Order #${buyRequest.requestNumber}`
    : "this order";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="arrange-transit-title"
        >
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <h2
              id="arrange-transit-title"
              className="text-xl font-semibold text-gray-900"
            >
              Arrange Transit
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
            <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
              <div className="flex items-start gap-3 rounded-lg border border-sky-100 bg-sky-50 p-4">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
                <p className="text-sm leading-relaxed text-sky-900">
                  Confirm pickup and delivery for {orderLabel}. AgroTrack needs
                  state and LGA. This does not mark the Oko order as shipped.
                </p>
              </div>

              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <h3 className="sm:col-span-2 text-sm font-semibold text-gray-900">
                  Pickup
                </h3>
                <label className="text-sm font-medium text-gray-700">
                  State <span className="text-red-500">*</span>
                  <select
                    value={form.pickupState}
                    onChange={(e) => update("pickupState", e.target.value)}
                    disabled={isLoading}
                    className={`${inputClass} mt-1`}
                  >
                    <option value="">Select state</option>
                    {NIGERIAN_STATE_OPTIONS.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-gray-700">
                  LGA <span className="text-red-500">*</span>
                  <input
                    value={form.pickupLga}
                    onChange={(e) => update("pickupLga", e.target.value)}
                    disabled={isLoading}
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="sm:col-span-2 text-sm font-medium text-gray-700">
                  Street address <span className="text-red-500">*</span>
                  <input
                    value={form.pickupStreetAddress}
                    onChange={(e) => update("pickupStreetAddress", e.target.value)}
                    disabled={isLoading}
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Contact name <span className="text-red-500">*</span>
                  <input
                    value={form.pickupContactName}
                    onChange={(e) => update("pickupContactName", e.target.value)}
                    disabled={isLoading}
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                  <input
                    value={form.pickupPhone}
                    onChange={(e) => update("pickupPhone", e.target.value)}
                    disabled={isLoading}
                    className={`${inputClass} mt-1`}
                  />
                </label>
              </section>

              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <h3 className="sm:col-span-2 text-sm font-semibold text-gray-900">
                  Delivery
                </h3>
                <label className="text-sm font-medium text-gray-700">
                  State <span className="text-red-500">*</span>
                  <select
                    value={form.deliveryState}
                    onChange={(e) => update("deliveryState", e.target.value)}
                    disabled={isLoading}
                    className={`${inputClass} mt-1`}
                  >
                    <option value="">Select state</option>
                    {NIGERIAN_STATE_OPTIONS.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-gray-700">
                  LGA <span className="text-red-500">*</span>
                  <input
                    value={form.deliveryLga}
                    onChange={(e) => update("deliveryLga", e.target.value)}
                    disabled={isLoading}
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="sm:col-span-2 text-sm font-medium text-gray-700">
                  Street address <span className="text-red-500">*</span>
                  <input
                    value={form.deliveryStreetAddress}
                    onChange={(e) =>
                      update("deliveryStreetAddress", e.target.value)
                    }
                    disabled={isLoading}
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Recipient name <span className="text-red-500">*</span>
                  <input
                    value={form.deliveryName}
                    onChange={(e) => update("deliveryName", e.target.value)}
                    disabled={isLoading}
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                  <input
                    value={form.deliveryPhone}
                    onChange={(e) => update("deliveryPhone", e.target.value)}
                    disabled={isLoading}
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="sm:col-span-2 text-sm font-medium text-gray-700">
                  Email
                  <input
                    type="email"
                    value={form.deliveryEmail || ""}
                    onChange={(e) => update("deliveryEmail", e.target.value)}
                    disabled={isLoading}
                    className={`${inputClass} mt-1`}
                  />
                </label>
              </section>

              <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <h3 className="sm:col-span-3 text-sm font-semibold text-gray-900">
                  Cargo
                </h3>
                <label className="text-sm font-medium text-gray-700">
                  Type <span className="text-red-500">*</span>
                  <input
                    value={form.cargoType}
                    onChange={(e) => update("cargoType", e.target.value)}
                    disabled={isLoading}
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Weight (kg) <span className="text-red-500">*</span>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={form.cargoWeight || ""}
                    onChange={(e) =>
                      update("cargoWeight", parseFloat(e.target.value) || 0)
                    }
                    disabled={isLoading}
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Value (₦) <span className="text-red-500">*</span>
                  <input
                    type="number"
                    min={0}
                    step="1"
                    value={form.cargoValue || ""}
                    onChange={(e) =>
                      update("cargoValue", parseFloat(e.target.value) || 0)
                    }
                    disabled={isLoading}
                    className={`${inputClass} mt-1`}
                  />
                </label>
              </section>

              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={Boolean(form.consentAcknowledged)}
                  onChange={(e) => update("consentAcknowledged", e.target.checked)}
                  disabled={isLoading}
                  className="mt-1"
                />
                I understand Oko may create an AgroTrack sender account for this
                shipment.
              </label>

              {error ? <p className="text-sm text-red-500">{error}</p> : null}
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
                disabled={isLoading}
                className="rounded-md bg-mainGreen px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-mainGreen/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Arranging..." : "Arrange Transit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArrangeTransitModal;
