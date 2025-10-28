"use client";
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
import OrdersProcessorWithInvoice from "@/app/components/dashboad-processor/OrdersProcessor";
import { useBuyRequestStore } from "@/app/store/useRequestStore";
import { BuyRequest } from "@/app/types";
import CreateNewRequestModal from "@/app/components/dashboad-processor/CreateNewRequest";
import { SuccessModal } from "@/app/components/dashboard/ProductModal";
import AnimatedLoading from "@/app/Loading";
import { showToast } from "@/app/hooks/useToast";

// Helper function to get product image based on crop type
const getProductImage = (cropName: string): string => {
  const cropNameLower = cropName.toLowerCase();
  if (cropNameLower.includes("rice")) return rice.src;
  if (cropNameLower.includes("cassava") || cropNameLower.includes("yam")) return cassava.src;
  if (cropNameLower.includes("maize") || cropNameLower.includes("corn")) return maize.src;
  if (cropNameLower.includes("potato")) return potato.src;
  return rice.src; // Default image
};

// Helper function to convert BuyRequest to Order format
const convertBuyRequestToOrder = (buyRequest: BuyRequest) => {
  // Determine the tab category based on isGeneral and status
  let status: "Pending" | "Active" | "Completed" | "MyRequest";
  
  if (buyRequest.isGeneral) {
    status = "MyRequest";
  } else {
    const statusLower = buyRequest.status.toLowerCase();
    if (statusLower === 'pending') {
      status = "Pending";
    } else if (statusLower === 'accepted' || statusLower === 'active') {
      status = "Active";
    } else if (statusLower === 'completed' || statusLower === 'rejected' || statusLower === 'cancelled') {
      status = "Completed";
    } else {
      status = "Pending";
    }
  }

  return {
    id: buyRequest.requestNumber.toString(),
    buyRequestId: buyRequest.id, // Store the actual ID for API calls
    productName: buyRequest.cropType.name,
    quantity: `${buyRequest.productQuantity}${buyRequest.productQuantityUnit}`,
    price: `₦${buyRequest.pricePerUnitOffer}/${buyRequest.productQuantityUnit}`,
    certification: buyRequest.qualityStandardType.name,
    status: status as "Pending" | "Active" | "Completed",
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
    buyerName: buyRequest.seller 
      ? `${buyRequest.seller.firstName} ${buyRequest.seller.lastName}` 
      : buyRequest.buyer.companyName || `${buyRequest.buyer.firstName} ${buyRequest.buyer.lastName}`,
    buyerLocation: buyRequest.deliveryLocation || `${buyRequest.buyer.state}, ${buyRequest.buyer.country}`,
    productImage: getProductImage(buyRequest.cropType.name),
    isGeneral: buyRequest.isGeneral,
    originalStatus: buyRequest.status
  };
};

