"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days");

  const topUsers = [
    {
      rank: 1,
      name: "Eronini Feed Mills",
      orders: "24 Orders",
      revenue: "₦4,850,000",
      change: "+22.5%",
    },
    {
      rank: 2,
      name: "Augustus Processing Company",
      orders: "24 Orders",
      revenue: "₦2,500,000",
      change: "+22.5%",
    },
    {
      rank: 3,
      name: "Pristine Crops &Livestock",
      orders: "24 Orders",
      revenue: "₦1,350,000",
      change: "+22.5%",
    },
    {
      rank: 4,
      name: "Glorydays Farms",
      orders: "24 Orders",
      revenue: "₦1,050,000",
      change: "+22.5%",
    },
    {
      rank: 5,
      name: "Sachar Feed Mills",
      orders: "24 Orders",
      revenue: "₦750,000",
      change: "+22.5%",
    },
  ];

  const topRegions = [
    {
      rank: 1,
      name: "Lagos State",
      users: "98 users",
      revenue: "₦6,850,000",
      change: "+22.5%",
    },
    {
      rank: 2,
      name: "Kano State",
      users: "65 users",
      revenue: "₦2,500,000",
      change: "+15.8%",
    },
    {
      rank: 3,
      name: "Ogun State",
      users: "32 users",
      revenue: "₦2,350,000",
      change: "+15.8%",
    },
    {
      rank: 4,
      name: "Rivers State",
      users: "21 users",
      revenue: "₦2,100,000",
      change: "+15.8%",
    },
    {
      rank: 5,
      name: "Kaduna State",
      users: "28 users",
      revenue: "₦1,900,000",
      change: "+15.8%",
    },
  ];

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

        {/* Filters and Export */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            {/* Date Filter */}
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-[13px] py-[9px] pr-[40px] bg-white border border-[#F2F0ED] rounded-[10px] text-[14px] font-normal text-[#2E251F] outline-none appearance-none cursor-pointer h-[40px]"
                style={{
                  lineHeight: "1.429em",
                }}
              >
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
              <div className="absolute right-[13px] top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="#2E251F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Export Report Button */}
            <button
              className="flex items-center gap-2 px-[13px] py-[7.5px] bg-white border border-[#F2F0ED] rounded-[10px] text-[14px] font-medium text-[#2E251F] h-[36px]"
              style={{
                lineHeight: "1.429em",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10L2 14L14 14L14 10"
                  stroke="#2E251F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 2L8 10"
                  stroke="#2E251F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 6L8 2L12 6"
                  stroke="#2E251F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Export Report
            </button>
          </div>
        </div>

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
                ₦ 13,250,000
              </p>
              <div className="flex items-center gap-1">
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 16 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 1L12 5L8 9"
                    stroke="#16A249"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 5L8 9L12 5"
                    stroke="#16A249"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="text-[12px] font-normal text-[#16A249]"
                  style={{
                    lineHeight: "1.333em",
                  }}
                >
                  +18.5%
                </span>
              </div>
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
                603
              </p>
              <div className="flex items-center gap-1">
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 16 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 1L12 5L8 9"
                    stroke="#16A249"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 5L8 9L12 5"
                    stroke="#16A249"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="text-[12px] font-normal text-[#16A249]"
                  style={{
                    lineHeight: "1.333em",
                  }}
                >
                  +12.3%
                </span>
              </div>
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
                420
              </p>
              <div className="flex items-center gap-1">
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 16 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 1L12 5L8 9"
                    stroke="#16A249"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 5L8 9L12 5"
                    stroke="#16A249"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="text-[12px] font-normal text-[#16A249]"
                  style={{
                    lineHeight: "1.333em",
                  }}
                >
                  +8.7%
                </span>
              </div>
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
                ₦ 108,250
              </p>
              <div className="flex items-center gap-1">
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 16 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 11L4 7L8 3"
                    stroke="#EF4343"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 7L8 11L4 7"
                    stroke="#EF4343"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="text-[12px] font-normal text-[#EF4343]"
                  style={{
                    lineHeight: "1.333em",
                  }}
                >
                  -2.1%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Users and Regions */}
        <div className="grid grid-cols-2 gap-6">
          {/* Top Performing Users */}
          <div className="bg-white border border-[#E5E1DC] rounded-[12px] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="mb-6">
              <div className="flex items-center gap-[6px] mb-[6px]">
                <Image
                  src="/icons/user-multiple.svg"
                  alt="Users"
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
                  Top Performing Users
                </h3>
              </div>
              <p
                className="text-[14px] font-normal text-[#7E7167]"
                style={{
                  lineHeight: "1.429em",
                }}
              >
                Revenue generated by users
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {topUsers.map((user) => (
                <div
                  key={user.rank}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className="w-[32px] h-[32px] rounded-full bg-[rgba(22,162,73,0.1)] flex items-center justify-center flex-shrink-0">
                      <span
                        className="text-[14px] font-bold text-[#16A249]"
                        style={{
                          lineHeight: "1.429em",
                        }}
                      >
                        {user.rank}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p
                        className="text-[16px] font-medium text-[#2E251F]"
                        style={{
                          lineHeight: "1.5em",
                        }}
                      >
                        {user.name}
                      </p>
                      <p
                        className="text-[14px] font-normal text-[#7E7167]"
                        style={{
                          lineHeight: "1.429em",
                        }}
                      >
                        {user.orders}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p
                      className="text-[16px] font-medium text-[#2E251F]"
                      style={{
                        lineHeight: "1.5em",
                      }}
                    >
                      {user.revenue}
                    </p>
                    <div className="flex items-center gap-1">
                      <svg
                        width="16"
                        height="12"
                        viewBox="0 0 16 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 1L12 5L8 9"
                          stroke="#16A249"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 5L8 9L12 5"
                          stroke="#16A249"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span
                        className="text-[12px] font-normal text-[#16A249]"
                        style={{
                          lineHeight: "1.333em",
                        }}
                      >
                        {user.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Regions */}
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
                  Top Performing Regions
                </h3>
              </div>
              <p
                className="text-[14px] font-normal text-[#7E7167]"
                style={{
                  lineHeight: "1.429em",
                }}
              >
                Revenue and user growth by state
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {topRegions.map((region) => (
                <div
                  key={region.rank}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className="w-[32px] h-[32px] rounded-full bg-[rgba(22,162,73,0.1)] flex items-center justify-center flex-shrink-0">
                      <span
                        className="text-[14px] font-bold text-[#16A249]"
                        style={{
                          lineHeight: "1.429em",
                        }}
                      >
                        {region.rank}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p
                        className="text-[16px] font-medium text-[#2E251F]"
                        style={{
                          lineHeight: "1.5em",
                        }}
                      >
                        {region.name}
                      </p>
                      <p
                        className="text-[14px] font-normal text-[#7E7167]"
                        style={{
                          lineHeight: "1.429em",
                        }}
                      >
                        {region.users}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p
                      className="text-[16px] font-medium text-[#2E251F]"
                      style={{
                        lineHeight: "1.5em",
                      }}
                    >
                      {region.revenue}
                    </p>
                    <div className="flex items-center gap-1">
                      <svg
                        width="16"
                        height="12"
                        viewBox="0 0 16 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 1L12 5L8 9"
                          stroke="#16A249"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 5L8 9L12 5"
                          stroke="#16A249"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span
                        className="text-[12px] font-normal text-[#16A249]"
                        style={{
                          lineHeight: "1.333em",
                        }}
                      >
                        {region.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

