"use client";

import React from "react";
import { ChevronDown, Truck } from "lucide-react";
import {
  canArrangeAgroTrackTransit,
  canCancelAgroTrackTransit,
  formatAgroTrackAmount,
  formatAgroTrackStatus,
  getAgroTrackStatusBadgeClass,
} from "@/app/utils/agrotrackHandoff";

export interface AgroTrackShippingFields {
  agroTrackTrackingNumber?: string | null;
  agroTrackStatus?: string | null;
  agroTrackBaseRate?: string | null;
  agroTrackDistanceSurcharge?: string | null;
  agroTrackTotalCost?: string | null;
}

interface AgroTrackShippingChipProps {
  expanded: boolean;
  onToggle: () => void;
}

/** White chip trigger for the mint stats strip. */
export const AgroTrackShippingChip: React.FC<AgroTrackShippingChipProps> = ({
  expanded,
  onToggle,
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-expanded={expanded}
    className="inline-flex shrink-0 items-center gap-2 rounded-[9px] bg-white px-3.5 py-2 text-sm text-black shadow-[0_0_1px_rgba(0,0,0,0.25)] transition-shadow hover:shadow-[0_0_2px_rgba(0,0,0,0.3)]"
  >
    <Truck className="h-[18px] w-[18px] shrink-0 text-black" strokeWidth={1.75} />
    <span>AgroTrack Shipping</span>
    <ChevronDown
      className={`h-3.5 w-3.5 shrink-0 text-black transition-transform duration-200 ${
        expanded ? "rotate-180" : ""
      }`}
      strokeWidth={2}
    />
  </button>
);

interface AgroTrackShippingPanelProps extends AgroTrackShippingFields {
  expanded: boolean;
  onRequestShipment?: () => void;
  onTrackShipment?: () => void;
  onCancelShipment?: () => void;
}

/** Expandable details panel that sits under the mint stats strip. */
export const AgroTrackShippingPanel: React.FC<AgroTrackShippingPanelProps> = ({
  expanded,
  agroTrackTrackingNumber,
  agroTrackStatus,
  agroTrackBaseRate,
  agroTrackDistanceSurcharge,
  agroTrackTotalCost,
  onRequestShipment,
  onTrackShipment,
  onCancelShipment,
}) => {
  if (!expanded) return null;

  const isAssigned = !canArrangeAgroTrackTransit(
    agroTrackTrackingNumber,
    agroTrackStatus,
  );
  const totalCost = formatAgroTrackAmount(agroTrackTotalCost);
  const baseRate = formatAgroTrackAmount(agroTrackBaseRate);
  const distanceSurcharge = formatAgroTrackAmount(agroTrackDistanceSurcharge);
  const showBreakdown = !!(baseRate || distanceSurcharge);
  const canCancel =
    !!agroTrackTrackingNumber &&
    !!onCancelShipment &&
    canCancelAgroTrackTransit(agroTrackStatus);

  return (
    <div className="rounded-b-[20px] bg-white px-6 pb-6 pt-4 shadow-[0_0_1px_rgba(0,0,0,0.25)] sm:px-10">
      <h4 className="text-sm font-semibold text-mainGreen">
        AgroTrack Shipping Details
      </h4>

      {isAssigned ? (
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <p className="mb-2 text-sm text-[#5C5C5C]">Status</p>
              {agroTrackStatus ? (
                <span
                  className={`inline-flex rounded-full px-3 py-0.5 text-xs font-medium ${
                    agroTrackStatus.toLowerCase() === "assigned"
                      ? "bg-[#EEC41E] text-white"
                      : getAgroTrackStatusBadgeClass(agroTrackStatus)
                  }`}
                >
                  {formatAgroTrackStatus(agroTrackStatus)}
                </span>
              ) : (
                <p className="text-base text-black">Not linked</p>
              )}
            </div>

            <div>
              <p className="mb-2 text-sm text-[#5C5C5C]">Shipping Cost</p>
              <p className="text-base font-medium text-green">
                {totalCost ?? "Pending"}
              </p>
              {showBreakdown && totalCost ? (
                <p className="mt-1 text-xs text-gray-500">
                  {baseRate ? `Base ${baseRate}` : null}
                  {baseRate && distanceSurcharge ? " · " : null}
                  {distanceSurcharge ? `Distance ${distanceSurcharge}` : null}
                </p>
              ) : null}
            </div>

            <div>
              <p className="mb-2 text-sm text-[#5C5C5C]">Tracking Number</p>
              <p className="text-base text-black">
                {agroTrackTrackingNumber ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
            {onTrackShipment && agroTrackTrackingNumber ? (
              <button
                type="button"
                onClick={onTrackShipment}
                className="inline-flex items-center justify-center gap-2 rounded-[9px] border border-[#17A266] bg-white px-4 py-2 text-sm font-medium text-[#188153] shadow-[0_0_1px_rgba(0,0,0,0.25)] transition-colors hover:bg-green-50"
              >
                <Truck className="h-[18px] w-[18px]" strokeWidth={1.75} />
                Track Shipment
              </button>
            ) : null}
            {canCancel ? (
              <button
                type="button"
                onClick={onCancelShipment}
                className="inline-flex items-center justify-center gap-2 rounded-[9px] border border-[#B41717] bg-white px-4 py-2 text-sm font-medium text-[#CD0003] shadow-[0_0_1px_rgba(0,0,0,0.25)] transition-colors hover:bg-red-50"
              >
                Cancel Shipment
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-4">
          <p className="max-w-3xl text-sm text-black">
            This order is currently not assigned to AgroTrack for shipping.
            Would you like to create a shipping request for this order with
            AgroTrack?
          </p>
          {onRequestShipment ? (
            <button
              type="button"
              onClick={onRequestShipment}
              className="inline-flex items-center justify-center gap-2 rounded-[9px] border border-[#17A266] bg-white px-4 py-2 text-sm font-medium text-[#188153] shadow-[0_0_1px_rgba(0,0,0,0.25)] transition-colors hover:bg-green-50"
            >
              <Truck className="h-[18px] w-[18px]" strokeWidth={1.75} />
              Yes, Request Shipment
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

/** Whether the AgroTrack shipping chip should appear on an order card. */
export function shouldShowAgroTrackShipping(order: {
  orderState?: string;
  agroTrackTrackingNumber?: string | null;
  agroTrackStatus?: string | null;
  agroTrackTotalCost?: string | null;
  status?: string;
}): boolean {
  if (
    order.agroTrackTrackingNumber ||
    order.agroTrackStatus ||
    order.agroTrackTotalCost
  ) {
    return true;
  }
  const state = order.orderState?.toLowerCase();
  if (
    state === "awaiting_shipping" ||
    state === "in_transit" ||
    state === "delivered"
  ) {
    return true;
  }
  // Active accepted orders without state still get the chip so users can request
  if (order.status === "Active") return true;
  return false;
}

/** @deprecated Use AgroTrackShippingChip + AgroTrackShippingPanel */
const AgroTrackShippingInfo = AgroTrackShippingPanel;
export default AgroTrackShippingInfo;