export default function Page() {
  const { 
    myRequests, 
    fetchMyRequests, 
    isFetching,
    deleteBuyRequest,
    isDeleting,
    updateBuyRequest,
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

  // Modal states
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [editingBuyRequest, setEditingBuyRequest] = useState<BuyRequest | null>(null);

  // Fetch buy requests on component mount
  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  // Convert buy requests to orders format and calculate stats
  useEffect(() => {
    if (myRequests.length > 0) {
      const convertedOrders = myRequests
        .filter(req => !req.isDeleted)
        .map(convertBuyRequestToOrder);
      
      setOrders(convertedOrders);

      // Calculate statistics
      const totalValue = myRequests.reduce((sum, req) => {
        return sum + (parseFloat(req.pricePerUnitOffer) * parseFloat(req.productQuantity));
      }, 0);

      const completed = myRequests.filter(req => 
        req.status.toLowerCase() === 'completed' || 
        req.status.toLowerCase() === 'rejected'
      ).length;

      const active = myRequests.filter(req => 
        req.status.toLowerCase() === 'accepted' || 
        req.status.toLowerCase() === 'active'
      ).length;

      const pending = myRequests.filter(req => 
        req.status.toLowerCase() === 'pending'
      ).length;

      setStats({
        total: myRequests.length,
        totalValue,
        completed,
        active,
        pending
      });
    }
  }, [myRequests]);

  // Edit request handler - for "My Requests" tab
  const handleAcceptOrder = (orderId: string) => {
    console.log("Editing order:", orderId);
    // Navigate to edit page or open edit modal
    // You can use router.push(`/dashboard/edit-request/${orderId}`)
  };

  const handleEditRequest = (orderId: string) => {
    console.log("Editing order:", orderId);
    
    // Find the buy request by order ID
    const buyRequest = myRequests.find(req => req.requestNumber.toString() === orderId);
    
    if (buyRequest) {
      setEditingBuyRequest(buyRequest);
      setShowCreateRequestModal(true);
    } else {
      showToast("Request not found", "error");
    }
  };


  // Cancel/Delete request handler
  const handleDeclineOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this request?")) {
      try {
        const buyRequest = myRequests.find(req => req.requestNumber.toString() === orderId);
        if (buyRequest) {
          await deleteBuyRequest(buyRequest.id);
        }
      } catch (error) {
        console.error("Error deleting request:", error);
      }
    }
  };

  // Make payment handler - for Active orders (DUMMY IMPLEMENTATION)
  const handleMakePayment = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // This is a dummy implementation - replace with actual payment integration
      showToast(`Payment initiated for Order #${orderId}`, 'info');
      console.log("Processing payment for order:", {
        orderId: orderId,
        buyRequestId: order.buyRequestId,
        amount: order.orderValue,
        paymentMethod: order.paymentTerms
      });
      
      // Simulate payment processing
      setTimeout(() => {
        showToast('Payment processing... (This is a dummy implementation)', 'success');
      }, 1000);
      
      // TODO: Real implementation steps:
      // 1. Open payment modal/gateway (Paystack, Flutterwave, etc.)
      // 2. Process payment through your payment provider
      // 3. Update order status to 'paid' or 'completed'
      // 4. Call API to mark payment complete
      // 5. Refresh the orders list
      
      // Example for real implementation:
      // openPaymentModal({
      //   amount: parseFloat(order.orderValue.replace(/[₦,]/g, '')),
      //   orderId: order.buyRequestId,
      //   onSuccess: async () => {
      //     await updateOrderStatus(order.buyRequestId, 'paid');
      //     await fetchMyRequests();
      //   }
      // });
    }
  };

  const handleViewProfile = (orderId: string) => {
    console.log("Viewing buyer/seller profile for order:", orderId);
    const buyRequest = myRequests.find(req => req.requestNumber.toString() === orderId);
    if (buyRequest) {
      const profileId = buyRequest.seller?.id || buyRequest.buyer.id;
      // router.push(`/profile/${profileId}`)
      console.log("Profile ID:", profileId);
    }
  };

  const handleMessage = (orderId: string) => {
    console.log("Opening message for order:", orderId);
    // Implement messaging functionality
    // e.g., open chat modal or navigate to messages
  };

  const handleNewRequestClick = () => {
    setEditingBuyRequest(null);
    setShowCreateRequestModal(true);
  };

  const handleRequestSuccess = () => {
    setShowSuccessModal(true);
    // Refresh requests list
    fetchMyRequests();
  };

  const closeAllModals = () => {
    setShowCreateRequestModal(false);
    setShowSuccessModal(false);
  };

  if (isFetching) {
    return (
      <AnimatedLoading/>
    );
  }

  return (
    <div>
      <div className="justify-between flex items-center py-4">
        <div>
          <p className="font-medium text-lg">Orders & Requests</p>
          <p className="text-sm text-gray-600">
            Track and manage your product orders
          </p>
        </div>
        <div>
          <button 
            onClick={handleNewRequestClick}
            className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm text-white bg-mainGreen hover:bg-mainGreen/90 transition-colors"
          >
            <Plus color="white" size={16} />
            New Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9">
          {isDeleting ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainGreen mx-auto"></div>
              <p className="mt-4 text-gray-600">Processing...</p>
            </div>
          ) : (
            <OrdersProcessorWithInvoice
              orders={orders}
              onAcceptOrder={handleAcceptOrder}
              onEditRequest={handleEditRequest}
              onDeclineOrder={handleDeclineOrder}
              onViewProfile={handleViewProfile}
              onMessage={handleMessage}
              onMakePayment={handleMakePayment}
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

      {/* Create New Request Modal */}
      <CreateNewRequestModal
        isOpen={showCreateRequestModal}
        onClose={closeAllModals}
        onSuccess={handleRequestSuccess}
        buyRequest={editingBuyRequest} 
      />

      {/* Success Modal */}
    <SuccessModal
        isOpen={showSuccessModal}
        onClose={closeAllModals}
        title="Success!"
        message={editingBuyRequest ? "Buy request updated successfully!" : "Buy request created successfully!"}
        buttonText="Continue"
      />
    </div>
  );
}