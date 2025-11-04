"use client";
import React, { useState } from "react";
import Image from "next/image";
import ChartCard from "../components/dashboard/ChartCard";

export default function AdminDashboard() {
  const [activeTableTab, setActiveTableTab] = useState("Ongoing Orders");

  const tabs = ["12 months", "30 days", "7 days", "24 hours"];

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Top Header */}
      <div className="bg-[#F8F8F8] h-[104px] flex items-center justify-between px-12">
        {/* Left Side - Dashboard Overview Title */}
        <div className="flex items-center">
          <h1
            className="text-[28px] font-normal text-black"
            style={{
              lineHeight: "1.5em",
              letterSpacing: "-1.1%",
            }}
          >
            Administrator
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
        <p className="text-[24px] font-medium text-[#101828] mb-[20px]" style={{ lineHeight: "1.5em", letterSpacing: "-1.1%" }}>Dashboard Overview</p>
        {/* Stats Cards Row */}
        <div className="grid grid-cols-4 gap-[17px] mb-[18px]">
          {/* Total Users Card */}
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
                  Total Users
                </p>
                <p
                  className="text-[32px] font-medium text-[#28433D]"
                  style={{ lineHeight: "0.625em" }}
                >
                  176
                </p>
              </div>
              <Image
                src="/icons/user-multiple.svg"
                alt="Users"
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
                  ₦ 13,250,000
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
              className="text-[14px] font-normal text-[#5E5E5E]"
              style={{
                lineHeight: "1.5em",
                letterSpacing: "-1.1%",
              }}
            >
              Last updated today
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
                  420
                </p>
              </div>
              <Image
                src="/icons/package-delivered-01.svg"
                alt="Orders"
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

          {/* Pending Listings Card */}
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
                  Pending Listings
                </p>
                <p
                  className="text-[32px] font-medium text-[#28433D]"
                  style={{ lineHeight: "0.625em" }}
                >
                  12
                </p>
              </div>
              <Image
                src="/icons/file-validation.svg"
                alt="Listings"
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
              44 Reviews
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-[18px] mb-[18px]">
          {/* User Distribution Chart */}
          <div className="col-span-2">
            <ChartCard title="User Distribution" tabs={tabs} />
          </div>

          {/* User Count by Role */}
          <div className="bg-white rounded-[20px] p-[22px] shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)]">
            <h3
              className="text-[14px] font-medium text-[#515151] mb-[25px]"
              style={{
                lineHeight: "2em",
              }}
            >
              User count by role
            </h3>
            {/* Total */}
            <div className="mb-[22px] relative">
              <div className="flex justify-between items-center mb-[8px]">
                <span
                  className="text-[14px] font-medium text-black"
                  style={{
                    lineHeight: "2em",
                  }}
                >
                  Total
                </span>
                <span
                  className="text-[14px] font-medium text-black"
                  style={{
                    lineHeight: "2em",
                  }}
                >
                  176
                </span>
              </div>
              <div className="h-[8px] bg-[#D9D9D9] rounded-[10px]"></div>
            </div>
            {/* Statistics */}
            <div className="border border-dashed border-[#D0D0D0] rounded-[6px] p-[15px] space-y-[24px]">
              {/* Farmers */}
              <div>
                <div className="flex justify-between items-center mb-[8px]">
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[10px] h-[10px] rounded-full bg-[#004829]"></div>
                    <span
                      className="text-[14px] font-medium text-black"
                      style={{
                      lineHeight: "2em",
                      }}
                    >
                      Farmers
                    </span>
                  </div>
                  <span
                    className="text-[14px] font-medium text-black"
                    style={{
                      lineHeight: "2em",
                    }}
                  >
                    93
                  </span>
                </div>
                <div className="h-[8px] bg-[#004829] rounded-[10px]" style={{ width: "53%" }}></div>
              </div>
              {/* Processors */}
              <div>
                <div className="flex justify-between items-center mb-[8px]">
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[10px] h-[10px] rounded-full bg-[#0B99A9]"></div>
                    <span
                      className="text-[14px] font-medium text-black"
                      style={{
                      lineHeight: "2em",
                      }}
                    >
                      Processors
                    </span>
                  </div>
                  <span
                    className="text-[14px] font-medium text-black"
                    style={{
                      lineHeight: "2em",
                    }}
                  >
                    83
                  </span>
                </div>
                <div className="h-[8px] bg-[#0B99A9] rounded-[10px]" style={{ width: "47%" }}></div>
              </div>
            </div>
            {/* Statistics Label */}
            <div className="mt-[18px]">
              <span
                className="text-[18px] font-semibold text-[#101828]"
                style={{
                  lineHeight: "1.556em",
                }}
              >
                Statistics
              </span>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#FFFFFC] rounded-[12px] border border-[#EBE7E5] shadow-[0px_2px_8px_0px_rgba(51,117,54,0.08)]">
          {/* Table Header Tabs */}
          <div className="flex gap-[27px] px-[25px] pt-[25px] pb-0">
            <button
              onClick={() => setActiveTableTab("Ongoing Orders")}
              className={`text-[18px] font-normal pb-[25px] ${
                activeTableTab === "Ongoing Orders"
                  ? "text-[#004829]"
                  : "text-[#C3C3C3]"
              }`}
              style={{
                fontFamily: "Effra, sans-serif",
                lineHeight: "1.333em",
                letterSpacing: "-3.33%",
              }}
            >
              Ongoing Orders
            </button>
            <button
              onClick={() => setActiveTableTab("Pending Listings")}
              className={`text-[18px] font-normal pb-[25px] ${
                activeTableTab === "Pending Listings"
                  ? "text-[#004829]"
                  : "text-[#C3C3C3]"
              }`}
              style={{
                fontFamily: "Effra, sans-serif",
                lineHeight: "1.333em",
                letterSpacing: "-3.33%",
              }}
            >
              Pending Listings
            </button>
          </div>

          {/* Search and Filter */}
          <div className="px-[17px] py-[17px] flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search users..."
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
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EBE7E5]">
                  {activeTableTab === "Ongoing Orders" ? (
                    <>
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
                    </>
                  ) : (
                    <>
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
                        Order & Value
                      </th>
                      <th
                        className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]"
                        style={{
                          fontFamily: "Effra, sans-serif",
                          lineHeight: "1.429em",
                        }}
                      >
                        Quantity
                      </th>
                      <th
                        className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]"
                        style={{
                          fontFamily: "Effra, sans-serif",
                          lineHeight: "1.429em",
                        }}
                      >
                        Price Per Unit
                      </th>
                      <th
                        className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]"
                        style={{
                          fontFamily: "Effra, sans-serif",
                          lineHeight: "1.429em",
                        }}
                      >
                        Listing Date
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
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {/* Table Rows */}
                {[1, 2, 3, 4].map((row) => (
                  <tr key={row} className="border-b border-[#EBE7E5]">
                    {activeTableTab === "Ongoing Orders" ? (
                      <>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <p
                              className="text-[14px] font-medium text-[#0D3F11]"
                              style={{
                                fontFamily: "Effra, sans-serif",
                                lineHeight: "1.429em",
                              }}
                            >
                              Pristine Crops & Livestocks
                            </p>
                            <p
                              className="text-[14px] font-normal text-[#80726B]"
                              style={{
                                fontFamily: "Effra, sans-serif",
                                lineHeight: "1.429em",
                              }}
                            >
                              ID: 002333
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
                                Lagos
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
                              Eronini Feed Mill
                            </p>
                            <p
                              className="text-[14px] font-normal text-[#80726B]"
                              style={{
                                fontFamily: "Effra, sans-serif",
                                lineHeight: "1.429em",
                              }}
                            >
                              ID: 002333
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
                                Lagos
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
                                Long Grain Rice
                              </span>
                            </div>
                            <span
                              className="text-[14px] font-medium text-[#4CAE4F]"
                              style={{
                                fontFamily: "Effra, sans-serif",
                                lineHeight: "1.429em",
                              }}
                            >
                              ₦350,000
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
                            Plot 1634, Sapele Industrial Area, Sapele, Warri
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-[3.5px]">
                            <div
                              className={`inline-flex items-center gap-[6.75px] px-[11.75px] py-[11.75px] rounded-[11.75px] ${
                                row === 1
                                  ? "bg-[#EEC41E]"
                                  : row === 2
                                  ? "bg-[#1E89EE]"
                                  : row === 4
                                  ? "bg-[#0BA964]"
                                  : "bg-[#EEC41E]"
                              }`}
                            >
                              <Image
                                src="/icons/package-delivered-01.svg"
                                alt="Status"
                                width={14}
                                height={14}
                              />
                              <span
                                className="text-[12px] font-normal text-white"
                                style={{
                                  lineHeight: "1.959em",
                                }}
                              >
                                {row === 1
                                  ? "Awaiting Shipping"
                                  : row === 2
                                  ? "In Transit"
                                  : row === 4
                                  ? "Delivered"
                                  : "Awaiting Shipping"}
                              </span>
                            </div>
                            <span
                              className="text-[12px] font-normal text-[#80726B]"
                              style={{
                                fontFamily: "Effra, sans-serif",
                                lineHeight: "1.667em",
                              }}
                            >
                              DD: 22-09-2025
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            className="px-[13px] py-1 bg-[#FFFFFC] border border-[#EBE7E5] rounded-[10px] text-[14px] font-medium text-[#0D3F11]"
                            style={{
                              fontFamily: "Effra, sans-serif",
                              lineHeight: "1.429em",
                            }}
                          >
                            View
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <p
                              className="text-[14px] font-medium text-[#0D3F11]"
                              style={{
                                fontFamily: "Effra, sans-serif",
                                lineHeight: "1.429em",
                              }}
                            >
                              Pristine Crops & Livestocks
                            </p>
                            <p
                              className="text-[14px] font-normal text-[#80726B]"
                              style={{
                                fontFamily: "Effra, sans-serif",
                                lineHeight: "1.429em",
                              }}
                            >
                              ID: 002333
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
                                Lagos
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
                                Long Grain Rice
                              </span>
                            </div>
                            <span
                              className="text-[14px] font-medium text-[#4CAE4F]"
                              style={{
                                fontFamily: "Effra, sans-serif",
                                lineHeight: "1.429em",
                              }}
                            >
                              Rice
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
                            700 Kilograms
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p
                            className="text-[14px] font-medium text-[#4CAE4F]"
                            style={{
                              fontFamily: "Effra, sans-serif",
                              lineHeight: "1.429em",
                            }}
                          >
                            ₦2,000
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p
                            className="text-[14px] font-normal text-[#80726B]"
                            style={{
                              fontFamily: "Effra, sans-serif",
                              lineHeight: "1.429em",
                            }}
                          >
                            22-09-2025
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="px-[13px] py-1 bg-[#0BA964] rounded-[10px] text-[14px] font-normal text-white"
                              style={{
                                fontFamily: "Arial, sans-serif",
                                lineHeight: "1.429em",
                              }}
                            >
                              Approve
                            </button>
                            <button
                              className="px-[13px] py-1 bg-[#FFFFFC] border border-[#EBE7E5] rounded-[10px] text-[14px] font-normal text-[#CD0003]"
                              style={{
                                fontFamily: "Arial, sans-serif",
                                lineHeight: "1.429em",
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-[#EAECF0]">
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
    </div>
  );
}

