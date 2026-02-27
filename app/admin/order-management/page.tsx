"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "@/app/components/Modal";
import { useAdminStore } from "@/app/store/useAdminStore";
import { BuyRequest, OrderState } from "@/app/types";
import AnimatedLoading from "@/app/Loading";

interface Order {
  id: string;
  farmer: {
    name: string;
    id: string;
    location: string;
  };
  processor: {
    name: string;
    id: string;
    location: string;
  };
  order: {
    product: string;
    value: string;
    quantity?: string;
    certification?: string;
  };
  deliveryLocation: string;
  deliveryFrom?: string;
  status: string;
  statusColor: string;
  deliveryDate: string;
  orderDate?: string;
  paymentTerms?: string;
}

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const tabs = ["All Orders", "Awaiting Shipping", "In Transit", "Delivered", "Completed"];

  const {
    ongoingBuyRequests,
    isLoadingOngoingBuyRequests,
    isUpdatingOrderState,
    fetchOngoingBuyRequests,
    updateOrderState,
  } = useAdminStore();

  // Map BuyRequest to Order format
  const mapBuyRequestToOrder = (buyRequest: BuyRequest): Order => {
    const orderState = buyRequest.status || "awaiting_shipping";
    const statusMap: Record<string, string> = {
      "awaiting_shipping": "Awaiting Shipping",
      "in_transit": "In Transit",
      "delivered": "Delivered",
      "completed": "Completed",
    };
    const displayStatus = statusMap[orderState] || orderState;

    return {
      id: buyRequest.id,
      farmer: {
        name: buyRequest.seller?.farmName || `${buyRequest.seller?.firstName || ""} ${buyRequest.seller?.lastName || ""}`.trim() || "Unknown",
        id: buyRequest.seller?.id?.substring(0, 8).toUpperCase() || "N/A",
        location: buyRequest.seller?.state || "Unknown",
      },
      processor: {
        name: buyRequest.buyer?.companyName || `${buyRequest.buyer?.firstName || ""} ${buyRequest.buyer?.lastName || ""}`.trim() || "Unknown",
        id: buyRequest.buyer?.id?.substring(0, 8).toUpperCase() || "N/A",
        location: buyRequest.buyer?.state || "Unknown",
      },
      order: {
        product: buyRequest.cropType?.name || buyRequest.product?.name || "Unknown",
        value: `₦${(parseFloat(buyRequest.pricePerKgOffer || "0") * parseFloat(buyRequest.productQuantityKg || "0")).toLocaleString()}`,
        quantity: `${buyRequest.productQuantityKg} kg`,
        certification: buyRequest.qualityStandardType?.name || "N/A",
      },
      deliveryLocation: buyRequest.deliveryLocation || "N/A",
      deliveryFrom: buyRequest.seller?.farmAddress || undefined,
      status: displayStatus,
      statusColor: getStatusColor(displayStatus),
      deliveryDate: buyRequest.estimatedDeliveryDate ? new Date(buyRequest.estimatedDeliveryDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }) : "TBD",
      orderDate: new Date(buyRequest.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      paymentTerms: buyRequest.preferredPaymentMethod || "On Delivery",
    };
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Awaiting Shipping":
        return "#EEC41E";
      case "In Transit":
        return "#1E89EE";
      case "Delivered":
        return "#0BA964";
      case "Completed":
        return "#0BA964";
      default:
        return "#EEC41E";
    }
  };

  // Convert order state display name to API format
  const statusToOrderState = (status: string): OrderState => {
    const statusMap: Record<string, OrderState> = {
      "Awaiting Shipping": OrderState.AWAITING_SHIPPING,
      "In Transit": OrderState.IN_TRANSIT,
      "Delivered": OrderState.DELIVERED,
      "Completed": OrderState.COMPLETED,
    };
    return statusMap[status] || OrderState.AWAITING_SHIPPING;
  };

  // Convert tab name to API state filter
  const tabToStateFilter = (tab: string): string => {
    const tabMap: Record<string, string> = {
      "All Orders": "",
      "Awaiting Shipping": "awaiting_shipping",
      "In Transit": "in_transit",
      "Delivered": "delivered",
      "Completed": "completed",
    };
    return tabMap[tab] || "";
  };

  // Fetch orders when component mounts or filters change
  useEffect(() => {
    const stateFilter = activeTab === "All Orders" ? statusFilter : tabToStateFilter(activeTab);
    fetchOngoingBuyRequests({
      search: searchQuery,
      state: stateFilter,
      pageNumber: 1,
      pageSize: 20,
    });
  }, [activeTab, searchQuery, statusFilter, fetchOngoingBuyRequests]);

  // Convert ongoing buy requests to orders
  const allOrders = ongoingBuyRequests.map(mapBuyRequestToOrder);

  // Filter orders based on active tab (for additional client-side filtering if needed)
  const getFilteredOrders = () => {
    if (activeTab === "All Orders") {
      return allOrders;
    } else if (activeTab === "Awaiting Shipping") {
      return allOrders.filter((order) => order.status === "Awaiting Shipping");
    } else if (activeTab === "In Transit") {
      return allOrders.filter((order) => order.status === "In Transit");
    } else if (activeTab === "Delivered") {
      return allOrders.filter((order) => order.status === "Delivered");
    } else if (activeTab === "Completed") {
      return allOrders.filter((order) => order.status === "Completed");
    }
    return allOrders;
  };

  const orders = getFilteredOrders();

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setShowOrderModal(true);
  };

  const handleUpdateStatus = async () => {
    if (selectedOrder && selectedStatus) {
      try {
        // Find the buy request ID from the selected order
        const buyRequest = ongoingBuyRequests.find(br => br.id === selectedOrder.id);
        if (buyRequest) {
          const orderState = statusToOrderState(selectedStatus);
          await updateOrderState(buyRequest.id, orderState);
          
          // Refresh orders after update
          const stateFilter = activeTab === "All Orders" ? statusFilter : tabToStateFilter(activeTab);
          await fetchOngoingBuyRequests({
            search: searchQuery,
            state: stateFilter,
            pageNumber: 1,
            pageSize: 20,
          });
          
          setShowOrderModal(false);
          setShowSuccessModal(true);
        }
      } catch (error) {
        console.error("Error updating order status:", error);
        // Keep modal open on error - could add error toast here
      }
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Awaiting Shipping":
        return "bg-[#EEC41E]";
      case "In Transit":
        return "bg-[#1E89EE]";
      case "Delivered":
        return "border border-[#0BA964] bg-transparent";
      case "Completed":
        return "bg-[#0BA964]";
      case "Pending":
        return "bg-[#EEC41E]";
      default:
        return "bg-[#0BA964]";
    }
  };

  const getStatusTextColor = (status: string) => {
    return status === "Delivered" ? "text-[#0BA964]" : "text-white";
  };

  const statusOptions = [
    "Awaiting Shipping",
    "In Transit",
    "Delivered",
    "Completed",
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Top Header */}
      <div className="bg-[#F8F8F8] h-[104px] flex items-center justify-between px-12">
        {/* Left Side - Order Management Title */}
        <div className="flex items-center">
          <h1
            className="text-[28px] font-normal text-black"
            style={{
              lineHeight: "1.5em",
              letterSpacing: "-1.1%",
            }}
          >
            Order Management
          </h1>
        </div>

        {/* Right Side - Search, Admin Info & Notification */}
        <div className="flex items-center gap-[27px]">
          {/* Search Bar */}
          <div className="flex items-center gap-3 px-[10px] py-0 bg-white rounded-[12px] border border-[rgba(0,0,0,0.4)] h-[50px] w-[638px]">
            <Image
              src="/icons/search-01.svg"
              alt="Search"
              width={18}
              height={18}
              className="flex-shrink-0"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-[16px] font-normal text-[#A2A2A2]"
            />
          </div>

          {/* Admin Info & Notification */}
          <div className="flex items-center gap-[47px]">
            <div className="flex items-center gap-[13px]">
              <div className="w-[42px] h-[42px] rounded-full bg-[#D9D9D9] flex items-center justify-center">
                <span className="text-white text-sm">A</span>
              </div>
              <div className="flex flex-col">
                <span
                  className="text-[14px] font-medium text-black"
                  style={{
                    lineHeight: "1.5em",
                    letterSpacing: "-1.1%",
                  }}
                >
                  Administrator
                </span>
                <span
                  className="text-[12px] font-light text-black"
                  style={{
                    lineHeight: "1.5em",
                    letterSpacing: "-1.1%",
                  }}
                >
                  Administrator
                </span>
              </div>
            </div>
            <Image
              src="/icons/notification-01.svg"
              alt="Notifications"
              width={24}
              height={24}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 pt-[40px] pb-[104px]">
        {/* Subtitle */}
        <p
          className="text-[16px] font-normal text-[#5C5C5C] mb-[18px]"
          style={{ lineHeight: "1.5em" }}
        >
          Manage status of orders between farmers and processors
        </p>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-4 gap-[18px] mb-[18px]">
          {/* Total Transactions Value Card */}
          <div className="bg-white rounded-[20px] p-[21px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] h-[142px]">
            <div className="flex justify-between items-start mb-[20px]">
              <div>
                <p
                  className="text-[16px] font-normal text-[#5B5B5B] mb-[20px]"
                  style={{
                    lineHeight: "1.5em",
                    letterSpacing: "-1.1%",
                  }}
                >
                  Total Transactions Value
                </p>
                <p
                  className="text-[32px] font-medium text-[#28433D]"
                  style={{ lineHeight: "0.625em" }}
                >
                  {isLoadingOngoingBuyRequests ? '...' : `₦ ${allOrders.reduce((sum, order) => {
                    const value = parseFloat(order.order.value.replace(/[₦,]/g, '')) || 0;
                    return sum + value;
                  }, 0).toLocaleString()}`}
                </p>
              </div>
              <Image
                src="/icons/money-03.svg"
                alt="Money"
                width={24}
                height={24}
              />
            </div>
            <p
              className="text-[14px] font-normal text-[#0BA964]"
              style={{
                lineHeight: "1.5em",
                letterSpacing: "-1.1%",
              }}
            >
              +8% vs last month
            </p>
          </div>

          {/* Total Orders Card */}
          <div className="bg-white rounded-[20px] p-[21px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] h-[142px]">
            <div className="flex justify-between items-start mb-[20px]">
              <div>
                <p
                  className="text-[16px] font-normal text-[#5B5B5B] mb-[20px]"
                  style={{
                    lineHeight: "1.5em",
                    letterSpacing: "-1.1%",
                  }}
                >
                  Total Orders
                </p>
                <p
                  className="text-[32px] font-medium text-[#28433D]"
                  style={{ lineHeight: "0.625em" }}
                >
                  {isLoadingOngoingBuyRequests ? '...' : allOrders.length}
                </p>
              </div>
              <Image
                src="/icons/invoice-04.svg"
                alt="Orders"
                width={24}
                height={24}
              />
            </div>
            <p
              className="text-[14px] font-normal text-[#0BA964]"
              style={{
                lineHeight: "1.5em",
                letterSpacing: "-1.1%",
              }}
            >
              +8% vs last month
            </p>
          </div>

          {/* Completed Orders Card */}
          <div className="bg-white rounded-[20px] p-[21px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] h-[142px]">
            <div className="flex justify-between items-start mb-[20px]">
              <div>
                <p
                  className="text-[16px] font-normal text-[#5B5B5B] mb-[20px]"
                  style={{
                    lineHeight: "1.5em",
                    letterSpacing: "-1.1%",
                  }}
                >
                  Completed Orders
                </p>
                <p
                  className="text-[32px] font-medium text-[#28433D]"
                  style={{ lineHeight: "0.625em" }}
                >
                  {isLoadingOngoingBuyRequests ? '...' : allOrders.filter(order => order.status === "Completed").length}
                </p>
              </div>
              <Image
                src="/icons/package-delivered-01.svg"
                alt="Completed"
                width={24}
                height={24}
              />
            </div>
            <p
              className="text-[14px] font-normal text-[#5E5E5E]"
              style={{
                lineHeight: "1.5em",
                letterSpacing: "-1.1%",
              }}
            >
              +8% vs last month
            </p>
          </div>

          {/* Pending Orders Card */}
          <div className="bg-white rounded-[20px] p-[21px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] h-[142px]">
            <div className="flex justify-between items-start mb-[20px]">
              <div>
                <p
                  className="text-[16px] font-normal text-[#5B5B5B] mb-[20px]"
                  style={{
                    lineHeight: "1.5em",
                    letterSpacing: "-1.1%",
                  }}
                >
                  Pending Orders
                </p>
                <p
                  className="text-[32px] font-medium text-[#28433D]"
                  style={{ lineHeight: "0.625em" }}
                >
                  {isLoadingOngoingBuyRequests ? '...' : allOrders.filter(order => order.status === "Awaiting Shipping").length}
                </p>
              </div>
              <Image
                src="/icons/delivery-delay-02.svg"
                alt="Pending"
                width={24}
                height={24}
              />
            </div>
            <p
              className="text-[14px] font-normal text-[#5E5E5E]"
              style={{
                lineHeight: "1.5em",
                letterSpacing: "-1.1%",
              }}
            >
              +8% vs last month
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#FFFFFC] rounded-[12px] border border-[#EBE7E5] shadow-[0px_2px_8px_0px_rgba(51,117,54,0.08)]">
          {/* Table Header Tabs */}
          <div className="flex gap-[10px] px-[25px] pt-[25px] pb-0 border-b border-[#EAECF0]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-1 pb-[11px] text-[14px] font-semibold transition-colors ${
                  activeTab === tab
                    ? "text-[#004829] border-b-2 border-[#004829]"
                    : "text-[#667085]"
                }`}
                style={{
                  lineHeight: "1.429em",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="px-[17px] py-[17px] flex gap-4 items-center relative">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[40px] px-[41px] bg-[#FFFFFC] border border-[#F6F4F3] rounded-[10px] outline-none text-[14px] text-[#80726B]"
                style={{
                  fontFamily: "Effra, sans-serif",
                  lineHeight: "1.2em",
                }}
              />
              <Image
                src="/icons/search-01.svg"
                alt="Search"
                width={16}
                height={16}
                className="absolute left-[12px] top-[12px]"
              />
            </div>
            <div className="flex items-center gap-2 px-[13px] py-[9px] bg-[#FFFFFC] border border-[#F6F4F3] rounded-[10px] h-[40px]">
              <Image
                src="/icons/analytics-03.svg"
                alt="Filter"
                width={16}
                height={16}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent outline-none text-[14px] text-[#0D3F11]"
                style={{
                  fontFamily: "Effra, sans-serif",
                  lineHeight: "1.429em",
                }}
              >
                <option value="">All Status</option>
                <option value="awaiting_shipping">Awaiting Shipping</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            {/* Export Data Button */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#004829] rounded-[10px] shadow-[0px_0px_1.62px_0px_rgba(0,0,0,0.25)]"
              style={{
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "1.156em",
              }}
            >
              <Image
                src="/icons/download-01.svg"
                alt="Export"
                width={20}
                height={20}
              />
              <span className="text-white">Export Data</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EBE7E5]">
                  <th
                    className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]"
                    style={{
                      fontFamily: "Effra, sans-serif",
                      lineHeight: "1.429em",
                    }}
                  >
                    Farmer
                  </th>
                  <th
                    className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]"
                    style={{
                      fontFamily: "Effra, sans-serif",
                      lineHeight: "1.429em",
                    }}
                  >
                    Processor
                  </th>
                  <th
                    className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]"
                    style={{
                      fontFamily: "Effra, sans-serif",
                      lineHeight: "1.429em",
                    }}
                  >
                    Order & Value
                  </th>
                  <th
                    className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]"
                    style={{
                      fontFamily: "Effra, sans-serif",
                      lineHeight: "1.429em",
                    }}
                  >
                    Delivery Location
                  </th>
                  <th
                    className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]"
                    style={{
                      fontFamily: "Effra, sans-serif",
                      lineHeight: "1.429em",
                    }}
                  >
                    Status
                  </th>
                  <th
                    className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]"
                    style={{
                      fontFamily: "Effra, sans-serif",
                      lineHeight: "1.429em",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoadingOngoingBuyRequests ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <AnimatedLoading />
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[#80726B]">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                  <tr key={index} className="border-b border-[#EBE7E5]">
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <p
                          className="text-[14px] font-medium text-[#0D3F11]"
                          style={{
                            fontFamily: "Effra, sans-serif",
                            lineHeight: "1.429em",
                          }}
                        >
                          {order.farmer.name}
                        </p>
                        <p
                          className="text-[14px] font-normal text-[#80726B]"
                          style={{
                            fontFamily: "Effra, sans-serif",
                            lineHeight: "1.429em",
                          }}
                        >
                          ID: {order.farmer.id}
                        </p>
                        <div className="flex items-center gap-1 pt-1">
                          <Image
                            src="/icons/search-01.svg"
                            alt="Location"
                            width={12}
                            height={12}
                          />
                          <span
                            className="text-[12px] font-normal text-[#80726B]"
                            style={{
                              fontFamily: "Effra, sans-serif",
                              lineHeight: "1.333em",
                            }}
                          >
                            {order.farmer.location}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <p
                          className="text-[14px] font-medium text-[#0D3F11]"
                          style={{
                            fontFamily: "Effra, sans-serif",
                            lineHeight: "1.429em",
                          }}
                        >
                          {order.processor.name}
                        </p>
                        <p
                          className="text-[14px] font-normal text-[#80726B]"
                          style={{
                            fontFamily: "Effra, sans-serif",
                            lineHeight: "1.429em",
                          }}
                        >
                          ID: {order.processor.id}
                        </p>
                        <div className="flex items-center gap-1 pt-1">
                          <Image
                            src="/icons/search-01.svg"
                            alt="Location"
                            width={12}
                            height={12}
                          />
                          <span
                            className="text-[12px] font-normal text-[#80726B]"
                            style={{
                              fontFamily: "Effra, sans-serif",
                              lineHeight: "1.333em",
                            }}
                          >
                            {order.processor.location}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-[3.5px]">
                        <div className="flex items-center gap-1">
                          <Image
                            src="/icons/search-01.svg"
                            alt="Product"
                            width={12}
                            height={12}
                          />
                          <span
                            className="text-[14px] font-normal text-[#0D3F11]"
                            style={{
                              fontFamily: "Effra, sans-serif",
                              lineHeight: "1.429em",
                            }}
                          >
                            {order.order.product}
                          </span>
                        </div>
                        <span
                          className="text-[14px] font-medium text-[#4CAE4F]"
                          style={{
                            fontFamily: "Effra, sans-serif",
                            lineHeight: "1.429em",
                          }}
                        >
                          {order.order.value}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p
                        className="text-[14px] font-normal text-[#0D3F11]"
                        style={{
                          fontFamily: "Effra, sans-serif",
                          lineHeight: "1.429em",
                        }}
                      >
                        {order.deliveryLocation}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-[3.5px]">
                        <div
                          className={`inline-flex items-center gap-[6.75px] px-[11.75px] py-[11.75px] rounded-[11.75px] ${
                            order.status === "Completed"
                              ? "bg-[#0BA964]"
                              : order.status === "Awaiting Shipping"
                              ? "bg-[#EEC41E]"
                              : order.status === "In Transit"
                              ? "bg-[#1E89EE]"
                              : order.status === "Delivered"
                              ? "border border-[#0BA964] bg-transparent"
                              : order.status === "Pending"
                              ? "bg-[#EEC41E]"
                              : "bg-[#0BA964]"
                          }`}
                        >
                          {order.status === "Pending" && (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="7"
                                cy="7"
                                r="6"
                                stroke="white"
                                strokeWidth="0.875"
                              />
                              <path
                                d="M7 3.5V7L9.5 9"
                                stroke="white"
                                strokeWidth="0.875"
                                strokeLinecap="round"
                              />
                            </svg>
                          )}
                          {order.status === "Completed" && (
                            <Image
                              src="/icons/tick-04.svg"
                              alt="Status"
                              width={14}
                              height={14}
                            />
                          )}
                          {order.status === "Awaiting Shipping" && (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="7"
                                cy="7"
                                r="6"
                                stroke="white"
                                strokeWidth="0.875"
                              />
                              <path
                                d="M7 3.5V7L9.5 9"
                                stroke="white"
                                strokeWidth="0.875"
                                strokeLinecap="round"
                              />
                            </svg>
                          )}
                          {order.status === "In Transit" && (
                            <svg
                              width="14"
                              height="13"
                              viewBox="0 0 14 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.17 2.17L6.5 7.5L12.83 1.17"
                                stroke="white"
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M8.75 8.67L11.08 8.67L11.08 11L8.75 11L8.75 8.67Z"
                                stroke="white"
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M2.92 8.67L5.25 8.67L5.25 11L2.92 11L2.92 8.67Z"
                                stroke="white"
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M1.17 2.17L11.67 2.17L11.67 9.75L1.17 9.75L1.17 2.17Z"
                                stroke="white"
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                          {order.status === "Delivered" && (
                            <Image
                              src="/icons/package-delivered-01.svg"
                              alt="Status"
                              width={14}
                              height={14}
                            />
                          )}
                          <span
                            className={`text-[12px] font-normal ${
                              order.status === "Delivered"
                                ? "text-[#0BA964]"
                                : "text-white"
                            }`}
                            style={{
                              lineHeight: "1.959em",
                            }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <span
                          className="text-[12px] font-normal text-[#80726B]"
                          style={{
                            fontFamily: "Effra, sans-serif",
                            lineHeight: "1.667em",
                          }}
                        >
                          {order.deliveryDate}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="px-[13px] py-1 bg-[#FFFFFC] border border-[#EBE7E5] rounded-[10px] text-[14px] font-medium text-[#0D3F11] hover:bg-gray-50 transition-colors"
                        style={{
                          fontFamily: "Effra, sans-serif",
                          lineHeight: "1.429em",
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#EAECF0]">
            <button className="flex items-center gap-2 px-[14px] py-2 bg-white border border-[#D0D5DD] rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-[14px] font-semibold text-[#344054]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Previous
            </button>
            <div className="flex gap-[2px]">
              {[1, 2, 3, "...", 8, 9, 10].map((page, idx) => (
                <button
                  key={idx}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-[14px] font-medium ${
                    page === 1
                      ? "bg-[#F9FAFB] text-[#1D2939]"
                      : "bg-white text-[#475467]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-[14px] py-2 bg-white border border-[#D0D5DD] rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-[14px] font-semibold text-[#344054]">
              Next
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        size="xl"
        className="bg-[#FAFAFA] rounded-[8px]"
        showCloseButton={false}
      >
        {selectedOrder && (
          <div className="p-[25px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 relative">
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/invoice-04.svg"
                  alt="Invoice"
                  width={24}
                  height={24}
                />
                <h2
                  className="text-[18px] font-semibold text-[#272C34]"
                  style={{
                    lineHeight: "1em",
                    letterSpacing: "-2.5%",
                  }}
                >
                  Order Details - #{selectedOrder.id}
                </h2>
              </div>
              {/* Status Badge */}
              <div
                className={`inline-flex items-center gap-[6.75px] px-[11.75px] py-[11.75px] rounded-[11.75px] ${getStatusBadgeStyle(
                  selectedOrder.status
                )}`}
              >
                {selectedOrder.status === "Pending" && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="7"
                      cy="7"
                      r="6"
                      stroke="white"
                      strokeWidth="0.875"
                    />
                    <path
                      d="M7 3.5V7L9.5 9"
                      stroke="white"
                      strokeWidth="0.875"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                {selectedOrder.status === "Awaiting Shipping" && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="7"
                      cy="7"
                      r="6"
                      stroke="white"
                      strokeWidth="0.875"
                    />
                    <path
                      d="M7 3.5V7L9.5 9"
                      stroke="white"
                      strokeWidth="0.875"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                {selectedOrder.status === "In Transit" && (
                  <svg
                    width="14"
                    height="13"
                    viewBox="0 0 14 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.17 2.17L6.5 7.5L12.83 1.17"
                      stroke="white"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.75 8.67L11.08 8.67L11.08 11L8.75 11L8.75 8.67Z"
                      stroke="white"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.92 8.67L5.25 8.67L5.25 11L2.92 11L2.92 8.67Z"
                      stroke="white"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1.17 2.17L11.67 2.17L11.67 9.75L1.17 9.75L1.17 2.17Z"
                      stroke="white"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {selectedOrder.status === "Delivered" && (
                  <Image
                    src="/icons/package-delivered-01.svg"
                    alt="Status"
                    width={14}
                    height={14}
                  />
                )}
                {selectedOrder.status === "Completed" && (
                  <Image
                    src="/icons/tick-04.svg"
                    alt="Status"
                    width={14}
                    height={14}
                  />
                )}
                <span
                  className={`text-[12px] font-normal ${getStatusTextColor(
                    selectedOrder.status
                  )}`}
                  style={{
                    lineHeight: "1.959em",
                  }}
                >
                  {selectedOrder.status}
                </span>
              </div>
              {/* Close Button */}
              <button
                onClick={() => setShowOrderModal(false)}
                className="absolute top-0 right-0 w-[40px] h-[40px] flex items-center justify-center rounded-[6px] hover:bg-gray-100 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="#272C34"
                    strokeWidth="1.33"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-6">
              {/* Product Information & Delivery Information Row */}
              <div className="flex gap-[9px]">
                {/* Product Information */}
                <div className="flex-1 bg-white border border-[rgba(229,231,235,0.5)] rounded-[8px] p-[17px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] relative">
                  <div className="w-[51px] h-[57px] rounded-[7px] overflow-hidden mb-4">
                    <Image
                      src="/assets/images/rice.png"
                      alt={selectedOrder.order.product}
                      width={51}
                      height={57}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p
                      className="text-[12px] font-normal text-black"
                      style={{
                        lineHeight: "1.667em",
                      }}
                    >
                      {selectedOrder.order.product}
                    </p>
                    {selectedOrder.order.quantity && (
                      <p
                        className="text-[12px] font-normal text-black"
                        style={{
                          lineHeight: "1.667em",
                        }}
                      >
                        Quantity: {selectedOrder.order.quantity}
                      </p>
                    )}
                    {selectedOrder.order.certification && (
                      <p
                        className="text-[12px] font-light text-black"
                        style={{
                          lineHeight: "1.667em",
                        }}
                      >
                        Certification: {selectedOrder.order.certification}
                      </p>
                    )}
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="flex-1 bg-white border border-[rgba(229,231,235,0.5)] rounded-[8px] p-[17px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] relative">
                  <div className="flex items-center gap-[4.6px] mb-4">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 2L6 7L11 2"
                        stroke="#0B99A9"
                        strokeWidth="0.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 6L6 11L11 6"
                        stroke="#0B99A9"
                        strokeWidth="0.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <h3
                      className="text-[10px] font-light text-[#272C34]"
                      style={{
                        lineHeight: "1.034em",
                        letterSpacing: "-2.59%",
                      }}
                    >
                      Delivery Information
                    </h3>
                  </div>
                  <div className="flex flex-col gap-4">
                    {selectedOrder.deliveryFrom && (
                      <p
                        className="text-[12px] font-normal text-black"
                        style={{
                          lineHeight: "1.667em",
                        }}
                      >
                        From: {selectedOrder.deliveryFrom}
                      </p>
                    )}
                    <p
                      className="text-[12px] font-normal text-black"
                      style={{
                        lineHeight: "1.667em",
                      }}
                    >
                      To: {selectedOrder.deliveryLocation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Farmer & Processor Information Row */}
              <div className="flex gap-[9px]">
                {/* Farmer Information */}
                <div className="flex-1 bg-white border border-[rgba(229,231,235,0.5)] rounded-[8px] p-[25px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-[4.6px] mb-3">
                    <Image
                      src="/icons/leaf-01.svg"
                      alt="Farmer"
                      width={12}
                      height={12}
                    />
                    <h3
                      className="text-[10px] font-light text-[#272C34]"
                      style={{
                        lineHeight: "1.034em",
                        letterSpacing: "-2.59%",
                      }}
                    >
                      Farmer Information
                    </h3>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-[47px] h-[47px] rounded-full bg-[#D9D9D9] flex-shrink-0"></div>
                    <div className="flex flex-col gap-1">
                      <p
                        className="text-[14px] font-medium text-black"
                        style={{
                          lineHeight: "1.679em",
                        }}
                      >
                        {selectedOrder.farmer.name}
                      </p>
                      <p
                        className="text-[14px] font-light text-black"
                        style={{
                          lineHeight: "1.679em",
                        }}
                      >
                        {selectedOrder.farmer.location}, Nigeria
                      </p>
                    </div>
                  </div>
                </div>

                {/* Processor Information */}
                <div className="flex-1 bg-white border border-[rgba(229,231,235,0.5)] rounded-[8px] p-[25px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-[4.6px] mb-3">
                    <Image
                      src="/icons/tractor.svg"
                      alt="Processor"
                      width={12}
                      height={12}
                    />
                    <h3
                      className="text-[10px] font-light text-[#272C34]"
                      style={{
                        lineHeight: "1.034em",
                        letterSpacing: "-2.59%",
                      }}
                    >
                      Buyer Information
                    </h3>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-[47px] h-[47px] rounded-full bg-[#D9D9D9] flex-shrink-0"></div>
                    <div className="flex flex-col gap-1">
                      <p
                        className="text-[14px] font-medium text-black"
                        style={{
                          lineHeight: "1.679em",
                        }}
                      >
                        {selectedOrder.processor.name}
                      </p>
                      <p
                        className="text-[14px] font-light text-black"
                        style={{
                          lineHeight: "1.679em",
                        }}
                      >
                        {selectedOrder.processor.location}, Nigeria
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-[rgba(199,224,220,0.15)] rounded-[20px] p-[40px]">
                <div className="flex gap-[119px]">
                  <div className="flex flex-col gap-[9px]">
                    <p
                      className="text-[14px] font-normal text-[#5C5C5C]"
                      style={{
                        lineHeight: "1.679em",
                      }}
                    >
                      Order Value
                    </p>
                    <p
                      className="text-[16.45px] font-medium text-[#0BA964]"
                      style={{
                        lineHeight: "1.429em",
                      }}
                    >
                      {selectedOrder.order.value}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[9px]">
                    <p
                      className="text-[14px] font-normal text-[#5C5C5C]"
                      style={{
                        lineHeight: "1.679em",
                      }}
                    >
                      Payment Terms
                    </p>
                    <p
                      className="text-[16.45px] font-normal text-black"
                      style={{
                        lineHeight: "1.429em",
                      }}
                    >
                      {selectedOrder.paymentTerms || "On Delivery"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[9px]">
                    <p
                      className="text-[14px] font-normal text-[#5C5C5C]"
                      style={{
                        lineHeight: "1.679em",
                      }}
                    >
                      Delivery Date
                    </p>
                    <p
                      className="text-[16.45px] font-normal text-black"
                      style={{
                        lineHeight: "1.429em",
                      }}
                    >
                      {selectedOrder.orderDate || selectedOrder.deliveryDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div className="bg-white border border-[#E7E7E7] rounded-[12px] p-4">
                <div className="flex items-center gap-2">
                  <div className="w-[34px] h-[28px] bg-[#FF1418] rounded-[5px] flex items-center justify-center">
                    <span className="text-white text-[12px] font-medium">PDF</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-[2px]">
                    <p
                      className="text-[12px] font-semibold text-[#0B0B0B]"
                      style={{
                        lineHeight: "1.5em",
                      }}
                    >
                      Purchase Order for 2 Tons of Maize.pdf
                    </p>
                    <p
                      className="text-[12px] font-normal text-[#6D6D6D]"
                      style={{
                        lineHeight: "1.5em",
                      }}
                    >
                      500kb
                    </p>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Image
                      src="/icons/invoice-04.svg"
                      alt="View"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              </div>

              {/* Order Status Update */}
              <div className="flex flex-col gap-2">
                <p
                  className="text-[12px] font-normal text-black"
                  style={{
                    lineHeight: "1.5em",
                    letterSpacing: "-1.1%",
                  }}
                >
                  Order Status
                </p>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full h-[40px] px-[14px] pr-[40px] bg-white border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black outline-none appearance-none cursor-pointer shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)]"
                    style={{
                      lineHeight: "1.5em",
                      letterSpacing: "-1.1%",
                    }}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="8.33"
                        fill="#D9D9D9"
                      />
                      <path
                        d="M6.67 8.75L10 12.08L13.33 8.75"
                        stroke="#141B34"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-[17px] py-[9.5px] bg-[#FAFAFA] border border-[#E5E7EB] rounded-[6px] text-[14px] font-semibold text-[#272C34]"
                  style={{
                    lineHeight: "1.429em",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={selectedStatus === selectedOrder.status || isUpdatingOrderState}
                  className={`px-4 py-[9.5px] rounded-[6px] text-[14px] font-semibold text-white flex items-center gap-2 ${
                    selectedStatus === selectedOrder.status || isUpdatingOrderState
                      ? "bg-[#004829] opacity-50 cursor-not-allowed"
                      : "bg-[#004829] hover:bg-[#003d20] transition-colors"
                  }`}
                  style={{
                    lineHeight: "1.429em",
                  }}
                >
                  {isUpdatingOrderState ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        size="lg"
        className="bg-white rounded-[20px]"
        showCloseButton={false}
      >
        <div className="p-[40px] flex flex-col items-center">
          <div className="w-[87px] h-[87px] mb-6">
            <Image
              src="/assets/images/verified-checkmark-success.png"
              alt="Success"
              width={87}
              height={87}
              className="w-full h-full object-contain"
            />
          </div>
          <h2
            className="text-[24px] font-medium text-[#004829] mb-4 text-center"
            style={{
              lineHeight: "1.5em",
            }}
          >
            Order Status Updated Successfully!
          </h2>
          <p
            className="text-[20px] font-normal text-[#626262] mb-8 text-center"
            style={{
              lineHeight: "1.4em",
            }}
          >
            Order information has been updated successfully. Please close modal
            to continue.
          </p>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="px-[200px] py-[14px] bg-transparent border border-[#004829] rounded-[10px] text-[20px] font-medium text-[#004829] hover:bg-[#004829] hover:text-white transition-colors"
            style={{
              lineHeight: "0.809em",
            }}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

