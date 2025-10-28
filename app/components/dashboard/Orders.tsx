"use client";
import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

// Mock icons
const ViewOrders = ({ color = "black", size = 24, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// TypeScript interfaces
export interface Order {
  id: string;
  buyRequestId?: string;
  productName: string;
  quantity: string;
  price: string;
  certification: string;
  status: "Pending" | "Active" | "Completed";
  createdDate: string;
  deliveryDate?: string;
  orderValue: string;
  paymentTerms: string;
  buyerName: string;
  buyerLocation: string;
  productImage: string;
  originalStatus?: string;
}

interface OrdersProps {
  orders: Order[];
  onAcceptOrder?: (orderId: string) => void;
  onDeclineOrder?: (orderId: string) => void;
  onViewProfile?: (orderId: string) => void;
  onMessage?: (orderId: string) => void;
}

type StatusFilter = "All" | "Pending" | "Active" | "Completed";

const Orders: React.FC<OrdersProps> = ({
  orders,
  onAcceptOrder,
  onDeclineOrder,
  onViewProfile,
  onMessage,
}) => {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");

  const statusDisplayMap: Record<string, StatusFilter> = {
    "All Orders": "All",
    "Pending Orders": "Pending",
    "Active Orders": "Active",
    "Completed Orders": "Completed",
  };

  const availableStatusDisplayNames = [
    "All Orders",
    "Pending Orders",
    "Active Orders",
    "Completed Orders",
  ];

  const filteredOrders = (() => {
    if (activeFilter === "All") {
      return orders;
    }
    return orders.filter((order) => order.status === activeFilter);
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

  const StatusBadge: React.FC<{ status: Order["status"]; originalStatus?: string }> = ({ status, originalStatus }) => {
    const getStatusStyles = () => {
      switch (status) {
        case "Pending":
          return "bg-yellow-500 text-white";
        case "Active":
          return "bg-green-500 text-white";
        case "Completed":
          return "bg-blue-100 text-blue-800 border border-blue-200";
        default:
          return "bg-gray-100 text-gray-800 border border-gray-200";
      }
    };

    const displayStatus = originalStatus || status;

    return (
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusStyles()}`}
      >
        {displayStatus}
      </span>
    );
  };

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const isPending = order.status === "Pending";

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-start space-x-2">
            <ViewOrders color="black" className="pt-1" />
            <div>
              <span className="font-medium">Order: #{order.id}</span>
              <div className="text-sm text-gray-600">
                Created {order.createdDate}
              </div>
            </div>
          </div>
          <StatusBadge status={order.status} originalStatus={order.originalStatus} />
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
                <h5 className="font-medium mb-2">{order.productName}</h5>
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
            <h4 className="font-medium text-gray-900 mb-4">Buyer Information</h4>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-gray-600">
                  {order.buyerName.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{order.buyerName}</h5>
                <p className="text-sm text-gray-600">{order.buyerLocation}</p>
                {/* <div className="flex items-center space-x-4 mt-4">
                  {onMessage && (
                    <button
                      onClick={() => onMessage(order.id)}
                      className="text-sm text-mainGreen hover:text-mainGreen/90"
                    >
                      Message
                    </button>
                  )}
                  {onViewProfile && (
                    <button
                      onClick={() => onViewProfile(order.id)}
                      className="text-sm text-mainGreen hover:text-mainGreen/90"
                    >
                      View profile
                    </button>
                  )}
                </div> */}
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
            <p className="text-sm text-gray-600 mb-3">Payment Terms</p>
            <p className="font-medium text-gray-900">{order.paymentTerms}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-3">Delivery Date</p>
            <p className="font-medium text-gray-900">
              {order.deliveryDate || "TBD"}
            </p>
          </div>
        </div>

        {isPending && (onAcceptOrder || onDeclineOrder) && (
          <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-gray-100">
            {onAcceptOrder && (
              <button
                onClick={() => onAcceptOrder(order.id)}
                className="px-6 py-2 flex items-center gap-2 bg-mainGreen text-white rounded-md hover:bg-mainGreen/90 transition-colors font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                Accept Order
              </button>
            )}
            {onDeclineOrder && (
              <button
                onClick={() => onDeclineOrder(order.id)}
                className="px-6 py-2 flex items-center gap-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors font-medium"
              >
                <XCircle className="w-4 h-4" />
                Reject Order
              </button>
            )}
          </div>
        )}

        {order.status === "Active" && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-mainGreen">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Order Accepted - Awaiting Payment</span>
            </div>
          </div>
        )}

        {order.status === "Completed" && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-blue-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Order Completed</span>
            </div>
          </div>
        )}
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
    </div>
  );
};

export default Orders;