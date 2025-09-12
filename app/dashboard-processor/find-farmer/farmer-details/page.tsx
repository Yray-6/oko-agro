"use client";

import React, { useState } from "react";
import rice from "@/app/assets/images/rice.png";
import cassava from "@/app/assets/images/yam.png";
import maize from "@/app/assets/images/maize.png";
import potato from "@/app/assets/images/potato.png";
import {
  ListNewProductModal,
  SuccessModal,
} from "@/app/components/dashboard/ProductModal";
import DashboardIcon from "@/app/assets/icons/Dashboard";
import ProductCardContainerDetailedProcessor from "@/app/components/dashboad-processor/ProductCardContainerDetaledProcessor";
import Image from "next/image";
import { MapPin } from "lucide-react";
import CalendarViewProcessor from "@/app/components/dashboad-processor/CalendarViewProcessor";

export default function Page() {
  // Modal states
  const [showListProductModal, setShowListProductModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Sample product data
  const sampleProducts = [
    {
      id: 1,
      name: "Long Grain Rice",
      quantity: "500kg",
      price: "₦1,000/kg",
      certification: "Grade A",
      status: "Active" as const,
      listedDate: "08 Aug 2025",
      image: rice.src,
      inventoryStatus: "200/500kg (60% Sold)",
      inventoryPercentage: 60,
      slug: "long-grain-rice",
    },
    {
      id: 2,
      name: "Premium Cassava",
      quantity: "500kg",
      price: "₦1,000/kg",
      certification: "Grade A",
      status: "Pending Inspection" as const,
      listedDate: "08 Aug 2025",
      image: cassava.src,
      inventoryStatus: "Unlisted",
      inventoryPercentage: 0,
      slug: "premium-cassava",
    },
    {
      id: 3,
      name: "Fresh Maize",
      quantity: "2 Tons",
      price: "₦800/kg",
      certification: "Grade A",
      status: "Sold Out" as const,
      listedDate: "08 Aug 2025",
      image: maize.src,
      inventoryStatus: "500/500kg (100% Sold)",
      inventoryPercentage: 100,
      slug: "fresh-maize",
    },
    {
      id: 4,
      name: "Sweet Potato",
      quantity: "300kg",
      price: "₦1,200/kg",
      certification: "Grade A",
      status: "Active" as const,
      listedDate: "07 Aug 2025",
      image: potato.src,
      inventoryStatus: "150/300kg (50% Sold)",
      inventoryPercentage: 50,
      slug: "sweet-potato",
    },
  ];



  const handleListingSuccess = () => {
    setShowSuccessModal(true);
  };

  const closeAllModals = () => {
    setShowListProductModal(false);
    setShowSuccessModal(false);
  };

  return (
    <div>
      <div className="justify-between flex items-center py-4">
        <div className="flex items-center space-x-4 flex-1">
          <Image
            src={rice.src}
            alt={"image"}
            width={64}
            height={64}
            className="rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
          />

          <div className="flex-1 flex-col">
            <h3 className="font-medium text-gray-900  hover:text-blue-600 transition-colors cursor-pointer">
              Pristine Crops and Livestock
            </h3>
            <p className="text-sm text-gray">Oghenevwaire onobrudu</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-[#6B7C5A]" />
              <span className="text-[#6B7C5A]">Lagos,Nigeria</span>
              <span className="bg-[#6B7C5A]/10 text-[#6B7C5A] px-2 py-1 rounded-lg text-xs font-medium">
                25km
              </span>
            </div>
          </div>
        </div>
        <div>
          <button className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm text-mainGreen border border-mainGreen">
            <DashboardIcon color="#004829" size={16} /> Back to Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9">
          <ProductCardContainerDetailedProcessor products={sampleProducts} />
        </div>

        {/* Optional sidebar for additional info */}
        <div className="col-span-12 lg:col-span-3"></div>
      </div>
      <div className="grid grid-cols-4 mt-12">
        <div className="col-span-3">
          <CalendarViewProcessor />
        </div>
      </div>

      {/* Modals */}
      <ListNewProductModal
        isOpen={showListProductModal}
        onClose={() => setShowListProductModal(false)}
        onSuccess={handleListingSuccess}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={closeAllModals}
        title="Success!"
        message="Your action has been completed successfully."
        buttonText="Continue"
      />
    </div>
  );
}
