"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Modal from "@/app/components/Modal";
import apiClient from "@/app/utils/apiClient";
import { User } from "@/app/types";
import { useBuyRequestStore } from "@/app/store/useRequestStore";
import AnimatedLoading from "@/app/Loading";
import Link from "next/link";

interface OrderDetails {
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
  orderState?: string;
  statusColor: string;
  deliveryDate: string;
  orderDate?: string;
  paymentTerms?: string;
}

export default function UserDetailsPage() {
  const params = useParams();
  const userId = params.id as string;
  const { fetchUserRequests, userRequests, isFetching: isFetchingRequests } = useBuyRequestStore();
  
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const isProcessor = userData?.role === "processor";
  const [activeTab, setActiveTab] = useState(isProcessor ? "Processor Details" : "Farmer Details");

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<{ statusCode: number; message: string; data: User }>(
          `/users?userId=${userId}`
        );
        if (response.data.statusCode === 200 && response.data.data) {
          setUserData(response.data.data);
          // Fetch user requests for orders
          await fetchUserRequests(response.data.data.id);
        } else {
          throw new Error(response.data.message || 'Failed to fetch user data');
        }
      } catch (error: unknown) {
        console.error('Error fetching user data:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load user data';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, fetchUserRequests]);

  // Form state - initialize when userData is loaded
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    farmLocation: '',
    country: '',
    state: '',
    accountName: '',
    bankName: '',
    accountNumber: '',
    farmName: '',
    cropsGrown: '',
    farmSize: '',
    estimatedProduction: '',
  });

  // Update form data when userData is loaded
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phoneNumber || '',
        farmLocation: userData.farmAddress || '',
        country: userData.country || '',
        state: userData.state || '',
        accountName: `${userData.firstName} ${userData.lastName}`,
        bankName: userData.bankName || '',
        accountNumber: userData.accountNumber || '',
        farmName: userData.farmName || userData.companyName || '',
        cropsGrown: userData.crops?.map(c => c.name).join(", ") || '',
        farmSize: userData.farmSize ? `${userData.farmSize} ${userData.farmSizeUnit || ''}` : '',
        estimatedProduction: userData.estimatedAnnualProduction ? `${userData.estimatedAnnualProduction} ${(userData as User & { estimatedAnnualProductionUnit?: string }).estimatedAnnualProductionUnit || ''}` : '',
      });
      setActiveTab(isProcessor ? "Processor Details" : "Farmer Details");
    }
  }, [userData, isProcessor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setShowConfirmModal(false);
    // In real app, save to API here
    setTimeout(() => {
      setShowSuccessModal(true);
      setIsEditing(false);
    }, 500);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
  };

  // Convert user requests to order details format
  const orders: OrderDetails[] = userRequests.map((req) => ({
    id: req.requestNumber?.toString() || req.id,
    farmer: {
      name: req.seller?.farmName || `${req.seller?.firstName || ''} ${req.seller?.lastName || ''}`.trim() || 'Unknown',
      id: req.seller?.id || 'N/A',
      location: req.seller?.state || 'Unknown',
    },
    processor: {
      name: req.buyer?.companyName || `${req.buyer?.firstName || ''} ${req.buyer?.lastName || ''}`.trim() || 'Unknown',
      id: req.buyer?.id || 'N/A',
      location: req.buyer?.state || 'Unknown',
    },
    order: {
      product: req.cropType?.name || req.description || 'Unknown',
      value: `₦${(parseFloat(req.pricePerUnitOffer || '0') * parseFloat(req.productQuantity || '0')).toLocaleString()}`,
      quantity: `${req.productQuantity} ${req.productQuantityUnit}`,
      certification: req.qualityStandardType?.name || 'N/A',
    },
    deliveryLocation: req.deliveryLocation || 'N/A',
    deliveryFrom: req.seller?.farmAddress || undefined,
    status: req.status || 'pending',
    orderState: req.orderState || undefined,
    statusColor: req.status === 'completed' ? '#0BA964' : req.status === 'accepted' ? '#1E89EE' : '#EEC41E',
    deliveryDate: req.estimatedDeliveryDate ? new Date(req.estimatedDeliveryDate).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }) : 'TBD',
    orderDate: new Date(req.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    paymentTerms: req.preferredPaymentMethod?.replace(/_/g, ' ') || 'On Delivery',
  }));

  // Calculate total orders and revenue (only from completed orders)
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => {
    const statusLower = order.status.toLowerCase();
    return statusLower === 'completed' || order.orderState?.toLowerCase() === 'completed';
  });
  
  const totalRevenue = completedOrders.reduce((sum, order) => {
    const value = parseFloat(order.order.value.replace(/[₦,]/g, ''));
    return sum + value;
  }, 0);
  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <AnimatedLoading />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'User not found'}</p>
          <Link href="/admin/user-management" className="text-mainGreen hover:underline">
            Back to User Management
          </Link>
        </div>
      </div>
    );
  }

  // Get user display name
  const userName = isProcessor 
    ? (userData.companyName || `${userData.firstName} ${userData.lastName}`)
    : (userData.farmName || `${userData.firstName} ${userData.lastName}`);

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Top Header */}
      <div className="bg-[#F8F8F8] h-[104px] flex items-center justify-between px-12">
        <div className="flex items-center">
          <h1
            className="text-[28px] font-normal text-black"
            style={{
              lineHeight: "1.5em",
              letterSpacing: "-1.1%",
            }}
          >
            User Management
          </h1>
        </div>

        <div className="flex items-center gap-[27px]">
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
              className="flex-1 outline-none text-[16px] font-normal text-[#A2A2A2]"
            />
          </div>

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
        {/* User Profile Card */}
        <div className="bg-[rgba(250,250,250,0.6)] rounded-[10px] border border-dashed border-[rgba(115,115,115,0.6)] p-[27px] mb-[40px] relative" style={{ minHeight: "321px" }}>
          {/* Profile Image - Top Left */}
          <div className="absolute top-[28px] left-[20px] w-[64px] h-[64px] rounded-[12px] overflow-hidden">
            <Image
              src="/icons/user-multiple.svg"
              alt="Profile"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name and Role - Top Left (after image) */}
          <div className="absolute top-[27px] left-[102px] flex flex-col gap-1">
            <p
              className="text-[16px] font-normal text-[#5C5C5C]"
              style={{ lineHeight: "1.5em" }}
            >
              {userData.role === 'processor' ? 'Processor' : 'Farmer'}
            </p>
            <p
              className="text-[20px] font-normal text-black"
              style={{
                lineHeight: "1.5em",
                letterSpacing: "-1.1%",
              }}
            >
              {userName}
            </p>
          </div>

          {/* Email Address - Top Right */}
          <div className="absolute top-[27px] left-[587px] flex flex-col gap-1">
            <p
              className="text-[16px] font-normal text-[#5C5C5C]"
              style={{ lineHeight: "1.5em" }}
            >
              Email Address
            </p>
            <p
              className="text-[20px] font-normal text-black"
              style={{
                lineHeight: "1.5em",
                letterSpacing: "-1.1%",
              }}
            >
              {userData.email}
            </p>
          </div>

          {/* Phone Number - Middle Right */}
          <div className="absolute top-[114px] left-[587px] flex flex-col gap-1">
            <p
              className="text-[16px] font-normal text-[#5C5C5C]"
              style={{ lineHeight: "1.5em" }}
            >
              Phone Number
            </p>
            <p
              className="text-[20px] font-normal text-black"
              style={{
                lineHeight: "1.5em",
                letterSpacing: "-1.1%",
              }}
            >
              {userData.phoneNumber}
            </p>
          </div>

          {/* Total Orders & Revenue - Top Right */}
          <div className="absolute top-[28px] right-[20px] bg-[rgba(106,124,106,0.05)] rounded-[20px] p-[18px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)]" style={{ width: "266px" }}>
            <div className="flex gap-[37px]">
              <div className="flex flex-col gap-[20px]">
                <p
                  className="text-[16px] font-normal text-[#004829]"
                  style={{
                    lineHeight: "1.5em",
                    letterSpacing: "-1.1%",
                  }}
                >
                  Total Orders
                </p>
                <p
                  className="text-[20px] font-medium text-[#28433D]"
                  style={{ lineHeight: "1em" }}
                >
                  {totalOrders}
                </p>
              </div>
              <div className="w-[1px] h-[96px] bg-[#CFCFCF]"></div>
              <div className="flex flex-col gap-[20px]">
                <p
                  className="text-[16px] font-normal text-[#004829]"
                  style={{
                    lineHeight: "1.5em",
                    letterSpacing: "-1.1%",
                  }}
                >
                  {isProcessor ? 'Total Money Spent' : 'Total Revenue'}
                </p>
                <p
                  className="text-[20px] font-medium text-[#28433D]"
                  style={{ lineHeight: "1em" }}
                >
                  ₦ {totalRevenue.toLocaleString()}
                </p>
                <p
                  className="text-[12px] font-normal text-[#6A7C6A] mt-1"
                  style={{ lineHeight: "1em" }}
                >
                  From {completedOrders.length} completed {completedOrders.length === 1 ? 'order' : 'orders'}
                </p>
              </div>
            </div>
          </div>

          {/* Location - Bottom Left */}
          <div className="absolute top-[114px] left-[102px] flex flex-col gap-1" style={{ width: "335px" }}>
            <p
              className="text-[16px] font-normal text-[#5C5C5C]"
              style={{ lineHeight: "1.5em" }}
            >
              Location
            </p>
            <p
              className="text-[20px] font-normal text-black"
              style={{
                lineHeight: "1.5em",
                letterSpacing: "-1.1%",
              }}
            >
              {userData.farmAddress || `${userData.state}, ${userData.country}`}
            </p>
          </div>

          {/* Disable User Button - Bottom Left */}
          <button className="absolute bottom-[27px] left-[102px] bg-[#EEC41E] rounded-[10px] px-[19px] py-[13px] flex items-center gap-[10px] shadow-[0px_0px_1.62px_0px_rgba(0,0,0,0.25)]">
            <Image
              src="/icons/unavailable.svg"
              alt="Disable"
              width={19}
              height={19}
            />
            <span
              className="text-[14px] font-medium text-white"
              style={{
                lineHeight: "1.156em",
              }}
            >
              Disable User
            </span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-[40px] border-b border-[#EAECF0]">
          <div className="flex gap-[10px]">
            <button
              onClick={() => setActiveTab(isProcessor ? "Processor Details" : "Farmer Details")}
              className={`px-1 pb-[11px] text-[18px] font-semibold transition-colors ${
                activeTab === (isProcessor ? "Processor Details" : "Farmer Details")
                  ? "text-[#004829] border-b-2 border-[#004829]"
                  : "text-[#667085]"
              }`}
              style={{
                lineHeight: "1.333em",
              }}
            >
              {isProcessor ? "Processor Details" : "Farmer Details"}
            </button>
            <button
              onClick={() => setActiveTab("Order History")}
              className={`px-1 pb-[11px] text-[18px] font-semibold transition-colors ${
                activeTab === "Order History"
                  ? "text-[#004829] border-b-2 border-[#004829]"
                  : "text-[#667085]"
              }`}
              style={{
                lineHeight: "1.333em",
              }}
            >
              Order History
            </button>
          </div>
        </div>

        {/* Form Section */}
        {(activeTab === "Farmer Details" || activeTab === "Processor Details") && (
          <div className="bg-white rounded-[20px] p-[33px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)]">
            {/* Basic Information */}
            <div className="mb-[63px]">
              <div className="flex justify-between items-start mb-[27px]">
                <div>
                  <h3
                    className="text-[18px] font-medium text-black mb-[10px]"
                    style={{
                      lineHeight: "0.899em",
                    }}
                  >
                    Basic Information
                  </h3>
                  <p
                    className="text-[16px] font-normal text-[#5E5E5E]"
                    style={{
                      lineHeight: "1.011em",
                    }}
                  >
                    Personal details of {isProcessor ? "processor" : "farmer"}
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-[10px]"
                  >
                    <Image
                      src="/icons/pencil-edit-02.svg"
                      alt="Edit"
                      width={19}
                      height={19}
                    />
                    <span
                      className="text-[14px] font-medium text-[#004829]"
                      style={{
                        lineHeight: "1.156em",
                      }}
                    >
                      Edit Details
                    </span>
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-[34px]">
                {/* First Name & Last Name */}
                <div className="flex gap-[24px]">
                  <div className="flex-1">
                    <label
                      className="block text-[12px] font-normal text-black mb-[7px]"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      className="block text-[12px] font-normal text-black mb-[7px]"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="flex gap-[24px]">
                  <div className="flex-1">
                    <label
                      className="block text-[12px] font-normal text-black mb-[7px]"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      className="block text-[12px] font-normal text-black mb-[7px]"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    />
                  </div>
                </div>

                {/* Location Field - Different label for processor */}
                <div>
                  <label
                    className="block text-[12px] font-normal text-black mb-[7px]"
                    style={{
                      lineHeight: "1.5em",
                      letterSpacing: "-1.1%",
                    }}
                  >
                    {isProcessor ? "Company Location" : "Farm Location"}
                  </label>
                  <textarea
                    name="farmLocation"
                    value={formData.farmLocation}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-[10px] py-[10px] bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60 resize-none"
                    style={{
                      lineHeight: "1.5em",
                      letterSpacing: "-1.1%",
                    }}
                  />
                </div>

                {/* Country & State */}
                <div className="flex gap-[24px]">
                  <div className="flex-1">
                    <label
                      className="block text-[12px] font-normal text-black mb-[7px]"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    >
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      className="block text-[12px] font-normal text-black mb-[7px]"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    >
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information - Only for Farmers, Processors have it after Business Details */}
            {!isProcessor && (
              <>
                <div className="w-full h-[1px] bg-[#CECECE] mb-[63px]"></div>
                <div className="mb-[63px]">
                  <div className="mb-[25px]">
                    <h3
                      className="text-[18px] font-medium text-black mb-[10px]"
                      style={{
                        lineHeight: "0.899em",
                      }}
                    >
                      Payment Information
                    </h3>
                    <p
                      className="text-[16px] font-normal text-[#5E5E5E]"
                      style={{
                        lineHeight: "1.011em",
                      }}
                    >
                      Account details for receipt of payment
                    </p>
                  </div>

                  <div className="flex flex-col gap-[34px]">
                    {/* Account Name & Bank Name */}
                    <div className="flex gap-[24px]">
                      <div className="flex-1">
                        <label
                          className="block text-[12px] font-normal text-black mb-[7px]"
                          style={{
                            lineHeight: "1.5em",
                            letterSpacing: "-1.1%",
                          }}
                        >
                          Account Name *
                        </label>
                        <input
                          type="text"
                          name="accountName"
                          value={formData.accountName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                          style={{
                            lineHeight: "1.5em",
                            letterSpacing: "-1.1%",
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-[12px] font-normal text-black mb-[7px]"
                          style={{
                            lineHeight: "1.5em",
                            letterSpacing: "-1.1%",
                          }}
                        >
                          Bank Name *
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                          style={{
                            lineHeight: "1.5em",
                            letterSpacing: "-1.1%",
                          }}
                        />
                      </div>
                    </div>

                    {/* Account Number */}
                    <div>
                      <label
                        className="block text-[12px] font-normal text-black mb-[7px]"
                        style={{
                          lineHeight: "1.5em",
                          letterSpacing: "-1.1%",
                        }}
                      >
                        Account Number *
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                        style={{
                          lineHeight: "1.5em",
                          letterSpacing: "-1.1%",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Business Details & Capacity (for Processor) or Farm Information (for Farmer) */}
            <div>
              <div className="mb-[25px]">
                <h3
                  className="text-[18px] font-medium text-black mb-[10px]"
                  style={{
                    lineHeight: "0.899em",
                  }}
                >
                  {isProcessor ? "Business Details & Capacity" : "Farm Information"}
                </h3>
                <p
                  className="text-[16px] font-normal text-[#5E5E5E]"
                  style={{
                    lineHeight: "1.011em",
                  }}
                >
                  Details on the {isProcessor ? "farm capacity" : "farm capacity"}
                </p>
              </div>

              <div className="flex flex-col gap-[34px]">
                {/* Type of Business/Business Name & Crops Needed/Grown */}
                <div className="flex gap-[24px]">
                  <div className="flex-1">
                    <label
                      className="block text-[12px] font-normal text-black mb-[7px]"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    >
                      {isProcessor ? "Type of Business *" : "Farm Name *"}
                    </label>
                    <input
                      type="text"
                      name="farmName"
                      value={formData.farmName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      className="block text-[12px] font-normal text-black mb-[7px]"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    >
                      {isProcessor ? "Crops needed *" : "Crops grown *"}
                    </label>
                    <div className="flex flex-wrap gap-[5px] px-[10px] py-[10px] bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] min-h-[36px]">
                      {formData.cropsGrown.split(", ").map((crop: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-[10px] py-0 bg-[#F8F8F8] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] rounded-[4px] text-[12px] font-light text-black"
                          style={{
                            lineHeight: "1.5em",
                          }}
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* For Processor: Account Number field here, For Farmer: Farm Size & Estimated Production */}
                {isProcessor ? (
                  <div>
                    <label
                      className="block text-[12px] font-normal text-black mb-[7px]"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    >
                      Account Number *
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                      style={{
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex gap-[24px]">
                    <div className="flex-1">
                      <label
                        className="block text-[12px] font-normal text-black mb-[7px]"
                        style={{
                          lineHeight: "1.5em",
                          letterSpacing: "-1.1%",
                        }}
                      >
                        Farm Size *
                      </label>
                      <input
                        type="text"
                        name="farmSize"
                        value={formData.farmSize}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                        style={{
                          lineHeight: "1.5em",
                          letterSpacing: "-1.1%",
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        className="block text-[12px] font-normal text-black mb-[7px]"
                        style={{
                          lineHeight: "1.5em",
                          letterSpacing: "-1.1%",
                        }}
                      >
                        Estimated Annual Production *
                      </label>
                      <input
                        type="text"
                        name="estimatedProduction"
                        value={formData.estimatedProduction}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                        style={{
                          lineHeight: "1.5em",
                          letterSpacing: "-1.1%",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* For Processor: Additional Business Details section */}
            {isProcessor && (
              <>
                <div className="w-full h-[1px] bg-[#CECECE] mb-[63px] mt-[63px]"></div>
                <div>
                  <div className="mb-[25px]">
                    <h3
                      className="text-[18px] font-medium text-black mb-[10px]"
                      style={{
                        lineHeight: "0.899em",
                      }}
                    >
                      Business Details & Capacity
                    </h3>
                    <p
                      className="text-[16px] font-normal text-[#5E5E5E]"
                      style={{
                        lineHeight: "1.011em",
                      }}
                    >
                      Details on the farm capacity
                    </p>
                  </div>

                  <div className="flex flex-col gap-[34px]">
                    {/* Type of Business & Crops Needed */}
                    <div className="flex gap-[24px]">
                      <div className="flex-1">
                        <label
                          className="block text-[12px] font-normal text-black mb-[7px]"
                          style={{
                            lineHeight: "1.5em",
                            letterSpacing: "-1.1%",
                          }}
                        >
                          Type of Business *
                        </label>
                        <input
                          type="text"
                          name="farmName"
                          value={formData.farmName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                          style={{
                            lineHeight: "1.5em",
                            letterSpacing: "-1.1%",
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-[12px] font-normal text-black mb-[7px]"
                          style={{
                            lineHeight: "1.5em",
                            letterSpacing: "-1.1%",
                          }}
                        >
                          Crops needed *
                        </label>
                        <div className="flex flex-wrap gap-[5px] px-[10px] py-[10px] bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] min-h-[36px]">
                          {formData.cropsGrown.split(", ").map((crop: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-[10px] py-0 bg-[#F8F8F8] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] rounded-[4px] text-[12px] font-light text-black"
                              style={{
                                lineHeight: "1.5em",
                              }}
                            >
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Farm Size & Estimated Annual Request */}
                    <div className="flex gap-[24px]">
                      <div className="flex-1">
                        <label
                          className="block text-[12px] font-normal text-black mb-[7px]"
                          style={{
                            lineHeight: "1.5em",
                            letterSpacing: "-1.1%",
                          }}
                        >
                          Farm Size *
                        </label>
                        <input
                          type="text"
                          name="farmSize"
                          value={formData.farmSize}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                          style={{
                            lineHeight: "1.5em",
                            letterSpacing: "-1.1%",
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-[12px] font-normal text-black mb-[7px]"
                          style={{
                            lineHeight: "1.5em",
                            letterSpacing: "-1.1%",
                          }}
                        >
                          Estimated Annual Request *
                        </label>
                        <input
                          type="text"
                          name="estimatedProduction"
                          value={formData.estimatedProduction}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                          style={{
                            lineHeight: "1.5em",
                            letterSpacing: "-1.1%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information for Processor */}
                <div className="w-full h-[1px] bg-[#CECECE] mb-[63px] mt-[63px]"></div>
                <div className="mb-[63px]">
                  <div className="mb-[25px]">
                    <h3
                      className="text-[18px] font-medium text-black mb-[10px]"
                      style={{
                        lineHeight: "0.899em",
                      }}
                    >
                      Payment Information
                    </h3>
                    <p
                      className="text-[16px] font-normal text-[#5E5E5E]"
                      style={{
                        lineHeight: "1.011em",
                      }}
                    >
                      Account details for receipt of payment
                    </p>
                  </div>

                  <div className="flex flex-col gap-[34px]">
                    {/* Account Name & Bank Name */}
                    <div className="flex gap-[24px]">
                      <div className="flex-1">
                        <label
                          className="block text-[12px] font-normal text-black mb-[7px]"
                          style={{
                            lineHeight: "1.5em",
                            letterSpacing: "-1.1%",
                          }}
                        >
                          Account Name *
                        </label>
                        <input
                          type="text"
                          name="accountName"
                          value={formData.accountName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                          style={{
                            lineHeight: "1.5em",
                            letterSpacing: "-1.1%",
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-[12px] font-normal text-black mb-[7px]"
                          style={{
                            lineHeight: "1.5em",
                            letterSpacing: "-1.1%",
                          }}
                        >
                          Bank Name *
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                          style={{
                            lineHeight: "1.5em",
                            letterSpacing: "-1.1%",
                          }}
                        />
                      </div>
                    </div>

                    {/* Account Number */}
                    <div>
                      <label
                        className="block text-[12px] font-normal text-black mb-[7px]"
                        style={{
                          lineHeight: "1.5em",
                          letterSpacing: "-1.1%",
                        }}
                      >
                        Account Number *
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full h-[36px] px-[10px] py-0 bg-[#F8F8F8] border border-[#5E5E5E] rounded-[8px] text-[12px] font-medium text-black disabled:opacity-60"
                        style={{
                          lineHeight: "1.5em",
                          letterSpacing: "-1.1%",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Save Button (only shown when editing) */}
            {isEditing && (
              <div className="flex justify-end mt-[40px]">
                <button
                  onClick={handleSaveClick}
                  className="px-[40px] py-[12px] bg-[#004829] rounded-[10px] text-[16px] font-medium text-white shadow-[0px_0px_1.62px_0px_rgba(0,0,0,0.25)]"
                  style={{
                    lineHeight: "1.011em",
                  }}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}

        {/* Order History Tab Content */}
        {activeTab === "Order History" && (
          <div className="bg-[#FFFFFC] rounded-[12px] border border-[#EBE7E5] shadow-[0px_2px_8px_0px_rgba(51,117,54,0.08)]">
            {/* Search and Filter Section */}
            <div className="px-[17px] py-[17px] flex gap-4 items-center relative">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search ..."
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
                  className="bg-transparent outline-none text-[14px] text-[#0D3F11]"
                  style={{
                    fontFamily: "Effra, sans-serif",
                    lineHeight: "1.429em",
                  }}
                >
                  <option>All Status</option>
                </select>
              </div>
              {/* Export Data Button */}
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#004829] rounded-[10px] shadow-[0px_0px_1.62px_0px_rgba(0,0,0,0.25)] h-[45px]"
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
                      Order
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
                      Delivery Location
                    </th>
                    <th
                      className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]"
                      style={{
                        fontFamily: "Effra, sans-serif",
                        lineHeight: "1.429em",
                      }}
                    >
                      Value
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
                  {isFetchingRequests ? (
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
                    orders.map((orderItem) => (
                    <tr key={orderItem.id} className="border-b border-[#EBE7E5]">
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <p
                            className="text-[14px] font-medium text-black"
                            style={{
                              fontFamily: "Effra, sans-serif",
                              lineHeight: "1.429em",
                            }}
                          >
                            {orderItem.order.product} ({orderItem.order.quantity})
                          </p>
                          <p
                            className="text-[14px] font-normal text-[#80726B]"
                            style={{
                              fontFamily: "Effra, sans-serif",
                              lineHeight: "1.429em",
                            }}
                          >
                            ID: {orderItem.id}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p
                          className="text-[14px] font-normal text-black"
                          style={{
                            fontFamily: "Effra, sans-serif",
                            lineHeight: "1.429em",
                          }}
                        >
                          {orderItem.processor.name}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p
                          className="text-[14px] font-normal text-black"
                          style={{
                            fontFamily: "Effra, sans-serif",
                            lineHeight: "1.429em",
                          }}
                        >
                          {orderItem.deliveryLocation}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p
                          className="text-[14px] font-medium text-black"
                          style={{
                            fontFamily: "Effra, sans-serif",
                            lineHeight: "1.429em",
                          }}
                        >
                          {orderItem.order.value}
                        </p>
                        {/* <div
                          className="inline-flex items-center gap-[6.75px] px-[11.75px] py-[11.75px] rounded-[11.75px] mt-1"
                          style={{
                            backgroundColor: orderItem.paymentTerms === "Paid" ? "#0BA964" : "#EEC41E",
                          }}
                        >
                          <span
                            className="text-[12px] font-normal text-white"
                            style={{
                              lineHeight: "1.959em",
                              fontFamily: "Urbanist, sans-serif",
                            }}
                          >
                            {orderItem.paymentTerms === "Paid" ? "Payment Complete" : "Pending Payment"}
                          </span>
                        </div> */}
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className="inline-flex items-center gap-[6.75px] px-[11.75px] py-[11.75px] rounded-[11.75px]"
                          style={{
                            backgroundColor: orderItem.statusColor,
                          }}
                        >
                          {/* Status Icon - Different icons for different statuses */}
                          {orderItem.status === "Awaiting Shipping" && (
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="7" cy="7" r="6" stroke="white" strokeWidth="1.5" fill="none"/>
                              <path d="M7 3V7L10 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          )}
                          {orderItem.status === "In Transit" && (
                            <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1.17 8.67H8.75V2.17H11.67V8.67H12.83" stroke="white" strokeWidth="1" strokeLinecap="round"/>
                              <path d="M2.92 8.67H11.13V10.84H2.92V8.67Z" stroke="white" strokeWidth="1" strokeLinecap="round"/>
                              <path d="M5.83 4.33H7" stroke="white" strokeWidth="1" strokeLinecap="round"/>
                            </svg>
                          )}
                          {orderItem.status === "Delivered" && (
                            <Image
                              src="/icons/package-delivered-01.svg"
                              alt="Status"
                              width={14}
                              height={14}
                              className="object-contain"
                            />
                          )}
                          {orderItem.status === "Completed" && (
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.99 3.29L5.83 9.47L2.01 5.65" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          <span
                            className="text-[12px] font-normal text-white"
                            style={{
                              lineHeight: "1.959em",
                              fontFamily: "Urbanist, sans-serif",
                            }}
                          >
                            {orderItem.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(orderItem);
                            setShowOrderModal(true);
                          }}
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
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        size="md"
        showCloseButton={false}
        className="rounded-[20px] max-w-[602px]"
      >
        <div className="flex flex-col items-center text-center py-0 px-0">
          <div className="w-full px-[31px] pt-[57px] pb-0">
            {/* Icon */}
            <div className="w-[69px] h-[69px] rounded-full bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center mb-[23px] mx-auto">
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3.17L19 35.67"
                  stroke="#EEC41E"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M9.48 11.08L19 3.17L28.52 11.08"
                  stroke="#EEC41E"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.98 22.17L19 35.67L12.67 22.17"
                  stroke="#EEC41E"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3
              className="text-[24px] font-medium text-black mb-[32px]"
              style={{
                lineHeight: "1.5em",
              }}
            >
              Update Information?
            </h3>
            <p
              className="text-[20px] font-normal text-[#626262] mb-[41px]"
              style={{
                lineHeight: "1.4em",
              }}
            >
              Are you sure you want to save these changes?
            </p>

            <div className="flex gap-[14px] justify-center pb-[57px]">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-[87px] py-[14px] border border-[#004829] rounded-[10px] text-[16px] font-medium text-[#004829] shadow-[0px_0px_1.62px_0px_rgba(0,0,0,0.25)]"
                style={{
                  lineHeight: "1.011em",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="px-[67px] py-[14px] bg-[#004829] rounded-[10px] text-[16px] font-medium text-white shadow-[0px_0px_1.62px_0px_rgba(0,0,0,0.25)]"
                style={{
                  lineHeight: "1.011em",
                }}
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      </Modal>

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
                className={`inline-flex items-center gap-[6.75px] px-[11.75px] py-[11.75px] rounded-[11.75px] ${
                  selectedOrder.status === "Completed"
                    ? "bg-[#0BA964]"
                    : selectedOrder.status === "Awaiting Shipping"
                    ? "bg-[#EEC41E]"
                    : selectedOrder.status === "In Transit"
                    ? "bg-[#1E89EE]"
                    : selectedOrder.status === "Delivered"
                    ? "border border-[#0BA964] bg-transparent"
                    : "bg-[#EEC41E]"
                }`}
              >
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
                  className={`text-[12px] font-normal ${
                    selectedOrder.status === "Delivered"
                      ? "text-[#0BA964]"
                      : "text-white"
                  }`}
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
                      Purchase Order for {selectedOrder.order.product}.pdf
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
            </div>
          </div>
        )}
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        size="md"
        showCloseButton={false}
        className="rounded-[20px] max-w-[666px]"
      >
        <div className="flex flex-col items-center text-center py-0 px-0">
          <div className="w-full px-[74px] pt-[47px] pb-[47px]">
            {/* Success Icon */}
            <Image
              src="/icons/verified-checkmark-success.png"
              alt="Success"
              width={87}
              height={87}
              className="mb-[12px] mx-auto"
            />

            <h3
              className="text-[24px] font-medium text-[#004829] mb-[22px]"
              style={{
                lineHeight: "1.5em",
              }}
            >
              Information Updated Successfully!
            </h3>
            <p
              className="text-[20px] font-normal text-[#626262] mb-[47px]"
              style={{
                lineHeight: "1.4em",
              }}
            >
              User information has been updated successfully. Please close modal to continue.
            </p>

            <button
              onClick={handleSuccessClose}
              className="w-full py-[14px] border border-[#004829] rounded-[10px] text-[20px] font-medium text-[#004829] shadow-[0px_0px_1.62px_0px_rgba(0,0,0,0.25)]"
              style={{
                lineHeight: "0.809em",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

