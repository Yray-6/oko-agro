"use client";

import React, { useEffect, useState } from "react";
import { AxiosError, isCancel } from "axios";
import { Truck, X } from "lucide-react";
import type {
  ArrangeTransitRequest,
  BuyRequest,
  ShippingCostEstimate,
} from "@/app/types";
import {
  AGROTRACK_RATE_PER_KG,
  buildArrangeTransitPrefill,
  formatAgroTrackAmount,
  getAgroTrackEstimateTotalWithKgCharge,
  getAgroTrackKgCharge,
} from "@/app/utils/agrotrackHandoff";
import { useDataStore } from "@/app/store/useDataStore";
import { useBuyRequestStore } from "@/app/store/useRequestStore";

const CARGO_PRIORITY_OPTIONS: Array<{
  value: NonNullable<ArrangeTransitRequest["cargoPriority"]>;
  label: string;
}> = [
  { value: "standard", label: "Standard" },
  { value: "express", label: "Express" },
  { value: "same_day", label: "Same day" },
];

function estimateErrorMessage(error: unknown): string {
  if (isCancel(error)) return "";
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string | string[] } | undefined;
    const message = Array.isArray(data?.message)
      ? data.message.join(", ")
      : data?.message;
    if (status === 400) {
      return message || "Could not resolve this pickup/delivery pair.";
    }
    return message || "Could not load a shipping-cost preview.";
  }
  return "Could not load a shipping-cost preview.";
}

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
  const [estimate, setEstimate] = useState<ShippingCostEstimate | null>(null);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimateError, setEstimateError] = useState("");

  const estimateShippingCost = useBuyRequestStore(
    (state) => state.estimateShippingCost,
  );

  const {
    locations,
    locationsLoading,
    fetchLocations,
    getLgasForState,
  } = useDataStore();

  const stateOptions = locations.map((item) => item.state);
  const pickupLgas = form ? getLgasForState(form.pickupState) : [];
  const deliveryLgas = form ? getLgasForState(form.deliveryState) : [];

  const pickupState = form?.pickupState?.trim() ?? "";
  const pickupLga = form?.pickupLga?.trim() ?? "";
  const deliveryState = form?.deliveryState?.trim() ?? "";
  const deliveryLga = form?.deliveryLga?.trim() ?? "";
  const cargoPriority = form?.cargoPriority || "standard";

  useEffect(() => {
    if (!isOpen || !buyRequest) return;
    setForm(buildArrangeTransitPrefill(buyRequest));
    setError("");
    setEstimate(null);
    setEstimateError("");
    setEstimateLoading(false);
  }, [isOpen, buyRequest]);

  useEffect(() => {
    if (!isOpen) return;

    if (!pickupState || !pickupLga || !deliveryState || !deliveryLga) {
      setEstimate(null);
      setEstimateError("");
      setEstimateLoading(false);
      return;
    }

    const controller = new AbortController();
    setEstimateLoading(true);
    setEstimateError("");

    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await estimateShippingCost(
          {
            pickupState,
            pickupLga,
            deliveryState,
            deliveryLga,
            cargoPriority,
          },
          controller.signal,
        );
        setEstimate(result);
        setEstimateError("");
      } catch (err) {
        if (isCancel(err)) return;
        setEstimate(null);
        setEstimateError(estimateErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) {
          setEstimateLoading(false);
        }
      }
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [
    isOpen,
    pickupState,
    pickupLga,
    deliveryState,
    deliveryLga,
    cargoPriority,
    estimateShippingCost,
  ]);

  useEffect(() => {
    if (!isOpen) return;
    if (locations.length === 0) {
      fetchLocations().catch(console.error);
    }
  }, [isOpen, locations.length, fetchLocations]);

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

  const kgCharge = getAgroTrackKgCharge(form.cargoWeight);
  const totalEstimate = estimate
    ? getAgroTrackEstimateTotalWithKgCharge(
        estimate.estimatedCost,
        form.cargoWeight,
      )
    : null;

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

  const handlePickupStateChange = (value: string) => {
    setForm((current) =>
      current
        ? { ...current, pickupState: value, pickupLga: "" }
        : current,
    );
    setError("");
  };

  const handleDeliveryStateChange = (value: string) => {
    setForm((current) =>
      current
        ? { ...current, deliveryState: value, deliveryLga: "" }
        : current,
    );
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
                    onChange={(e) => handlePickupStateChange(e.target.value)}
                    disabled={isLoading || locationsLoading}
                    className={`${inputClass} mt-1`}
                  >
                    <option value="">
                      {locationsLoading ? "Loading states..." : "Select state"}
                    </option>
                    {form.pickupState &&
                    !stateOptions.includes(form.pickupState) ? (
                      <option value={form.pickupState}>
                        {form.pickupState}
                      </option>
                    ) : null}
                    {stateOptions.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-gray-700">
                  LGA <span className="text-red-500">*</span>
                  <select
                    value={form.pickupLga}
                    onChange={(e) => update("pickupLga", e.target.value)}
                    disabled={
                      isLoading || locationsLoading || !form.pickupState
                    }
                    className={`${inputClass} mt-1`}
                  >
                    <option value="">
                      {locationsLoading
                        ? "Loading LGAs..."
                        : form.pickupState
                          ? "Select LGA"
                          : "Select state first"}
                    </option>
                    {form.pickupLga &&
                    !pickupLgas.includes(form.pickupLga) ? (
                      <option value={form.pickupLga}>{form.pickupLga}</option>
                    ) : null}
                    {pickupLgas.map((lga) => (
                      <option key={lga} value={lga}>
                        {lga}
                      </option>
                    ))}
                  </select>
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
                    onChange={(e) => handleDeliveryStateChange(e.target.value)}
                    disabled={isLoading || locationsLoading}
                    className={`${inputClass} mt-1`}
                  >
                    <option value="">
                      {locationsLoading ? "Loading states..." : "Select state"}
                    </option>
                    {form.deliveryState &&
                    !stateOptions.includes(form.deliveryState) ? (
                      <option value={form.deliveryState}>
                        {form.deliveryState}
                      </option>
                    ) : null}
                    {stateOptions.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-gray-700">
                  LGA <span className="text-red-500">*</span>
                  <select
                    value={form.deliveryLga}
                    onChange={(e) => update("deliveryLga", e.target.value)}
                    disabled={
                      isLoading || locationsLoading || !form.deliveryState
                    }
                    className={`${inputClass} mt-1`}
                  >
                    <option value="">
                      {locationsLoading
                        ? "Loading LGAs..."
                        : form.deliveryState
                          ? "Select LGA"
                          : "Select state first"}
                    </option>
                    {form.deliveryLga &&
                    !deliveryLgas.includes(form.deliveryLga) ? (
                      <option value={form.deliveryLga}>
                        {form.deliveryLga}
                      </option>
                    ) : null}
                    {deliveryLgas.map((lga) => (
                      <option key={lga} value={lga}>
                        {lga}
                      </option>
                    ))}
                  </select>
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

              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <h3 className="sm:col-span-2 text-sm font-semibold text-gray-900">
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
                  Priority
                  <select
                    value={form.cargoPriority || "standard"}
                    onChange={(e) =>
                      update(
                        "cargoPriority",
                        e.target.value as NonNullable<
                          ArrangeTransitRequest["cargoPriority"]
                        >,
                      )
                    }
                    disabled={isLoading}
                    className={`${inputClass} mt-1`}
                  >
                    {CARGO_PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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

              <section className="rounded-lg border border-sky-100 bg-sky-50 p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Estimated Pricing
                </h3>
                {estimateLoading && !estimate ? (
                  <p className="mt-2 text-sm text-sky-900">Estimating…</p>
                ) : null}
                {estimateError ? (
                  <p className="mt-2 text-sm text-amber-800">{estimateError}</p>
                ) : null}
                {estimate && totalEstimate != null ? (
                  <div className="mt-3 space-y-3">
                    <p className="text-xs text-sky-800">
                      Estimated from road distance via{" "}
                      {estimate.distanceMethod} + ₦{AGROTRACK_RATE_PER_KG}/kg
                      {estimateLoading ? (
                        <span className="ml-2 font-normal">Updating…</span>
                      ) : null}
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-sky-800">Base rate</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatAgroTrackAmount(String(estimate.baseRate)) ??
                            "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-sky-800">Distance charge</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatAgroTrackAmount(
                            String(estimate.distanceCharge),
                          ) ?? "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-sky-800">Kg charge</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatAgroTrackAmount(String(kgCharge)) ?? "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-sky-800">Distance</p>
                        <p className="text-sm font-medium text-gray-900">
                          {Number.isFinite(estimate.distanceKm)
                            ? `~${estimate.distanceKm.toLocaleString("en-NG")} km`
                            : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-sky-200 pt-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                          Total Estimate
                        </p>
                        <p className="font-semibold text-green text-lg">
                          {formatAgroTrackAmount(String(totalEstimate)) ?? "—"}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-sky-800">
                      Preview only. Final price is set when the shipment is
                      created.
                    </p>
                  </div>
                ) : !estimateLoading && !estimateError ? (
                  <p className="mt-2 text-sm text-sky-900">
                    Select pickup and delivery state and LGA to see an
                    estimate.
                  </p>
                ) : null}
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
