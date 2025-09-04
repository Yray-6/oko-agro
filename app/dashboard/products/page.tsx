'use client'
import TransactionHistory from "@/app/assets/icons/TransactionHistory";
import ProductCardContainerDetailed from "@/app/components/dashboard/ProductCardContainerDetailed";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import rice from '@/app/assets/images/rice.png'
import cassava from '@/app/assets/images/yam.png'
import maize from '@/app/assets/images/maize.png'
import potato from '@/app/assets/images/potato.png'
import { ListNewProductModal,SuccessModal } from "@/app/components/dashboard/ProductModal";

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
      slug: "long-grain-rice"
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
      slug: "premium-cassava"
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
      slug: "fresh-maize"
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
      slug: "sweet-potato"
    }
  ];

  // Handler functions
  const handleEditListing = (productId: number) => {
    console.log("Edit listing for product:", productId);
    // Add your edit logic here
    // For now, show success modal as demonstration
    setShowSuccessModal(true);
  };

  const handleSuspendListing = (productId: number) => {
    console.log("Suspend listing for product:", productId);
    // Add your suspend logic here
    setShowSuccessModal(true);
  };

  const handleCancelListing = (productId: number) => {
    console.log("Cancel listing for product:", productId);
    // Add your cancel logic here
    setShowSuccessModal(true);
  };

  const handleAddNewListing = () => {
    setShowListProductModal(true);
  };

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
        <div>
          <p className="font-medium text-lg">My Products</p>
          <p className="text-sm">
            View, add, and modify information on product listings
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm text-mainGreen border border-mainGreen">
            <TransactionHistory color="#004829" size={16} /> View Orders
          </button>
          <button 
            onClick={handleAddNewListing}
            className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm  bg-mainGreen text-white hover:bg-mainGreen/90 transition-colors"
          >
            <PlusIcon color="white" size={16} /> Add New Listing
          </button>
        </div>
      </div>
             
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9">
          <ProductCardContainerDetailed
            products={sampleProducts}
            onEditListing={handleEditListing}
            onSuspendListing={handleSuspendListing}
            onCancelListing={handleCancelListing}
          />
        </div>
                 
        {/* Optional sidebar for additional info */}
        <div className="col-span-12 lg:col-span-3">
               
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