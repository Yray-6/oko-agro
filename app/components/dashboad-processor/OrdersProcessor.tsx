/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { X, Download, FileText, CreditCard, Star, XCircle } from "lucide-react";
import Image from "next/image";
import Logo from "@/app/assets/icons/Logo";

// Mock icons
const ViewOrders = ({ color = "black", size = 24, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// Rating interface for order display
export interface OrderRating {
  id: string;
  raterRole: 'seller' | 'buyer';
  rateeRole: 'seller' | 'buyer';
  score: number;
  comment?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// TypeScript interfaces
export interface Order {
  id: string;
  buyRequestId?: string;
  productName: string;
  quantity: string;
  price: string;
  certification: string;
  status: "Pending" | "Active" | "Completed" | "MyRequest" | "Rejected";
  createdDate: string;
  deliveryDate?: string;
  orderValue: string;
  paymentTerms: string;
  buyerName: string;
  buyerLocation: string;
  deliveryLocation?: string;
  productImage: string;
  isGeneral?: boolean;
  originalStatus?: string;
  orderState?: string; // Order state for accepted orders
  purchaseOrderDoc?: {
    id: string;
    name: string;
    url: string;
    publicId: string;
    description: string;
    mimeType: string;
    size: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  ratings?: OrderRating[]; // Ratings for this order
  currentUserRole?: 'farmer' | 'processor'; // Current user's role to determine if they can rate
}

interface InvoiceData {
  orderNumber: string;
  createdDate: string;
  productName: string;
  quantity: string;
  price: string;
  certification: string;
  productImage: string;
  farmerName: string;
  farmerLocation: string;
  farmerImage?: string;
  orderValue: string;
  paymentTerms: string;
  deliveryDate: string;
  paymentStatus: "Completed" | "Pending" | "Failed";
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceData;
}

// Invoice Modal Component
const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  invoiceData,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${invoiceData.orderNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.4; color: #333; background: white; padding: 40px; }
            .invoice-container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; }
            .invoice-header { text-align: center; padding: 30px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
            .invoice-title { font-size: 32px; font-weight: 600; color: #1f2937; margin-bottom: 20px; }
            .order-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; }
            .order-number { font-size: 16px; color: #374151; display: flex; align-items: center; gap: 8px; }
            .created-date { font-size: 14px; color: #6b7280; }
            .invoice-content { padding: 40px; }
            .section-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .section-title { font-size: 16px; font-weight: 500; color: #374151; margin-bottom: 16px; }
            .product-info, .farmer-info { display: flex; gap: 16px; align-items: flex-start; }
            .product-image, .farmer-image { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
            .farmer-image { border-radius: 50%; background: #d1d5db; }
            .info-details h3 { font-size: 16px; font-weight: 500; color: #111827; margin-bottom: 8px; }
            .info-details p { font-size: 14px; color: #6b7280; margin-bottom: 4px; }
            .order-summary { background: #f0f9ff; border-radius: 8px; padding: 24px; margin-bottom: 40px; }
            .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
            .summary-item h4 { font-size: 14px; color: #6b7280; margin-bottom: 8px; }
            .summary-item p { font-size: 16px; font-weight: 600; color: #111827; }
            .order-value p { color: #059669 !important; font-size: 18px; }
            .payment-status { text-align: center; margin-bottom: 40px; }
            .payment-status h4 { font-size: 14px; color: #6b7280; margin-bottom: 8px; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; }
            .status-completed { background: #d1fae5; color: #065f46; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-failed { background: #fee2e2; color: #991b1b; }
            .company-footer { text-align: center; padding: 30px; border-top: 1px solid #e5e7eb; background: #f9fafb; }
            .company-logo { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px; }
            .logo-icon { width: 24px; height: 24px; background: #059669; border-radius: 4px; }
            .company-name { font-size: 18px; font-weight: 600; color: #059669; }
            .company-tagline { font-size: 14px; color: #059669; font-style: italic; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <h1 class="invoice-title">Invoice</h1>
              <div class="order-info">
                <div class="order-number">
                  <span>📄</span>
                  Order: #${invoiceData.orderNumber}
                </div>
                <div class="created-date">Created ${invoiceData.createdDate}</div>
              </div>
            </div>

            <div class="invoice-content">
              <div class="section-grid">
                <div>
                  <h3 class="section-title">Product Details</h3>
                  <div class="product-info">
                    <div style="width: 60px; height: 60px; background: #d1d5db; border-radius: 8px;"></div>
                    <div class="info-details">
                      <h3>${invoiceData.productName}</h3>
                      <p>Quantity: ${invoiceData.quantity} | ${invoiceData.price}</p>
                      <p>Certification: ${invoiceData.certification}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="section-title">Farmer Information</h3>
                  <div class="farmer-info">
                    <div style="width: 60px; height: 60px; background: #d1d5db; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 500; color: #6b7280;">
                      ${invoiceData.farmerName.charAt(0)}
                    </div>
                    <div class="info-details">
                      <h3>${invoiceData.farmerName}</h3>
                      <p>${invoiceData.farmerLocation}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="order-summary">
                <div class="summary-grid">
                  <div class="summary-item order-value">
                    <h4>Order Value</h4>
                    <p>${invoiceData.orderValue}</p>
                  </div>
                  <div class="summary-item">
                    <h4>Delivery Location</h4>
                    <p>${invoiceData.farmerLocation}</p>
                  </div>
                  <div class="summary-item">
                    <h4>Delivery Date</h4>
                    <p>${invoiceData.deliveryDate}</p>
                  </div>
                </div>
              </div>

              <div class="payment-status">
                <h4>Payment Status</h4>
                <span class="status-badge status-${invoiceData.paymentStatus.toLowerCase()}">
                  ${invoiceData.paymentStatus}
                </span>
              </div>
            </div>

            <div class="company-footer">
              <div class="company-logo">
                <div class="logo-icon"></div>
                <span class="company-name">Oko Agro</span>
              </div>
              <p class="company-tagline">Bridging the Gap Between Harvest and Industry</p>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };
  };

  if (!isOpen) return null;

  const getPaymentStatusStyle = () => {
    switch (invoiceData.paymentStatus) {
      case "Completed":
        return " text-green";
      case "Pending":
        return " text-yellow-800";
      case "Failed":
        return " text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Invoice</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-mainGreen text-white rounded-md hover:bg-mainGreen/90 transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                Download Invoice
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
            <div className="text-center py-4 px-6 bg-gray-50 border-b border-gray-200">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">Invoice</h1>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-700">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Order: #{invoiceData.orderNumber}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Created {invoiceData.createdDate}
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">
                    Product Details
                  </h3>
                  <div className="flex items-start gap-4">
                    <div className="w-15 h-15 bg-yellow-200 rounded-lg flex-shrink-0 overflow-hidden">
                      {invoiceData.productImage ? (
                        <Image
                          src={invoiceData.productImage}
                          alt={invoiceData.productName}
                          width={60}
                          height={60}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-15 h-15 bg-yellow-200 rounded-lg"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {invoiceData.productName}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        Quantity: {invoiceData.quantity} | {invoiceData.price}
                      </p>
                      <p className="text-sm text-gray-600">
                        Certification: {invoiceData.certification}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">
                    Farmer Information
                  </h3>
                  <div className="flex items-start gap-4">
                    <div className="w-15 h-15 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {invoiceData.farmerImage ? (
                        <Image
                          src={invoiceData.farmerImage}
                          alt={invoiceData.farmerName}
                          width={60}
                          height={60}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-600">
                            {invoiceData.farmerName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {invoiceData.farmerName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {invoiceData.farmerLocation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-skyBlue rounded-lg px-6 py-2 ">
                <div className="space-y-6 flex flex-col justify-center text-center items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Order Value</p>
                    <p className="text-lg font-semibold text-mainGreen">
                      {invoiceData.orderValue}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Delivery Location</p>
                    <p className="font-medium text-gray-900">
                      {invoiceData.farmerLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Delivery Date</p>
                    <p className="font-medium text-gray-900">
                      {invoiceData.deliveryDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                    <span
                      className={`inline-block px-4 rounded-full font-medium ${getPaymentStatusStyle()}`}
                    >
                      {invoiceData.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center py-8 px-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Logo color="#004829"/>
                <span className="text-lg font-semibold text-mainGreen">
                  Oko Agro
                </span>
              </div>
              <p className="text-sm text-mainGreen italic">
                Bridging the Gap Between Harvest and Industry
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface OrdersProps {
  orders: Order[];
  onAcceptOrder?: (orderId: string) => void;
  onDeclineOrder?: (orderId: string) => void;
  onViewProfile?: (orderId: string) => void;
  onMessage?: (orderId: string) => void;
  onMakePayment?: (orderId: string) => void;
  onEditRequest?: (orderId: string) => void;
  onUpdateOrderState?: (orderId: string, buyRequestId: string, newState: string) => void;
  onRate?: (orderId: string, buyRequestId: string) => void;
  onDispute?: (orderId: string, buyRequestId: string) => void;
}

type StatusFilter = "All" | "MyRequests" | "Pending" | "Active" | "Completed" | "Rejected";

const OrdersProcessorWithInvoice: React.FC<OrdersProps> = ({
  orders,
  onAcceptOrder,
  onDeclineOrder,
  onMakePayment,
  onEditRequest,
  onUpdateOrderState,
  onRate,
  onDispute,
}) => {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const convertOrderToInvoiceData = (order: Order): InvoiceData => {
    return {
      orderNumber: order.id,
      createdDate: order.createdDate,
      productName: order.productName,
      quantity: order.quantity,
      price: order.price,
      certification: order.certification,
      productImage: order.productImage,
      farmerName: order.buyerName,
      farmerLocation: order.buyerLocation,
      farmerImage: "",
      orderValue: order.orderValue,
      paymentTerms: order.paymentTerms,
      deliveryDate: order.deliveryDate || "TBD",
      paymentStatus: order.status === "Completed" ? "Completed" : "Pending",
    };
  };

  const handleViewInvoice = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const invoiceData = convertOrderToInvoiceData(order);
      setSelectedInvoice(invoiceData);
      setIsInvoiceModalOpen(true);
    }
  };

  const closeInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setSelectedInvoice(null);
  };

  const statusDisplayMap: Record<string, StatusFilter> = {
    "All Orders": "All",
    "My Requests": "MyRequests",
    "Pending Orders": "Pending",
    "Active Orders": "Active",
    "Completed Orders": "Completed",
    "Rejected Orders": "Rejected",
  };

  const availableStatusDisplayNames = [
    "All Orders",
    "My Requests",
    "Pending Orders",
    "Active Orders",
    "Completed Orders",
    "Rejected Orders",
  ];

  const filteredOrders = (() => {
    if (activeFilter === "All") {
      return orders;
    }
    
    if (activeFilter === "MyRequests") {
      return orders.filter((order) => order.isGeneral === true);
    }
    
    return orders.filter((order) => {
      if (order.isGeneral) return false;
      if (activeFilter === "Rejected") {
        return order.status === "Rejected" || order.originalStatus?.toLowerCase() === 'rejected';
      }
      if (activeFilter === "Completed") {
        // Include orders with orderState "completed" even if status is "Active"
        return order.status === "Completed" || order.orderState?.toLowerCase() === "completed";
      }
      if (activeFilter === "Active") {
        // Exclude orders with orderState "completed" from Active filter
        return order.status === "Active" && order.orderState?.toLowerCase() !== "completed";
      }
      return order.status === activeFilter;
    });
  })();

  const getButtonStyles = (displayName: string) => {
    const baseStyles =
      "px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2";
    const filterValue = statusDisplayMap[displayName];

    if (activeFilter === filterValue) {
      return `${baseStyles} text-mainGreen border-mainGreen`;
    } else {
      return `${baseStyles} text-gray-500 border-transparent hover:text-mainGreen`;
    }
  };

  const StatusBadge: React.FC<{ status: Order["status"]; originalStatus?: string; orderState?: string }> = ({ status, originalStatus, orderState }) => {
    const getStatusStyles = (displayValue: string, currentStatus: "Pending" | "Active" | "Completed" | "MyRequest" | "Rejected") => {
      const displayLower = displayValue.toLowerCase();
      
      // Check for rejected status first (highest priority)
      if (currentStatus === "Rejected" || displayLower.includes('rejected') || originalStatus?.toLowerCase() === 'rejected') {
        return "bg-red-500 text-white";
      }
      
      if (currentStatus === "MyRequest") {
        return "bg-blue-100 text-blue-800 border border-blue-200";
      }
      
      // For orderState values (only if not rejected)
      if (displayLower.includes('awaiting_shipping') || displayLower.includes('awaiting shipping')) {
        return "bg-blue-500 text-white";
      }
      if (displayLower.includes('in_transit') || displayLower.includes('in transit')) {
        return "bg-purple-500 text-white";
      }
      if (displayLower.includes('delivered')) {
        return "bg-green-600 text-white";
      }
      if (displayLower.includes('completed')) {
        return "bg-green-700 text-white";
      }
      
      // For status values
      if (currentStatus === "Pending") {
        return "bg-yellow-500 text-white";
      }
      if (currentStatus === "Active") {
        return "bg-green-500 text-white";
      }
      if (currentStatus === "Completed") {
        return "bg-blue-100 text-blue-800 border border-blue-200";
      }
      return "bg-gray-100 text-gray-800 border border-gray-200";
    };

    // Display orderState if order is accepted/active and orderState exists
    // If orderState is "completed", show "Completed"
    // Otherwise display originalStatus or status
    // For rejected orders, always show "Rejected"
    const isRejected = status === "Rejected" || originalStatus?.toLowerCase() === 'rejected';
    const isCompleted = orderState?.toLowerCase() === 'completed' || status === "Completed";
    const displayStatus = isRejected
      ? "Rejected"
      : status === "MyRequest"
      ? "General Request"
      : isCompleted
      ? "Completed"
      : (status === "Active" || originalStatus === "accepted") && orderState
      ? orderState.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      : originalStatus?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || status;

    return (
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusStyles(displayStatus, status)}`}
      >
        {displayStatus}
      </span>
    );
  };

 const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const isMyRequest = order.isGeneral === true;
    const isActive = order.status === "Active";
    const canEdit = order.status === "Pending" || isMyRequest;
    const canViewInvoice = !isMyRequest && order.status !== "Pending";
    const canMakePayment = isActive && !isMyRequest && onMakePayment;
    const isInTransit = order.orderState?.toLowerCase() === 'in_transit';
    const isCompleted = order.status === "Completed" || order.orderState?.toLowerCase() === 'completed';
    
    // Check if current user (processor/buyer) has already rated
    const userRating = order.ratings?.find(rating => 
      rating.raterRole === 'buyer' && !rating.isDeleted
    );
    const hasUserRated = !!userRating;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-start space-x-2">
            <ViewOrders color="black" className="pt-1" />
            <div>
              <span className="font-medium">Order: #{order.id}</span>
              <div className="text-sm text-gray-600 ">
                Created {order.createdDate}
              </div>
            </div>
          </div>
          <StatusBadge status={order.status} originalStatus={order.originalStatus} orderState={order.orderState} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-4">Product Details</h4>
            <div className="flex items-start space-x-4">
              <div className="w-15 h-15 bg-yellow-200 rounded-lg flex-shrink-0 overflow-hidden">
                {order.productImage ? (
                  <Image
                    src={order.productImage}
                    alt={order.productName}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-15 h-15 bg-yellow-200 rounded-lg"></div>
                )}
              </div>
              <div className="flex-1">
                <h5 className="font-medium  mb-2">{order.productName}</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    Quantity: {order.quantity} | {order.price}
                  </p>
                  <p>Certification: {order.certification}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              {isMyRequest ? "Request Information" : "Seller Information"}
            </h4>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-gray-600">
                  {order.buyerName.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{order.buyerName}</h5>
                <p className="text-sm text-gray-600">{order.buyerLocation}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6 pt-6 bg-sky-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 mb-3">Order Value</p>
            <p className="font-semibold text-green text-lg">
              {order.orderValue}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-3">Delivery Location</p>
            <p className="font-medium text-gray-900">{order.deliveryLocation || order.buyerLocation || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-3">Delivery Date</p>
            <p className="font-medium text-gray-900">
              {order.deliveryDate || "TBD"}
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
          {/* Make Payment Button - Only for Active orders (processor side) */}
      

                {canEdit && order?.isGeneral && onEditRequest && (
            <button
              onClick={() => onEditRequest(order.id)}
              className="px-6 py-2 border bg-mainGreen text-white rounded-md hover:bg-mainGreen/90 transition-colors font-medium"
            >
              Edit Request
            </button>
          )}

          {/* Cancel/Delete Button - For My Requests only */}
          {canEdit && onDeclineOrder && (
            <button
              onClick={() => onDeclineOrder(order.id)}
              className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors font-medium"
            >
              Cancel Request
            </button>
          )}

          {/* Mark as Delivered Button - For processors when order is in transit */}
          {isInTransit && onUpdateOrderState && order.buyRequestId && (
            <button
              onClick={() => onUpdateOrderState(order.id, order.buyRequestId!, 'delivered')}
              className="px-6 py-2 flex items-center gap-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Mark as Delivered
            </button>
          )}

          {/* Display rating if exists, otherwise show rate button */}
          {isCompleted && (
            <>
              {hasUserRated && userRating ? (
                <div className="px-6 py-2 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < userRating.score
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-700">
                    You rated {userRating.score}/5
                  </span>
                  {userRating.comment && (
                    <span className="text-xs text-gray-500 ml-2">
                      &ldquo;{userRating.comment}&rdquo;
                    </span>
                  )}
                </div>
              ) : onRate && order.buyRequestId ? (
                <button
                  onClick={() => onRate(order.id, order.buyRequestId!)}
                  className="px-6 py-2 flex items-center gap-2 bg-[#004829] text-white rounded-md hover:bg-[#003d20] transition-colors font-medium"
                >
                  <Star className="w-4 h-4" />
                  Rate Farmer
                </button>
              ) : null}
            </>
          )}

          {/* View Invoice Button - For non-pending orders */}
          {/* {canViewInvoice && (
            <button 
              onClick={() => handleViewInvoice(order.id)}
              className="px-6 py-2 flex items-center gap-2 border-mainGreen text-mainGreen border rounded-md hover:bg-green-50 transition-colors font-medium"
            >
              <ViewOrders color="#004829" size={20} /> View Invoice
            </button>
          )} */}

          {/* Purchase Order Download Button - Show if purchaseOrderDoc exists */}
          {order.purchaseOrderDoc?.url && (
            <a
              href={order.purchaseOrderDoc.url}
              download={order.purchaseOrderDoc.name}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 flex items-center gap-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Download Purchase Order
            </a>
          )}
        </div>
      </div>
    );
  };

  const getDisplayNameForFilter = (filter: StatusFilter) => {
    const entry = Object.entries(statusDisplayMap).find(
      ([_, value]) => value === filter
    );
    return entry ? entry[0] : filter;
  };

  return (
    <div className="w-full space-y-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {availableStatusDisplayNames.map((displayName) => (
            <button
              key={displayName}
              onClick={() => setActiveFilter(statusDisplayMap[displayName])}
              className={getButtonStyles(displayName)}
            >
              <span>{displayName}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeFilter === "All"
                ? "No orders available at the moment."
                : `No orders with status "${getDisplayNameForFilter(
                    activeFilter
                  )}" found.`}
            </p>
            {activeFilter !== "All" && (
              <button
                onClick={() => setActiveFilter("All")}
                className="mt-3 text-sm text-mainGreen hover:text-mainGreen/80 font-medium"
              >
                View all orders
              </button>
            )}
          </div>
        )}
      </div>

      {filteredOrders.length > 0 && filteredOrders.length >= 10 && (
        <div className="text-center pt-6">
          <button className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Load More Orders
          </button>
        </div>
      )}

      {selectedInvoice && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={closeInvoiceModal}
          invoiceData={selectedInvoice}
        />
      )}
    </div>
  );
};

export default OrdersProcessorWithInvoice;