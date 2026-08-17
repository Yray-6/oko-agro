import React from "react";
import {
  formatAgroTrackAmount,
  formatAgroTrackStatus,
  getAgroTrackStatusBadgeClass,
  hasAgroTrackShippingInfo,
} from "@/app/utils/agrotrackHandoff";

interface AgroTrackShippingInfoProps {
  agroTrackTrackingNumber?: string | null;
  agroTrackStatus?: string | null;
  agroTrackBaseRate?: string | null;
  agroTrackDistanceSurcharge?: string | null;
  agroTrackTotalCost?: string | null;
}

const AgroTrackShippingInfo: React.FC<AgroTrackShippingInfoProps> = ({
  agroTrackTrackingNumber,
  agroTrackStatus,
  agroTrackBaseRate,
  agroTrackDistanceSurcharge,
  agroTrackTotalCost,
}) => {
  const order = {
    agroTrackTrackingNumber,
    agroTrackStatus,
    agroTrackTotalCost,
  };

  if (!hasAgroTrackShippingInfo(order)) {
    return null;
  }

  const totalCost = formatAgroTrackAmount(agroTrackTotalCost);
  const baseRate = formatAgroTrackAmount(agroTrackBaseRate);
  const distanceSurcharge = formatAgroTrackAmount(agroTrackDistanceSurcharge);
  const showBreakdown = !!(baseRate || distanceSurcharge);

  return (
    <div className="mt-6 rounded-lg border border-sky-200 bg-sky-50/60 p-4">
      <h4 className="mb-3 font-medium text-gray-900">AgroTrack Shipping</h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <p className="mb-1 text-sm text-gray-600">Status</p>
          {agroTrackStatus ? (
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getAgroTrackStatusBadgeClass(agroTrackStatus)}`}
            >
              {formatAgroTrackStatus(agroTrackStatus)}
            </span>
          ) : (
            <p className="font-medium text-gray-900">Not linked</p>
          )}
        </div>

        <div>
          <p className="mb-1 text-sm text-gray-600">Shipping Cost</p>
          <p className="font-semibold text-green text-lg">
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
          <p className="mb-1 text-sm text-gray-600">Tracking Number</p>
          <p className="font-medium text-gray-900">
            {agroTrackTrackingNumber ?? "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgroTrackShippingInfo;
