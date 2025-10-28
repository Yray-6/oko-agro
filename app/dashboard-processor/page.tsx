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
import RecentActivity from "../components/dashboard/RecentActivity";
import { Plus } from "lucide-react";
import ProductCardContainerProcessor from "../components/dashboad-processor/ProductCardContainerProcessor";
import CreateNewRequestModal from "../components/dashboad-processor/CreateNewRequest";
import { SuccessModal } from "@/app/components/dashboard/ProductModal";
import { useBuyRequestStore } from "../store/useRequestStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import AnimatedLoading from "../Loading";

export default function Page() {
  // Store hooks
  const { myRequests, fetchMyRequests, isFetching, isCreating } = useBuyRequestStore();
  const { user } = useAuthStore();
  
  // Modal states
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; id: string } | null>(null);

  // Fetch user's buy requests on component mount
  useEffect(() => {
    if (user?.id) {
      fetchMyRequests().catch(console.error);
    }
  }, [user?.id, fetchMyRequests]);

  // Calculate active requests count
  const activeRequestsCount = myRequests.filter(req => req.status === 'pending').length;

  // Calculate total expense (sum of all request prices)
  const totalExpense = myRequests.reduce((acc, req) => {
    const quantity = parseFloat(req.productQuantity || '0');
    const pricePerUnit = parseFloat(req.pricePerUnitOffer || '0');
    return acc + (quantity * pricePerUnit);
  }, 0);

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
          title="Expense"
          value={`₦${totalExpense.toLocaleString()}`}
          subtitle="+12% from last month"
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