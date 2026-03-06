"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useAdminStore } from "@/app/store/useAdminStore";
export default function AnalyticsPage() {
  const { dashboardStats, isLoadingDashboard, fetchDashboardStats } = useAdminStore();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Top Header */}
      <div className="bg-[#F8F8F8] h-[104px] flex items-center justify-between px-12">
        {/* Left Side - Analytics Title */}
        <div className="flex items-center">
          <h1
            className="text-[28px] font-normal text-black"
            style={{
              lineHeight: "1.5em",
              letterSpacing: "-1.1%",
            }}
          >
            Analytics
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
          className="text-[16px] font-normal text-[#5C5C5C] mb-6"
          style={{ lineHeight: "1.5em" }}
        >
          Comprehensive platform insights and performance metrics
        </p>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Total Revenue Card */}
          <div className="bg-white border border-[#E5E1DC] rounded-[12px] p-[24px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-5">
              <h3
                className="text-[14px] font-medium text-[#2E251F]"
                style={{
                  lineHeight: "1.429em",
                  letterSpacing: "-2.5%",
                }}
              >
                Total Revenue
              </h3>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1.33V14.67"
                  stroke="#16A249"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                />
                <path
                  d="M4 3.33L8 1.33L12 3.33"
                  stroke="#16A249"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-[22px]">
              <p
                className="text-[32px] font-medium text-[#2E251F]"
                style={{ lineHeight: "1em" }}
              >
                {isLoadingDashboard ? "..." : `₦ ${(dashboardStats?.totalTransactionValue || 0).toLocaleString()}`}
              </p>
            </div>
          </div>

          {/* Total Transactions Card */}
          <div className="bg-white border border-[#E5E1DC] rounded-[12px] p-[24px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-5">
              <h3
                className="text-[14px] font-medium text-[#2E251F]"
                style={{
                  lineHeight: "1.429em",
                  letterSpacing: "-2.5%",
                }}
              >
                Total Transactions
              </h3>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.67 13.33L4.67 1.33L12 1.33L12 13.33"
                  stroke="#2E251F"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                />
                <path
                  d="M1.33 1.33L4.67 1.33L4.67 13.33L1.33 13.33"
                  stroke="#2E251F"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-[22px]">
              <p
                className="text-[32px] font-medium text-[#2E251F]"
                style={{ lineHeight: "1em" }}
              >
                {isLoadingDashboard ? "..." : (dashboardStats?.completedOrders || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Active Users Card */}
          <div className="bg-white border border-[#E5E1DC] rounded-[12px] p-[24px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-5">
              <h3
                className="text-[14px] font-medium text-[#2E251F]"
                style={{
                  lineHeight: "1.429em",
                  letterSpacing: "-2.5%",
                }}
              >
                Active Users
              </h3>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.33 1.33L1.33 10L6.67 10L6.67 14.67"
                  stroke="#3C83F6"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                />
                <path
                  d="M9.33 2L9.33 6.67L14.67 6.67L14.67 14.67"
                  stroke="#3C83F6"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-[22px]">
              <p
                className="text-[32px] font-medium text-[#2E251F]"
                style={{ lineHeight: "1em" }}
              >
                {isLoadingDashboard ? "..." : (dashboardStats?.totalUsers || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Avg Order Value Card */}
          <div className="bg-white border border-[#E5E1DC] rounded-[12px] p-[24px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-5">
              <h3
                className="text-[14px] font-medium text-[#2E251F]"
                style={{
                  lineHeight: "1.429em",
                  letterSpacing: "-2.5%",
                }}
              >
                Avg Order Value
              </h3>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6.67"
                  stroke="#E7B008"
                  strokeWidth="1.33"
                />
                <path
                  d="M8 4L8 8L10.67 10.67"
                  stroke="#E7B008"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-[22px]">
              <p
                className="text-[32px] font-medium text-[#2E251F]"
                style={{ lineHeight: "1em" }}
              >
                {isLoadingDashboard
                  ? "..."
                  : (() => {
                      const val = dashboardStats?.totalTransactionValue ?? 0;
                      const orders = dashboardStats?.completedOrders ?? 0;
                      return orders > 0
                        ? `₦ ${Math.round(val / orders).toLocaleString()}`
                        : "₦ 0";
                    })()}
              </p>
            </div>
          </div>
        </div>

        {/* Top Performing Farmers and Processors */}
        <div className="grid grid-cols-2 gap-6">
          {/* Top Performing Farmers */}
          <div className="bg-white border border-[#E5E1DC] rounded-[12px] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="mb-6">
              <div className="flex items-center gap-[6px] mb-[6px]">
                <Image
                  src="/icons/user-multiple.svg"
                  alt="Farmers"
                  width={24}
                  height={24}
                />
                <h3
                  className="text-[24px] font-medium text-[#2E251F]"
                  style={{
                    lineHeight: "1em",
                    letterSpacing: "-2.5%",
                  }}
                >
                  Top Performing Farmers
                </h3>
              </div>
              <p
                className="text-[14px] font-normal text-[#7E7167]"
                style={{
                  lineHeight: "1.429em",
                }}
              >
                Revenue generated by farmers
              </p>
            </div>

            <div className="flex items-center justify-center py-16">
              <p className="text-[18px] font-medium text-[#7E7167]">Coming Soon</p>
            </div>
          </div>

          {/* Top Performing Processors */}
          <div className="bg-white border border-[#E5E1DC] rounded-[12px] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="mb-6">
              <div className="flex items-center gap-[6px] mb-[6px]">
                <svg
                  width="28"
                  height="20"
                  viewBox="0 0 28 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 2.5L25.5 2.5L25.5 17.5L2.5 17.5L2.5 2.5Z"
                    stroke="#2E251F"
                    strokeWidth="1.67"
                  />
                  <path
                    d="M25.5 7.5L2.5 7.5"
                    stroke="#2E251F"
                    strokeWidth="1.67"
                  />
                  <path
                    d="M10.83 4.17L2.5 4.17L2.5 11.67"
                    stroke="#2E251F"
                    strokeWidth="1.67"
                  />
                </svg>
                <h3
                  className="text-[24px] font-medium text-[#2E251F]"
                  style={{
                    lineHeight: "1em",
                    letterSpacing: "-2.5%",
                  }}
                >
                  Top Performing Processors
                </h3>
              </div>
              <p
                className="text-[14px] font-normal text-[#7E7167]"
                style={{
                  lineHeight: "1.429em",
                }}
              >
                Revenue generated by processors
              </p>
            </div>

            <div className="flex items-center justify-center py-16">
              <p className="text-[18px] font-medium text-[#7E7167]">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

