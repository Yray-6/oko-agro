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
import { useBuyRequestStore } from "@/app/store/useRequestStore";
import { UserRatingStats } from "@/app/types";
import apiClient from "@/app/utils/apiClient";
import AnimatedLoading from "../Loading";

export default function Page() {
  // Store hooks
  const { products, fetchUserProducts,isLoading,isFetching } = useProductStore();
  const { user } = useAuthStore();
  const { myRequests, fetchMyRequests } = useBuyRequestStore();
  
  // State for quality score
  const [qualityScore, setQualityScore] = useState<UserRatingStats | null>(null);
  
  // Modal states
  const [showListProductModal, setShowListProductModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch products and orders on component mount
  useEffect(() => {
    if (user?.id) {
      fetchUserProducts(user.id).catch(console.error);
      fetchMyRequests().catch(console.error);
    }
  }, [user?.id, fetchUserProducts, fetchMyRequests]);

  // Fetch quality score (ratings) for the user
  useEffect(() => {
    const fetchQualityScore = async () => {
      if (!user?.id) return;
      
      try {
        const response = await apiClient.get<{ statusCode: number; message: string; data: UserRatingStats }>(
          `/ratings?userId=${user.id}`
        );
        if (response.data.statusCode === 200 && response.data.data) {
          setQualityScore(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch quality score:', error);
        // Silently fail - user might not have ratings yet
      }
    };

    fetchQualityScore();
  }, [user?.id]);

  // Calculate active listings
  const activeListingsCount = products.length;

  // Calculate inventory percentage
  const inventoryPercentage = products.length > 0 
    ? Math.round((products.reduce((acc, p) => acc + parseFloat(p.quantityKg || '0'), 0) / products.length) * 100) 
    : 0;

  // Calculate revenue from completed orders
  const revenue = React.useMemo(() => {
    if (!myRequests || myRequests.length === 0) return 0;
    
    // Filter out general requests and deleted requests
    const nonGeneralRequests = myRequests.filter(req => !req.isGeneral && !req.isDeleted);
    
    // Get completed orders
    const completedOrders = nonGeneralRequests.filter(req => {
      // Priority: orderState "completed" takes precedence over status
      if (req.orderState?.toLowerCase() === 'completed') {
        return true;
      }
      const statusLower = req.status.toLowerCase();
      return statusLower === 'completed' || statusLower === 'cancelled';
    });
    
    // Sum up revenue from completed orders
    return completedOrders.reduce((sum, req) => {
      const quantity = parseFloat(req.productQuantityKg || '0');
      const pricePerKg = parseFloat(req.pricePerKgOffer || '0');
      return sum + (quantity * pricePerKg);
    }, 0);
  }, [myRequests]);

  // Calculate pending orders count
  const pendingOrdersCount = React.useMemo(() => {
    if (!myRequests || myRequests.length === 0) return 0;
    
    // Filter out general requests and deleted requests
    const nonGeneralRequests = myRequests.filter(req => !req.isGeneral && !req.isDeleted);
    
    // Count pending orders
    return nonGeneralRequests.filter(req => 
      req.status.toLowerCase() === 'pending'
    ).length;
  }, [myRequests]);

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
      <div className="text-2xl">Hello, {user?.firstName || 'Oghenevwaire'}</div>
      <div className="grid grid-cols-4 py-4 gap-4">
        <Card
          title="Revenue"
          value={`₦${revenue.toLocaleString()}`}
          subtitle="From completed orders"
          subtitleColor="text-green"
          iconColor="text-green"
          icon={Revenue}
        />
        <Card
          title="Active Listings"
          value={activeListingsCount.toString()}
          subtitle={`Inventory`}
          subtitleColor="text-black"
          iconColor="text-blue"
          icon={Listings}
        />
        <Card
          title="Pending Orders"
          value={pendingOrdersCount.toString()}
          subtitle={pendingOrdersCount === 1 ? "1 pending order" : `${pendingOrdersCount} pending orders`}
          subtitleColor="text-black"
          iconColor="text-yellow"
          icon={ViewOrders}
        />
        <Card
          title="Quality Score"
          value={qualityScore && qualityScore.total > 0 ? qualityScore.average.toFixed(1) : "N/A"}
          subtitle={qualityScore && qualityScore.total > 0 ? `${qualityScore.total} Review${qualityScore.total === 1 ? '' : 's'}` : "No ratings yet"}
          subtitleColor="text-black"
          icon={Star}
        />
      </div>
   
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9">
          <div className="rounded-lg border border-gray-200 p-2">
            <p className="font-medium mb-2">Quick Actions</p>
            <div className="grid grid-cols-5 gap-2">
              <LinkCard
                title="Find Processors"
                icon={FindProcessor}
                href="/dashboard/find-processor"
              />
              
                <LinkCard 
                  title="List new product" 
                  icon={Listings} 
                  href="#"
                  className="w-full"
                  onClick={handleListNewProduct}
                />
  
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
              <LinkCard 
                title="Marketplace" 
                icon={ViewOrders} 
                href="/dashboard/marketplace" 
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