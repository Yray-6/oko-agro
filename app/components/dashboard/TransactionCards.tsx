import Revenue from "@/app/assets/icons/Revenue";
import { Box, Shell } from "lucide-react";
import React from "react";

export default function TransactionCards() {
  return (
    <div className="my-5 grid grid-cols-3 gap-4 ">
      <div
        className={`bg-white rounded-lg col-span-1 border border-gray-100 p-4 hover:shadow-sm  duration-200 `}
      >
        {/* Header with title and icon */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-black">Revenue till date</h3>
          <Revenue />
        </div>

        {/* Main value */}
        <div className="mb-2">
          <span className="text-2xl  text-gray">₦ 10,450,000</span>
        </div>

        {/* Subtitle with customizable color */}
        <div className={`text-xs text-green`}>12 Orders</div>
      </div>
      <div
        className={`bg-white rounded-lg col-span-1 border border-gray-100 p-4 hover:shadow-sm  duration-200 `}
      >
        {/* Header with title and icon */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-black">This Month</h3>
          <Box className="text-[#0B99A9]" />
        </div>

        {/* Main value */}
        <div className="mb-2">
          <span className="text-2xl  text-gray">₦ 2,150,000</span>
        </div>

        {/* Subtitle with customizable color */}
        <div className={`text-xs text-green`}>+28% vs Last Month</div>
      </div>
      <div
        className={`bg-yellow/5 rounded-lg col-span-1 border border-gray-100 p-4 hover:shadow-sm  duration-200 `}
      >
        {/* Header with title and icon */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-black">Pending Payment</h3>
          <Shell className="text-[#DEB200]" />
        </div>

        {/* Main value */}
        <div className="mb-2">
          <span className="text-2xl  text-[#DEB200]">₦850,000</span>
        </div>
        <div className=" flex justify-between items-center">
          <div className={`text-xs`}>2 Active Orders</div>
          <div className="text-xs text-[#DEB200]">View Orders</div>
        </div>
      </div>
    </div>
  );
}
