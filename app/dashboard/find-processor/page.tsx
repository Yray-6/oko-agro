import DashboardIcon from "@/app/assets/icons/Dashboard";
import ProcessorMatchingUI from "@/app/components/dashboard/ProcessorMatchingUi";
import SearchBar from "@/app/components/forms/ProcessorSearch";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="justify-between flex items-center py-4">
        <div>
          <p className="font-medium text-lg">Find Processors</p>
          <p className="text-sm">
            Connect with processors looking for your crops
          </p>
        </div>
        <div>
          <button className="flex gap-2 items-center cursor-pointer px-4 py-2 rounded-lg text-sm text-mainGreen border border-mainGreen">
            <DashboardIcon color="#004829" size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
      <div>
        <SearchBar />
      </div>
      <div className="grid grid-cols-12 gap-4 mt-4 ">
        <div className="col-span-9">
          <ProcessorMatchingUI />
        </div>
        <div className="col-span-3 flex flex-col gap-3 mt-10">
          <div className="flex justify-center items-center flex-col border border-[#6B7C5A]/50 text-[#6B7C5A] rounded-xl py-4 w-full">
            <p className="text-mainGreen text-lg font-medium ">4</p>
            <p className="text-xs">Perfect Matches</p>
          </div>
          <div className="flex justify-center items-center flex-col border border-[#6B7C5A]/50 text-[#6B7C5A] rounded-xl py-4 w-full">
            <p className="text-mainGreen text-lg font-medium ">6</p>
            <p className="text-xs">Active Requests</p>
          </div>
          <div className="flex justify-center items-center flex-col border border-[#6B7C5A]/50 text-[#6B7C5A] rounded-xl py-4 w-full">
            <p className="text-mainGreen text-lg font-medium ">₦1,200</p>
            <p className="text-xs">Top Prize/kg</p>
          </div>
        </div>
      </div>
    </div>
  );
}
