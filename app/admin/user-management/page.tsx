"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useAdminStore } from "../../store/useAdminStore";
import AnimatedLoading from "../../Loading";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("All Users");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const tabs = ["All Users", "Farmers", "Processors"];

  const {
    allUsers,
    farmers,
    processors,
    usersMeta,
    farmersMeta,
    processorsMeta,
    isLoadingUsers,
    isLoadingFarmers,
    isLoadingProcessors,
    fetchAllUsers,
    fetchFarmers,
    fetchProcessors,
  } = useAdminStore();

  // Fetch users based on active tab
  useEffect(() => {
    const params = {
      search: searchQuery,
      pageNumber: currentPage,
      pageSize,
    };

    if (activeTab === "All Users") {
      fetchAllUsers(params);
    } else if (activeTab === "Farmers") {
      fetchFarmers(params);
    } else if (activeTab === "Processors") {
      fetchProcessors(params);
    }
  }, [activeTab, searchQuery, currentPage, fetchAllUsers, fetchFarmers, fetchProcessors]);

  // Handle search with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page on tab change
  };

  // Get current users and meta based on active tab
  const currentUsers = useMemo(() => {
    if (activeTab === "All Users") return allUsers;
    if (activeTab === "Farmers") return farmers;
    if (activeTab === "Processors") return processors;
    return [];
  }, [activeTab, allUsers, farmers, processors]);

  const currentMeta = useMemo(() => {
    if (activeTab === "All Users") return usersMeta;
    if (activeTab === "Farmers") return farmersMeta;
    if (activeTab === "Processors") return processorsMeta;
    return null;
  }, [activeTab, usersMeta, farmersMeta, processorsMeta]);

  const isLoading = isLoadingUsers || isLoadingFarmers || isLoadingProcessors;

  // Calculate total pages
  const totalPages = currentMeta
    ? Math.ceil(currentMeta.totalRecord / pageSize)
    : 1;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const total = totalPages;
    const current = currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(total);
      } else if (current >= total - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = total - 3; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(total);
      }
    }
    return pages;
  };

  // Format user name
  const getUserName = (user: typeof currentUsers[0]) => {
    if (user.role === "farmer") {
      return user.farmName || `${user.firstName} ${user.lastName}`;
    } else if (user.role === "processor") {
      return user.companyName || `${user.firstName} ${user.lastName}`;
    }
    return `${user.firstName} ${user.lastName}`;
  };

  // Format user ID (use first 8 chars of UUID)
  const getUserId = (id: string) => {
    return id.substring(0, 8).toUpperCase();
  };

  // Get role color
  const getRoleColor = (role: string) => {
    return role === "farmer" ? "#004829" : "#0B99A9";
  };

  // Get status
  const getUserStatus = (user: typeof currentUsers[0]) => {
    if (user.isDisabled) {
      return { status: "Disabled", bg: "rgba(238, 196, 30, 0.2)", color: "#EEC41E" };
    }
    if (user.userVerified) {
      return { status: "Active", bg: "rgba(11, 169, 100, 0.2)", color: "#0BA964" };
    }
    return { status: "Pending", bg: "rgba(238, 196, 30, 0.2)", color: "#EEC41E" };
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Top Header */}
      <div className="bg-[#F8F8F8] h-[104px] flex items-center justify-between px-12">
        {/* Left Side - User Management Title */}
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
          className="text-[16px] font-normal text-[#5C5C5C] mb-[20px]"
          style={{
            lineHeight: "1.5em",
          }}
        >
          Manage farmers and processors on the platform
        </p>

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
                  {usersMeta?.totalRecord || 0}
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

          {/* Total Farmers Card */}
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
                  Total Farmers
                </p>
                <p
                  className="text-[32px] font-medium text-[#28433D]"
                  style={{ lineHeight: "0.625em" }}
                >
                  {usersMeta?.totalFarmerRecord || 0}
                </p>
              </div>
              <Image
                src="/icons/leaf-01.svg"
                alt="Farmers"
                width={24}
                height={24}
                className="object-contain"
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

          {/* Total Processors Card */}
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
                  Total Processors
                </p>
                <p
                  className="text-[32px] font-medium text-[#28433D]"
                  style={{ lineHeight: "0.625em" }}
                >
                  {usersMeta?.totalProcessorRecord || 0}
                </p>
              </div>
              <Image
                src="/icons/tractor.svg"
                alt="Processors"
                width={24}
                height={24}
                className="object-contain"
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

          {/* Pending Verifications Card */}
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
                  Pending Verifications
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
                alt="Verifications"
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
        </div>

        {/* Users Table Card */}
        <div className="bg-[#FFFFFC] rounded-[12px] border border-[#EBE7E5] shadow-[0px_2px_8px_0px_rgba(51,117,54,0.08)]">
          {/* Tabs */}
          <div className="px-[25px] pt-[25px] pb-0 border-b border-[#EAECF0]">
            <div className="flex gap-[10px]">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`pb-[11px] px-1 text-[14px] font-semibold transition-colors ${
                    activeTab === tab
                      ? "text-[#004829] border-b-2 border-[#004829]"
                      : "text-[#667085]"
                  }`}
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    lineHeight: "1.429em",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="px-[17px] py-[17px] flex gap-4 items-center relative">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
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
              className="flex items-center gap-2 px-4 py-2 bg-[#004829] rounded-[10px] shadow-[0px_0px_1.62px_0px_rgba(0,0,0,0.25)]"
              style={{
                fontFamily: "Urbanist, sans-serif",
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
                    User
                  </th>
                  <th
                    className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]"
                    style={{
                      fontFamily: "Effra, sans-serif",
                      lineHeight: "1.429em",
                    }}
                  >
                    Role
                  </th>
                  <th
                    className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]"
                    style={{
                      fontFamily: "Effra, sans-serif",
                      lineHeight: "1.429em",
                    }}
                  >
                    Location
                  </th>
                  <th
                    className="px-4 py-[13.25px] text-left text-[14px] font-medium text-[#80726B]"
                    style={{
                      fontFamily: "Effra, sans-serif",
                      lineHeight: "1.429em",
                    }}
                  >
                    Date of Registration
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
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <AnimatedLoading />
                    </td>
                  </tr>
                ) : currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[#80726B]">
                      No users found
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => {
                    const userStatus = getUserStatus(user);
                    const roleColor = getRoleColor(user.role);
                    return (
                      <tr key={user.id} className="border-b border-[#EBE7E5]">
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <p
                              className="text-[14px] font-medium text-black"
                              style={{
                                fontFamily: "Effra, sans-serif",
                                lineHeight: "1.429em",
                              }}
                            >
                              {getUserName(user)}
                            </p>
                            <p
                              className="text-[14px] font-normal text-[#80726B]"
                              style={{
                                fontFamily: "Effra, sans-serif",
                                lineHeight: "1.429em",
                              }}
                            >
                              ID: {getUserId(user.id)}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div
                            className="inline-flex items-center gap-[6.75px] px-[4.75px] py-[7.75px] rounded-[11.75px] border"
                            style={{
                              borderColor: roleColor,
                              borderWidth: "1px",
                            }}
                          >
                            <Image
                              src={user.role === "farmer" ? "/icons/leaf-01.svg" : "/icons/tractor.svg"}
                              alt={user.role}
                              width={14}
                              height={14}
                              className="object-contain"
                            />
                            <span
                              className="text-[12px] font-normal capitalize"
                              style={{
                                fontFamily: "Urbanist, sans-serif",
                                lineHeight: "1.959em",
                                color: roleColor,
                              }}
                            >
                              {user.role}
                            </span>
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
                            {user.farmAddress || `${user.state}, ${user.country}`}
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
                            {formatDate(user.createdAt)}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div
                            className="inline-flex items-center gap-[6.75px] px-[4.75px] py-[7.75px] rounded-[11.75px]"
                            style={{
                              backgroundColor: userStatus.bg,
                              border: `1px solid ${userStatus.color}`,
                            }}
                          >
                            <svg
                              width="12"
                              height="14"
                              viewBox="0 0 12 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="6"
                                cy="7"
                                r="4.5"
                                fill={userStatus.color}
                              />
                            </svg>
                            <span
                              className="text-[12px] font-normal"
                              style={{
                                fontFamily: "Urbanist, sans-serif",
                                lineHeight: "1.959em",
                                color: userStatus.color,
                              }}
                            >
                              {userStatus.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <a
                            href={`/admin/user-management/${user.id}`}
                            className="p-1 hover:bg-gray-100 rounded inline-block"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                                stroke="#141B34"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="3"
                                stroke="#141B34"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-[#EAECF0]">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
              className="flex items-center gap-2 px-[14px] py-2 bg-white border border-[#D0D5DD] rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-[14px] font-semibold text-[#344054] disabled:opacity-50 disabled:cursor-not-allowed"
            >
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
              {getPageNumbers().map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof page === "number" && setCurrentPage(page)}
                  disabled={typeof page === "string" || isLoading}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-[14px] font-medium ${
                    page === currentPage
                      ? "bg-[#F9FAFB] text-[#1D2939]"
                      : "bg-white text-[#475467]"
                  } ${typeof page === "string" ? "cursor-default" : "cursor-pointer"} disabled:opacity-50`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="flex items-center gap-2 px-[14px] py-2 bg-white border border-[#D0D5DD] rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-[14px] font-semibold text-[#344054] disabled:opacity-50 disabled:cursor-not-allowed"
            >
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

