"use client";
import Orders from "@/app/components/dashboard/Orders";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useBuyRequestStore } from "@/app/store/useRequestStore";
import { BuyRequest, OrderState } from "@/app/types";
import AnimatedLoading from "@/app/Loading";
import { showToast } from "@/app/hooks/useToast";
import ConfirmationModal from "@/app/components/dashboard/ConfirmationModal";
import RatingModal from "@/app/components/dashboard/RatingModal";
import DisputeModal from "@/app/components/dashboard/DisputeModal";
import LinkTrackingModal from "@/app/components/dashboard/LinkTrackingModal";
import { XCircle } from "lucide-react";
import { formatQuantity } from "@/app/helpers";
import {
  normalizeTrackingNumber,
  openAgroTrackHandoff,
  openAgroTrackTrack,
} from "@/app/utils/agrotrackHandoff";

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
  const statusMap: { [key: string]: "Pending" | "Active" | "Completed" | "Rejected" } = {
    pending: "Pending",
    accepted: "Active",
    active: "Active",
    completed: "Completed",
    rejected: "Rejected",
    cancelled: "Completed"
  };

  // Priority: orderState "completed" > status mapping
  // If status is rejected, always set to Rejected
  let orderStatus: "Pending" | "Active" | "Completed" | "Rejected";
  if (buyRequest.status.toLowerCase() === "rejected") {
    orderStatus = "Rejected";
  } else if (buyRequest.orderState?.toLowerCase() === "completed") {
    orderStatus = "Completed";
  } else {
    orderStatus = statusMap[buyRequest.status.toLowerCase()] || "Pending";
  }

  // When order is accepted, set orderState to "awaiting_shipping" if not already set
  let orderState = buyRequest.orderState;
  if (buyRequest.status.toLowerCase() === "accepted" && !orderState) {
    orderState = "awaiting_shipping";
  }

  return {
    id: buyRequest.requestNumber.toString(),
    buyRequestId: buyRequest.id, // Store the actual ID for API calls
    productId: buyRequest.product?.id || undefined, // Store productId if available
    productName: buyRequest.cropType?.name || 'Unknown Product',
    quantity: `${formatQuantity(buyRequest.productQuantityKg || '0')}kg`,
    price: `₦${buyRequest.pricePerKgOffer}/kg`,
    certification: buyRequest.qualityStandardType?.name || 'N/A',
    status: orderStatus,
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
    orderValue: `₦${(parseFloat(buyRequest.pricePerKgOffer) * parseFloat(buyRequest.productQuantityKg)).toLocaleString()}`,
    paymentTerms: buyRequest.preferredPaymentMethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    buyerName: buyRequest.buyer.companyName || `${buyRequest.buyer.firstName} ${buyRequest.buyer.lastName}`,
    buyerLocation: buyRequest.deliveryLocation || `${buyRequest.buyer.state}, ${buyRequest.buyer.country}`,
    deliveryLocation: buyRequest.deliveryLocation,
    productImage: getProductImage(buyRequest.cropType?.name || 'rice'),
    originalStatus: buyRequest.status,
    orderState: orderState, // Store orderState for accepted orders (set to in_transit if accepted)
    purchaseOrderDoc: buyRequest.purchaseOrderDoc || undefined,
    ratings: buyRequest.ratings || [], // Include ratings from buy request
    currentUserRole: 'farmer', // Farmer viewing their orders
    agroTrackTrackingNumber: buyRequest.agroTrackTrackingNumber || null,
  };
};

export default function Page() {
  return (
    <Suspense fallback={<AnimatedLoading />}>
      <OrdersPageInner />
    </Suspense>
  );
}

function OrdersPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const linkTrackingHandled = useRef(false);

  const { 
    myRequests, 
    fetchMyRequests, 
    updateBuyRequestStatus,
    updateOrderState,
    updateTracking,
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
    pending: 0,
    rejected: 0
  });
  
  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'accept' | 'reject' | null;
    orderId: string | null;
    orderProductId?: string;
  }>({
    isOpen: false,
    type: null,
    orderId: null,
    orderProductId: undefined,
  });

  // Rating modal state
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    buyRequest: BuyRequest | null;
  }>({
    isOpen: false,
    buyRequest: null,
  });

  // Dispute modal state
  const [disputeModal, setDisputeModal] = useState<{
    isOpen: boolean;
    buyRequest: BuyRequest | null;
  }>({
    isOpen: false,
    buyRequest: null,
  });

  // Link AgroTrack tracking modal
  const [linkTrackingModal, setLinkTrackingModal] = useState<{
    isOpen: boolean;
    buyRequest: BuyRequest | null;
  }>({
    isOpen: false,
    buyRequest: null,
  });

  // Fetch buy requests on component mount
  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  const clearLinkTrackingParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("linkTracking");
    params.delete("okoRequestId");
    params.delete("tracking");
    const qs = params.toString();
    router.replace(qs ? `/dashboard/orders?${qs}` : "/dashboard/orders");
  }, [router, searchParams]);

  // Phase 2: AgroTrack "Return to Oko" deep link → persist tracking
  useEffect(() => {
    if (linkTrackingHandled.current) return;
    if (searchParams.get("linkTracking") !== "1") return;

    const okoRequestId = searchParams.get("okoRequestId")?.trim();
    const tracking = normalizeTrackingNumber(searchParams.get("tracking") || "");
    if (!okoRequestId || !tracking) {
      linkTrackingHandled.current = true;
      clearLinkTrackingParams();
      showToast("Could not link tracking from AgroTrack. Use Link Tracking to paste it.", "error");
      return;
    }

    linkTrackingHandled.current = true;
    void (async () => {
      try {
        showToast("Linking AgroTrack tracking…", "info");
        await updateTracking({
          buyRequestId: okoRequestId,
          agroTrackTrackingNumber: tracking,
        });
        showToast(`Tracking ${tracking} linked to this order.`, "success");
        await fetchMyRequests();
      } catch {
        showToast("Failed to link tracking. You can paste it with Link Tracking.", "error");
      } finally {
        clearLinkTrackingParams();
      }
    })();
  }, [searchParams, updateTracking, fetchMyRequests, clearLinkTrackingParams]);

  // Convert buy requests to orders format and calculate stats
  useEffect(() => {
    if (myRequests.length > 0) {
      // Filter out general requests since seller only sees requests sent to them
      const nonGeneralRequests = myRequests.filter(req => !req.isGeneral && !req.isDeleted);
      const convertedOrders = nonGeneralRequests.map(convertBuyRequestToOrder);
      
      setOrders(convertedOrders);

      // Calculate statistics
      const totalValue = nonGeneralRequests.reduce((sum, req) => {
        return sum + (parseFloat(req.pricePerKgOffer) * parseFloat(req.productQuantityKg));
      }, 0);

      // Count completed orders: check orderState first, then status (exclude rejected)
      const completed = nonGeneralRequests.filter(req => {
        // Priority: orderState "completed" takes precedence over status
        if (req.orderState?.toLowerCase() === 'completed') {
          return true;
        }
        const statusLower = req.status.toLowerCase();
        return statusLower === 'completed' || statusLower === 'cancelled';
      }).length;

      // Count active orders: must not be completed and status is accepted/active (exclude rejected)
      const active = nonGeneralRequests.filter(req => {
        // Exclude if orderState is completed or status is rejected
        if (req.orderState?.toLowerCase() === 'completed') {
          return false;
        }
        const statusLower = req.status.toLowerCase();
        return (statusLower === 'accepted' || statusLower === 'active');
      }).length;

      const pending = nonGeneralRequests.filter(req => 
        req.status.toLowerCase() === 'pending'
      ).length;

      const rejected = nonGeneralRequests.filter(req => 
        req.status.toLowerCase() === 'rejected'
      ).length;

      setStats({
        total: nonGeneralRequests.length,
        totalValue,
        completed,
        active,
        pending,
        rejected
      });
    } else {
      setStats({
        total: 0,
        totalValue: 0,
        completed: 0,
        active: 0,
        pending: 0,
        rejected: 0
      });
    }
  }, [myRequests]);

  // Open confirmation modal for accept
  const handleAcceptOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setConfirmationModal({
        isOpen: true,
        type: 'accept',
        orderId: orderId,
        orderProductId: order.productId,
      });
    }
  };

  // Open confirmation modal for reject
  const handleDeclineOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setConfirmationModal({
        isOpen: true,
        type: 'reject',
        orderId: orderId,
        orderProductId: order.productId,
      });
    }
  };

  // Confirm action handler
  const handleConfirmAction = async () => {
    if (!confirmationModal.orderId) return;

    const order = orders.find(o => o.id === confirmationModal.orderId);
    if (!order) return;

    try {
      const payload: {
        buyRequestId: string;
        status: string;
        productId?: string;
      } = {
        buyRequestId: order.buyRequestId!,
        status: confirmationModal.type === 'accept' ? 'accepted' : 'rejected',
      };

      // Only include productId if it exists
      if (confirmationModal.orderProductId) {
        payload.productId = confirmationModal.orderProductId;
      }

      if (confirmationModal.type === 'accept') {
        showToast('Accepting order...', 'info');
      } else {
        showToast('Rejecting order...', 'info');
      }

      await updateBuyRequestStatus(payload);

      if (confirmationModal.type === 'accept') {
        showToast('Order accepted successfully! It has been moved to Active orders.', 'success');
      } else {
        showToast('Order rejected successfully.', 'success');
      }
      
      // Close modal and refresh the list
      setConfirmationModal({ isOpen: false, type: null, orderId: null });
      await fetchMyRequests();
    } catch (error) {
      console.error(`Error ${confirmationModal.type === 'accept' ? 'accepting' : 'rejecting'} order:`, error);
      showToast(`Failed to ${confirmationModal.type === 'accept' ? 'accept' : 'reject'} order. Please try again.`, 'error');
    }
  };

  // Close confirmation modal
  const handleCloseConfirmation = () => {
    setConfirmationModal({ isOpen: false, type: null, orderId: null });
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

  // Handle update order state
  const handleUpdateOrderState = async (orderId: string, buyRequestId: string, newState: string) => {
    try {
      showToast('Updating order state...', 'info');
      await updateOrderState({
        buyRequestId,
        orderState: newState as OrderState,
      });
      showToast('Order state updated successfully!', 'success');
      await fetchMyRequests();
    } catch (error) {
      console.error('Error updating order state:', error);
      showToast('Failed to update order state. Please try again.', 'error');
    }
  };

  const handleArrangeTransit = (_orderId: string, buyRequestId: string) => {
    const buyRequest = myRequests.find((req) => req.id === buyRequestId);
    if (!buyRequest) {
      showToast('Could not find this order. Please refresh and try again.', 'error');
      return;
    }
    openAgroTrackHandoff(buyRequest);
  };

  const handleTrackShipment = (
    _orderId: string,
    _buyRequestId: string,
    trackingNumber: string,
  ) => {
    openAgroTrackTrack(trackingNumber);
  };

  const handleLinkTracking = (_orderId: string, buyRequestId: string) => {
    const buyRequest = myRequests.find((req) => req.id === buyRequestId);
    if (!buyRequest) {
      showToast("Could not find this order. Please refresh and try again.", "error");
      return;
    }
    setLinkTrackingModal({
      isOpen: true,
      buyRequest,
    });
  };

  const handleLinkTrackingSubmit = async (trackingNumber: string) => {
    const buyRequest = linkTrackingModal.buyRequest;
    if (!buyRequest) return;

    try {
      showToast("Linking tracking…", "info");
      await updateTracking({
        buyRequestId: buyRequest.id,
        agroTrackTrackingNumber: trackingNumber,
      });
      showToast(`Tracking ${trackingNumber} linked.`, "success");
      setLinkTrackingModal({ isOpen: false, buyRequest: null });
      await fetchMyRequests();
    } catch {
      showToast("Failed to link tracking. Please try again.", "error");
    }
  };

  // Handle rate order
  const handleRate = (orderId: string, buyRequestId: string) => {
    const buyRequest = myRequests.find(req => req.id === buyRequestId);
    if (buyRequest) {
      setRatingModal({
        isOpen: true,
        buyRequest,
      });
    }
  };

  // Handle rating submitted
  const handleRatingSubmitted = () => {
    fetchMyRequests();
  };

  // Handle dispute
  const handleDispute = (orderId: string, buyRequestId: string) => {
    const buyRequest = myRequests.find(req => req.id === buyRequestId);
    if (buyRequest) {
      setDisputeModal({
        isOpen: true,
        buyRequest,
      });
    }
  };

  // Handle dispute created
  const handleDisputeCreated = () => {
    fetchMyRequests();
  };

  if (isFetching) {
    return (
      <AnimatedLoading />
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
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9">
          {isUpdating ? (
            <AnimatedLoading/>
          ) : (
            <Orders
              orders={orders}
              onAcceptOrder={handleAcceptOrder}
              onDeclineOrder={handleDeclineOrder}
              onViewProfile={handleViewProfile}
              onMessage={handleMessage}
              onUpdateOrderState={handleUpdateOrderState}
              onArrangeTransit={handleArrangeTransit}
              onTrackShipment={handleTrackShipment}
              onLinkTracking={handleLinkTracking}
              onRate={handleRate}
              onDispute={handleDispute}
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
          <OrderCard 
            text="Rejected Orders" 
            count={stats.rejected} 
            icon={XCircle} 
            iconColor="#EF4444" 
            bgColor="bg-red-50" 
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal.isOpen && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={handleCloseConfirmation}
          onConfirm={handleConfirmAction}
          title={
            confirmationModal.type === 'accept'
              ? 'Accept Order'
              : 'Reject Order'
          }
          message={
            confirmationModal.type === 'accept'
              ? 'Are you sure you want to accept this order? The order will be moved to Active orders once accepted.'
              : 'Are you sure you want to reject this order? This action cannot be undone.'
          }
          confirmText={
            confirmationModal.type === 'accept' ? 'Accept Order' : 'Reject Order'
          }
          cancelText="Cancel"
          type={confirmationModal.type === 'accept' ? 'success' : 'danger'}
          isLoading={isUpdating}
        />
      )}

      {/* Rating Modal */}
      {ratingModal.buyRequest && (
        <RatingModal
          isOpen={ratingModal.isOpen}
          onClose={() => setRatingModal({ isOpen: false, buyRequest: null })}
          buyRequest={ratingModal.buyRequest}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}
      {disputeModal.buyRequest && (
        <DisputeModal
          isOpen={disputeModal.isOpen}
          onClose={() => setDisputeModal({ isOpen: false, buyRequest: null })}
          buyRequest={disputeModal.buyRequest}
          onDisputeCreated={handleDisputeCreated}
        />
      )}
      <LinkTrackingModal
        isOpen={linkTrackingModal.isOpen}
        onClose={() => setLinkTrackingModal({ isOpen: false, buyRequest: null })}
        onSubmit={handleLinkTrackingSubmit}
        orderLabel={
          linkTrackingModal.buyRequest
            ? `Order #${linkTrackingModal.buyRequest.requestNumber}`
            : undefined
        }
        isLoading={isUpdating}
      />
    </div>
  );
}