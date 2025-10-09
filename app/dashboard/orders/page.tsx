"use client";
import Orders from "@/app/components/dashboard/Orders";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import rice from "@/app/assets/images/rice.png";
import cassava from "@/app/assets/images/yam.png";
import maize from "@/app/assets/images/maize.png";
import potato from "@/app/assets/images/potato.png";
import Card from "@/app/components/dashboard/Cards";
import ViewOrders from "@/app/assets/icons/ViewOrders";
import OrderCard from "@/app/components/dashboard/OrderCard";
import Tick from "@/app/assets/icons/Tick";
import Truck from "@/app/assets/icons/Truck";
import Package from "@/app/assets/icons/Package";
import Link from "next/link";
import { useBuyRequestStore } from "@/app/store/useRequestStore";
import { BuyRequest } from "@/app/types";

// Helper function to get product image based on crop type
const getProductImage = (cropName: string): string => {
  const cropNameLower = cropName.toLowerCase();
  if (cropNameLower.includes("rice")) return rice.src;
  if (cropNameLower.includes("cassava") || cropNameLower.includes("yam")) return cassava.src;
  if (cropNameLower.includes("maize") || cropNameLower.includes("corn")) return maize.src;
  if (cropNameLower.includes("potato")) return potato.src;
  return rice.src; // Default image
};

// Helper function to convert BuyRequest to Order format for seller
const convertBuyRequestToOrder = (buyRequest: BuyRequest) => {
  const statusMap: { [key: string]: "Pending" | "Active" | "Completed" } = {
    pending: "Pending",
    accepted: "Active",
    active: "Active",
    completed: "Completed",
    rejected: "Completed",
    cancelled: "Completed"
  };

  return {
    id: buyRequest.requestNumber.toString(),
    buyRequestId: buyRequest.id, // Store the actual ID for API calls
    productName: buyRequest.cropType.name,
    quantity: `${buyRequest.productQuantity}${buyRequest.productQuantityUnit}`,
    price: `₦${buyRequest.pricePerUnitOffer}/${buyRequest.productQuantityUnit}`,
    certification: buyRequest.qualityStandardType.name,
    status: statusMap[buyRequest.status.toLowerCase()] || "Pending",
    createdDate: new Date(buyRequest.createdAt).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    deliveryDate: new Date(buyRequest.estimatedDeliveryDate).toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }),
    orderValue: `₦${(parseFloat(buyRequest.pricePerUnitOffer) * parseFloat(buyRequest.productQuantity)).toLocaleString()}`,
    paymentTerms: buyRequest.preferredPaymentMethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    buyerName: buyRequest.buyer.companyName || `${buyRequest.buyer.firstName} ${buyRequest.buyer.lastName}`,
    buyerLocation: buyRequest.deliveryLocation || `${buyRequest.buyer.state}, ${buyRequest.buyer.country}`,
    productImage: getProductImage(buyRequest.cropType.name),
    originalStatus: buyRequest.status,
  };
};

export default function Page() {
  const { 
    myRequests, 
    fetchMyRequests, 
    updateBuyRequestStatus,
    isFetching,
    isUpdating
  } = useBuyRequestStore();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    totalValue: 0,
    completed: 0,
    active: 0,
    pending: 0
  });

  // Fetch buy requests on component mount
  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  // Convert buy requests to orders format and calculate stats
  useEffect(() => {
    if (myRequests.length > 0) {
      // Filter out general requests since seller only sees requests sent to them
      const nonGeneralRequests = myRequests.filter(req => !req.isGeneral && !req.isDeleted);
      const convertedOrders = nonGeneralRequests.map(convertBuyRequestToOrder);
      
      setOrders(convertedOrders);

      // Calculate statistics
      const totalValue = nonGeneralRequests.reduce((sum, req) => {
        return sum + (parseFloat(req.pricePerUnitOffer) * parseFloat(req.productQuantity));
      }, 0);

      const completed = nonGeneralRequests.filter(req => {
        const statusLower = req.status.toLowerCase();
        return statusLower === 'completed' || statusLower === 'rejected' || statusLower === 'cancelled';
      }).length;

      const active = nonGeneralRequests.filter(req => {
        const statusLower = req.status.toLowerCase();
        return statusLower === 'accepted' || statusLower === 'active';
      }).length;

      const pending = nonGeneralRequests.filter(req => 
        req.status.toLowerCase() === 'pending'
      ).length;

      setStats({
        total: nonGeneralRequests.length,
        totalValue,
        completed,
        active,
        pending
      });
    } else {
      setStats({
        total: 0,
        totalValue: 0,
        completed: 0,
        active: 0,
        pending: 0
      });
    }
  }, [myRequests]);

  // Order action handlers
  const handleAcceptOrder = async (orderId: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        await updateBuyRequestStatus({
          buyRequestId: order.buyRequestId,
          status: 'accepted', // Set status to active/accepted
        });
        // Refresh the list
        await fetchMyRequests();
      }
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const handleDeclineOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to decline this order?")) {
      try {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          await updateBuyRequestStatus({
            buyRequestId: order.buyRequestId,
            status: 'rejected',
          });
          // Refresh the list
          await fetchMyRequests();
        }
      } catch (error) {
        console.error("Error declining order:", error);
      }
    }
  };

  const handleViewProfile = (orderId: string) => {
    console.log("Viewing buyer profile for order:", orderId);
    const buyRequest = myRequests.find(req => req.requestNumber.toString() === orderId);
    if (buyRequest) {
      const profileId = buyRequest.buyer.id;
      // router.push(`/profile/${profileId}`)
      console.log("Buyer Profile ID:", profileId);
    }
  };

  const handleMessage = (orderId: string) => {
    console.log("Opening message for order:", orderId);
    // Implement messaging functionality
    // e.g., open chat modal or navigate to messages
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainGreen mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="justify-between flex items-center py-4">
        <div>
          <p className="font-medium text-lg">Orders</p>
          <p className="text-sm text-gray-600">
            Track and manage your product orders
          </p>
        </div>
        <div>
          <Link href={'/dashboard/products'}>
            <button className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm text-white bg-mainGreen hover:bg-green-600 transition-colors">
              <Plus color="white" size={16} />
              Add new Listing
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9">
          {isUpdating ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainGreen mx-auto"></div>
              <p className="mt-4 text-gray-600">Processing...</p>
            </div>
          ) : (
            <Orders
              orders={orders}
              onAcceptOrder={handleAcceptOrder}
              onDeclineOrder={handleDeclineOrder}
              onViewProfile={handleViewProfile}
              onMessage={handleMessage}
            />
          )}
        </div>
        <div className="col-span-3 space-y-2 mt-10">
          <Card
            title="Total Orders"
            value={stats.total.toString()}
            subtitle={`Value: ₦${stats.totalValue.toLocaleString()}`}
            subtitleColor="text-black"
            iconColor="text-mainGreen"
            icon={ViewOrders}
          />
          <OrderCard 
            text="Completed Orders" 
            count={stats.completed} 
            icon={Tick} 
            iconColor="#0BA964" 
            bgColor="bg-green/10" 
          />
          <OrderCard 
            text="Active Orders" 
            count={stats.active} 
            icon={Truck}
            iconColor="#0B99A9" 
            bgColor="bg-skyBlue" 
          />
          <OrderCard 
            text="Pending Orders" 
            count={stats.pending} 
            icon={Package} 
            iconColor="#FFDD55" 
            bgColor="bg-yellow/10" 
          />
        </div>
      </div>
    </div>
  );
}