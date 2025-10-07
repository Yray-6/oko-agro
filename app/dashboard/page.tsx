'use client'
import React, { useState, useEffect } from "react";
import Card from "../components/dashboard/Cards";
import Revenue from "../assets/icons/Revenue";
import Listings from "../assets/icons/Listings";
import ViewOrders from "../assets/icons/ViewOrders";
import Star from "../assets/icons/Star";
import LinkCard from "../components/dashboard/LinkCard";
import FindProcessor from "../assets/icons/FindProcessor";
import Calendar from "../assets/icons/Calendar";
import ProductCardContainer from "../components/dashboard/ProductCardContainer";
import RecentActivity from "../components/dashboard/RecentActivity";
import { ListNewProductModal, SuccessModal } from "@/app/components/dashboard/ProductModal";
import { useProductStore } from "@/app/store/useProductStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import AnimatedLoading from "../Loading";

export default function Page() {
  // Store hooks
  const { products, fetchUserProducts,isLoading,isFetching } = useProductStore();
  const { user } = useAuthStore();
  
  // Modal states
  const [showListProductModal, setShowListProductModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    if (user?.id) {
      fetchUserProducts(user.id).catch(console.error);
    }
  }, [user?.id, fetchUserProducts]);

  // Calculate active listings (you can adjust the logic based on your product status)
  const activeListingsCount = products.length;

  // Calculate inventory percentage (example calculation)
  const inventoryPercentage = products.length > 0 
    ? Math.round((products.reduce((acc, p) => acc + parseFloat(p.quantity || '0'), 0) / products.length) * 100) 
    : 0;

  const handleListNewProduct = () => {
    setShowListProductModal(true);
  };

  const handleListingSuccess = () => {
    setShowSuccessModal(true);
    // Refresh products list
    if (user?.id) {
      fetchUserProducts(user.id).catch(console.error);
    }
  };

  const closeAllModals = () => {
    setShowListProductModal(false);
    setShowSuccessModal(false);
  };

  return (
    <div>
      <div className="text-2xl">Hello, Oghenevwaire</div>
      <div className="grid grid-cols-4 py-4 gap-4">
        <Card
          title="Revenue"
          value="₦250,000"
          subtitle="+12% from last month"
          subtitleColor="text-green"
          iconColor="text-green"
          icon={Revenue}
        />
        <Card
          title="Active Listings"
          value={activeListingsCount.toString()}
          subtitle={`Inventory: ${inventoryPercentage}% left`}
          subtitleColor="text-black"
          iconColor="text-blue"
          icon={Listings}
        />
        <Card
          title="Pending Orders"
          value="3"
          subtitle="Due in 5 days"
          subtitleColor="text-black"
          iconColor="text-yellow"
          icon={ViewOrders}
        />
        <Card
          title="Quality Score"
          value="4.5"
          subtitle="44 Reviews"
          subtitleColor="text-black"
          icon={Star}
        />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9">
          <div className="rounded-lg border border-gray-200 p-2">
            <p className="font-medium mb-2">Quick Actions</p>
            <div className="grid grid-cols-4 gap-2">
              <LinkCard
                title="Find Processors"
                icon={FindProcessor}
                href="/dashboard/find-processor"
              />
              <div onClick={handleListNewProduct} className="cursor-pointer bg-skyBlue text-center  w-full">
                <LinkCard 
                  title="List new product" 
                  icon={Listings} 
                  href="#"
                  className="w-full"
                />
              </div>
              <LinkCard 
                title="View Orders" 
                icon={ViewOrders} 
                href="/dashboard/orders" 
              />
              <LinkCard 
                title="View Schedule" 
                icon={Calendar} 
                href="/dashboard/calendar" 
              />
            </div>
          </div>
          <div className="p-2 mt-3">
            <ProductCardContainer />
          </div>
        </div>
        <div className="col-span-3 rounded-lg border border-gray-200 p-2">
          <RecentActivity />
        </div>
      </div>

      {/* Modals */}
      <ListNewProductModal
        isOpen={showListProductModal}
        onClose={closeAllModals}
        onSuccess={handleListingSuccess}
        editingProduct={null}
        isEditing={false}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={closeAllModals}
        title="Success!"
        message="Product listed successfully!"
        buttonText="Continue"
      />
      {isLoading || isFetching  && <AnimatedLoading/>}
    </div>
  );
}