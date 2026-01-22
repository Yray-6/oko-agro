'use client'
import React, { useState, useEffect, useMemo } from "react";
import Card from "../components/dashboard/Cards";
import Revenue from "../assets/icons/Revenue";
import Listings from "../assets/icons/Listings";
import ViewOrders from "../assets/icons/ViewOrders";
import Star from "../assets/icons/Star";
import LinkCard from "../components/dashboard/LinkCard";
import FindProcessor from "../assets/icons/FindProcessor";
import Calendar from "../assets/icons/Calendar";
import RecentActivity from "../components/dashboard/RecentActivity";
import { Plus } from "lucide-react";
import ProductCardContainerProcessor from "../components/dashboad-processor/ProductCardContainerProcessor";
import CreateNewRequestModal from "../components/dashboad-processor/CreateNewRequest";
import { SuccessModal } from "@/app/components/dashboard/ProductModal";
import { useBuyRequestStore } from "../store/useRequestStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import { UserRatingStats } from "@/app/types";
import apiClient from "@/app/utils/apiClient";
import AnimatedLoading from "../Loading";

export default function Page() {
  // Store hooks
  const { myRequests, fetchMyRequests, isFetching, isCreating } = useBuyRequestStore();
  const { user } = useAuthStore();
  
  // Modal states
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; id: string } | null>(null);
  const [qualityScore, setQualityScore] = useState<UserRatingStats | null>(null);

  // Fetch user's buy requests on component mount
  useEffect(() => {
    if (user?.id) {
      fetchMyRequests().catch(console.error);
    }
  }, [user?.id, fetchMyRequests]);

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

  // Calculate active requests count
  // Active requests are those with status 'accepted' or 'active', excluding those with orderState 'completed'
  const activeRequestsCount = myRequests.filter(req => {
    // Exclude if orderState is completed or status is rejected
    if (req.orderState?.toLowerCase() === 'completed') {
      return false;
    }
    const statusLower = req.status.toLowerCase();
    return (statusLower === 'accepted' || statusLower === 'active');
  }).length;

  // Calculate pending orders count
  const pendingOrdersCount = useMemo(() => {
    return myRequests.filter(req => {
      const statusLower = req.status.toLowerCase();
      return statusLower === 'pending' && !req.isGeneral && !req.isDeleted;
    }).length;
  }, [myRequests]);

  // Calculate total expense from completed orders only
  const totalExpense = useMemo(() => {
    const completedOrders = myRequests.filter(req => {
      // Priority: orderState "completed" takes precedence
      if (req.orderState?.toLowerCase() === 'completed') {
        return true;
      }
      const statusLower = req.status.toLowerCase();
      return statusLower === 'completed';
    });

    return completedOrders.reduce((acc, req) => {
      const quantity = parseFloat(req.productQuantity || '0');
      const pricePerUnit = parseFloat(req.pricePerUnitOffer || '0');
      return acc + (quantity * pricePerUnit);
    }, 0);
  }, [myRequests]);

  const handleNewRequestClick = () => {
    setShowCreateRequestModal(true);
  };

  const handleRequestSuccess = () => {
    setShowSuccessModal(true);
    // Refresh requests list
    fetchMyRequests().catch(console.error);
  };

  const closeAllModals = () => {
    setShowCreateRequestModal(false);
    setShowSuccessModal(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      <div className="text-2xl">Hello, {user?.firstName || 'Oghenevwaire'}</div>
      <div className="grid grid-cols-4 py-4 gap-4">
        <Card
          title="Total Expense"
          value={`₦${totalExpense.toLocaleString()}`}
          subtitle="From completed orders"
          subtitleColor="text-green"
          iconColor="text-green"
          icon={Revenue}
        />
        <Card
          title="Active Request"
          value={activeRequestsCount.toString()}
          subtitle={`Total: ${myRequests.length} requests`}
          subtitleColor="text-black"
          iconColor="text-blue"
          icon={Listings}
        />
        <Card
          title="Pending Orders"
          value={pendingOrdersCount.toString()}
          subtitle="Awaiting action"
          subtitleColor="text-black"
          iconColor="text-yellow"
          icon={ViewOrders}
        />
        <Card
          title="Quality Score"
          value={qualityScore && qualityScore.total > 0 ? qualityScore.average.toFixed(1) : 'N/A'}
          subtitle={qualityScore && qualityScore.total > 0 ? `${qualityScore.total} Review${qualityScore.total === 1 ? '' : 's'}` : 'No ratings yet'}
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
                title="Find Farmer"
                icon={FindProcessor}
                href="/dashboard-processor/find-farmer"
              />
     
                <LinkCard 
                  title="New Request" 
                  icon={Plus} 
                  href="#"
                  className="w-full"
                  onClick={handleNewRequestClick}
                />
              
              <LinkCard 
                title="View Orders" 
                icon={ViewOrders} 
                href="/dashboard-processor/orders" 
              />
              <LinkCard 
                title="View Schedule" 
                icon={Calendar} 
                href="/dashboard-processor/calendar" 
              />
            </div>
          </div>
          <div className="p-2 mt-3">
            <ProductCardContainerProcessor />
          </div>
        </div>
        <div className="col-span-3 rounded-lg border border-gray-200 p-2">
          <RecentActivity />
        </div>
      </div>

      {/* Create New Request Modal */}
      <CreateNewRequestModal
        isOpen={showCreateRequestModal}
        onClose={closeAllModals}
        onSuccess={handleRequestSuccess}
        productName={selectedProduct?.name}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={closeAllModals}
        title="Success!"
        message="Buy request created successfully!"
        buttonText="Continue"
      />

      {/* Loading Overlay */}
      {(isFetching || isCreating) && <AnimatedLoading />}
    </div>
  );
}