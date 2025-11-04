"use client";
import Image from "next/image";
import React, { useState } from "react";
import Modal from "@/app/components/Modal";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [selectedReport, setSelectedReport] = useState("User Management");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const adminUsers: AdminUser[] = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      role: "Admin",
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      role: "Manager",
      status: "active",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "m.brown@example.com",
      role: "Admin",
      status: "active",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.d@example.com",
      role: "Admin",
      status: "inactive",
    },
  ];

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleUpdatePassword = () => {
    // Handle password update logic
    console.log("Updating password...");
  };

  const handleExportReport = () => {
    // Handle export report logic
    console.log("Exporting report...");
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Top Header */}
      <div className="bg-[#F8F8F8] h-[104px] flex items-center justify-between px-12">
        {/* Left Side - Settings Title */}
        <div className="flex items-center">
          <h1
            className="text-[28px] font-normal text-black"
            style={{
              lineHeight: "1.5em",
              letterSpacing: "-1.1%",
            }}
          >
            Settings
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
          Manage users, security, and system preferences
        </p>

        {/* Three Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Change Password Section */}
          <div className="col-span-1 bg-white border border-[#E5E1DC] rounded-[12px] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 11L3 19L21 19L21 11"
                    stroke="#2E251F"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 11L7 7C7 4.79086 8.79086 3 11 3L13 3C15.2091 3 17 4.79086 17 7L17 11"
                    stroke="#2E251F"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <h3
                  className="text-[24px] font-normal text-[#2E251F]"
                  style={{
                    lineHeight: "1em",
                    letterSpacing: "-2.5%",
                  }}
                >
                  Change Password
                </h3>
              </div>
              <p
                className="text-[14px] font-normal text-[#7E7167]"
                style={{
                  lineHeight: "1.429em",
                }}
              >
                Update your password to keep your account secure
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {/* Current Password */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[14px] font-medium text-[#2E251F]"
                  style={{
                    lineHeight: "1.5em",
                  }}
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full h-[44px] px-[13px] pr-[50px] bg-[#F3F3F5] border border-[#F2F0ED] rounded-[10px] outline-none text-[14px] text-[#717182]"
                    style={{
                      lineHeight: "1.2em",
                    }}
                  />
                  <button
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-[13px] top-1/2 -translate-y-1/2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {showPassword.current ? (
                        <path
                          d="M8 3C4.667 3 2 5.333 2 8C2 10.667 4.667 13 8 13C11.333 13 14 10.667 14 8C14 5.333 11.333 3 8 3ZM8 11.333C6.527 11.333 5.333 9.827 5.333 8C5.333 6.173 6.527 4.667 8 4.667C9.473 4.667 10.667 6.173 10.667 8C10.667 9.827 9.473 11.333 8 11.333Z"
                          fill="#717182"
                        />
                      ) : (
                        <>
                          <path
                            d="M8 3C4.667 3 2 5.333 2 8C2 10.667 4.667 13 8 13C11.333 13 14 10.667 14 8C14 5.333 11.333 3 8 3ZM8 11.333C6.527 11.333 5.333 9.827 5.333 8C5.333 6.173 6.527 4.667 8 4.667C9.473 4.667 10.667 6.173 10.667 8C10.667 9.827 9.473 11.333 8 11.333Z"
                            fill="#717182"
                          />
                          <path
                            d="M1.33 1.33L14.67 14.67"
                            stroke="#717182"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <label
                    className="text-[14px] font-medium text-[#2E251F]"
                    style={{
                      lineHeight: "1.5em",
                    }}
                  >
                    New Password
                  </label>
                </div>
                <p
                  className="text-[12px] font-normal text-[#7E7167] mb-2"
                  style={{
                    lineHeight: "1.333em",
                  }}
                >
                  Must be at least 8 characters
                </p>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full h-[44px] px-[13px] pr-[50px] bg-[#F3F3F5] border border-[#F2F0ED] rounded-[10px] outline-none text-[14px] text-[#717182]"
                    style={{
                      lineHeight: "1.2em",
                    }}
                  />
                  <button
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-[13px] top-1/2 -translate-y-1/2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {showPassword.new ? (
                        <path
                          d="M8 3C4.667 3 2 5.333 2 8C2 10.667 4.667 13 8 13C11.333 13 14 10.667 14 8C14 5.333 11.333 3 8 3ZM8 11.333C6.527 11.333 5.333 9.827 5.333 8C5.333 6.173 6.527 4.667 8 4.667C9.473 4.667 10.667 6.173 10.667 8C10.667 9.827 9.473 11.333 8 11.333Z"
                          fill="#717182"
                        />
                      ) : (
                        <>
                          <path
                            d="M8 3C4.667 3 2 5.333 2 8C2 10.667 4.667 13 8 13C11.333 13 14 10.667 14 8C14 5.333 11.333 3 8 3ZM8 11.333C6.527 11.333 5.333 9.827 5.333 8C5.333 6.173 6.527 4.667 8 4.667C9.473 4.667 10.667 6.173 10.667 8C10.667 9.827 9.473 11.333 8 11.333Z"
                            fill="#717182"
                          />
                          <path
                            d="M1.33 1.33L14.67 14.67"
                            stroke="#717182"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[14px] font-medium text-[#2E251F]"
                  style={{
                    lineHeight: "1.5em",
                  }}
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full h-[44px] px-[13px] pr-[50px] bg-[#F3F3F5] border border-[#F2F0ED] rounded-[10px] outline-none text-[14px] text-[#717182]"
                    style={{
                      lineHeight: "1.2em",
                    }}
                  />
                  <button
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-[13px] top-1/2 -translate-y-1/2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {showPassword.confirm ? (
                        <path
                          d="M8 3C4.667 3 2 5.333 2 8C2 10.667 4.667 13 8 13C11.333 13 14 10.667 14 8C14 5.333 11.333 3 8 3ZM8 11.333C6.527 11.333 5.333 9.827 5.333 8C5.333 6.173 6.527 4.667 8 4.667C9.473 4.667 10.667 6.173 10.667 8C10.667 9.827 9.473 11.333 8 11.333Z"
                          fill="#717182"
                        />
                      ) : (
                        <>
                          <path
                            d="M8 3C4.667 3 2 5.333 2 8C2 10.667 4.667 13 8 13C11.333 13 14 10.667 14 8C14 5.333 11.333 3 8 3ZM8 11.333C6.527 11.333 5.333 9.827 5.333 8C5.333 6.173 6.527 4.667 8 4.667C9.473 4.667 10.667 6.173 10.667 8C10.667 9.827 9.473 11.333 8 11.333Z"
                            fill="#717182"
                          />
                          <path
                            d="M1.33 1.33L14.67 14.67"
                            stroke="#717182"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Update Password Button */}
              <button
                onClick={handleUpdatePassword}
                className="w-full h-[44px] bg-[#16A249] rounded-[10px] text-[14px] font-medium text-white"
                style={{
                  lineHeight: "1.429em",
                }}
              >
                Update Password
              </button>
            </div>
          </div>

          {/* User Management Section */}
          <div className="col-span-2 bg-white border border-[#E5E1DC] rounded-[12px] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                      stroke="#2E251F"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                      stroke="#2E251F"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                      stroke="#2E251F"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55219C18.7122 5.25368 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75632 18.1676 9.45781C17.623 10.1593 16.8604 10.6597 16 10.88"
                      stroke="#2E251F"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h3
                    className="text-[24px] font-normal text-[#2E251F]"
                    style={{
                      lineHeight: "1em",
                      letterSpacing: "-2.5%",
                    }}
                  >
                    User Management
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#16A249] rounded-[10px] text-[14px] font-normal text-white h-[40px]"
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
                      d="M8 1.33V14.67"
                      stroke="white"
                      strokeWidth="1.33"
                      strokeLinecap="round"
                    />
                    <path
                      d="M1.33 8H14.67"
                      stroke="white"
                      strokeWidth="1.33"
                      strokeLinecap="round"
                    />
                  </svg>
                  Add New User
                </button>
              </div>
              <p
                className="text-[14px] font-normal text-[#7E7167]"
                style={{
                  lineHeight: "1.429em",
                }}
              >
                Add new users and manage their roles and permissions
              </p>
            </div>

            {/* Admin Users List */}
            <div className="flex flex-col gap-4">
              {adminUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center p-4 border border-[#F2F0ED] rounded-[10px]"
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className="w-[32px] h-[32px] rounded-full bg-[rgba(22,162,73,0.1)] flex items-center justify-center flex-shrink-0">
                      <span
                        className="text-[14px] font-normal text-[#16A249]"
                        style={{
                          lineHeight: "1.429em",
                        }}
                      >
                        {user.id}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p
                        className="text-[16px] font-normal text-[#2E251F]"
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
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className="text-[14px] font-normal text-[#2E251F]"
                        style={{
                          lineHeight: "1.429em",
                        }}
                      >
                        {user.role}
                      </span>
                      <span
                        className={`text-[14px] font-normal ${
                          user.status === "active"
                            ? "text-[#16A249]"
                            : "text-[#7E7167]"
                        }`}
                        style={{
                          lineHeight: "1.429em",
                        }}
                      >
                        {user.status}
                      </span>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-[8px] transition-colors">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 3.33V12.67"
                          stroke="#3C83F6"
                          strokeWidth="1.33"
                          strokeLinecap="round"
                        />
                        <path
                          d="M3.33 8H12.67"
                          stroke="#3C83F6"
                          strokeWidth="1.33"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-[8px] transition-colors">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 4H14"
                          stroke="#EF4343"
                          strokeWidth="1.33"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6.67 2V6"
                          stroke="#EF4343"
                          strokeWidth="1.33"
                          strokeLinecap="round"
                        />
                        <path
                          d="M9.33 2V6"
                          stroke="#EF4343"
                          strokeWidth="1.33"
                          strokeLinecap="round"
                        />
                        <path
                          d="M3.33 6V13.33C3.33 14.0406 3.60938 14.721 4.14062 15.2512C4.67188 15.7815 5.35227 16.0609 6.06267 16.0609H9.93733C10.6477 16.0609 11.3281 15.7815 11.8594 15.2512C12.3906 14.721 12.67 14.0406 12.67 13.33V6"
                          stroke="#EF4343"
                          strokeWidth="1.33"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Reports Section */}
        <div className="mt-6 bg-white border border-[#E5E1DC] rounded-[12px] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10L2 20L22 20L22 10"
                  stroke="#2E251F"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 2L12 14"
                  stroke="#2E251F"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M4 6L12 2L20 6"
                  stroke="#2E251F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3
                className="text-[24px] font-normal text-[#2E251F]"
                style={{
                  lineHeight: "1em",
                  letterSpacing: "-2.5%",
                }}
              >
                Export Reports
              </h3>
            </div>
            <p
              className="text-[14px] font-normal text-[#7E7167]"
              style={{
                lineHeight: "1.429em",
              }}
            >
              Download comprehensive reports from different modules
            </p>
          </div>

          {/* Report Type Selection */}
          <div className="flex gap-5 mb-5">
            <button
              onClick={() => setSelectedReport("User Management")}
              className={`flex flex-col items-center gap-2 px-[22px] py-[22px] rounded-[12px] border-2 ${
                selectedReport === "User Management"
                  ? "bg-[rgba(22,162,73,0.05)] border-[#16A249]"
                  : "border-[#F2F0ED]"
              }`}
            >
              <Image
                src="/icons/user-multiple.svg"
                alt="User Management"
                width={44}
                height={44}
              />
              <span
                className={`text-[16px] font-normal ${
                  selectedReport === "User Management"
                    ? "text-[#16A249]"
                    : "text-[#2E251F]"
                }`}
                style={{
                  lineHeight: "1.5em",
                }}
              >
                User Management
              </span>
            </button>
            <button
              onClick={() => setSelectedReport("Order Management")}
              className={`flex flex-col items-center gap-2 px-[22px] py-[22px] rounded-[12px] border-2 ${
                selectedReport === "Order Management"
                  ? "bg-[rgba(22,162,73,0.05)] border-[#16A249]"
                  : "border-[#F2F0ED]"
              }`}
            >
              <Image
                src="/icons/invoice-04.svg"
                alt="Order Management"
                width={44}
                height={44}
              />
              <span
                className={`text-[16px] font-normal ${
                  selectedReport === "Order Management"
                    ? "text-[#16A249]"
                    : "text-[#2E251F]"
                }`}
                style={{
                  lineHeight: "1.5em",
                }}
              >
                Order Management
              </span>
            </button>
            <button
              onClick={() => setSelectedReport("Analytics")}
              className={`flex flex-col items-center gap-2 px-[22px] py-[22px] rounded-[12px] border-2 ${
                selectedReport === "Analytics"
                  ? "bg-[rgba(22,162,73,0.05)] border-[#16A249]"
                  : "border-[#F2F0ED]"
              }`}
            >
              <Image
                src="/icons/analytics-03.svg"
                alt="Analytics"
                width={44}
                height={44}
              />
              <span
                className={`text-[16px] font-normal ${
                  selectedReport === "Analytics"
                    ? "text-[#16A249]"
                    : "text-[#2E251F]"
                }`}
                style={{
                  lineHeight: "1.5em",
                }}
              >
                Analytics
              </span>
            </button>
          </div>

          {/* Date Range and Export Button */}
          <div className="flex gap-5 items-end">
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.67 1.17V2.67H9.33V1.17"
                    stroke="#2E251F"
                    strokeWidth="1.17"
                    strokeLinecap="round"
                  />
                  <path
                    d="M1.17 2.33H12.83"
                    stroke="#2E251F"
                    strokeWidth="1.17"
                    strokeLinecap="round"
                  />
                  <path
                    d="M1.75 2.33H12.25V10.5H1.75V2.33Z"
                    stroke="#2E251F"
                    strokeWidth="1.17"
                  />
                </svg>
                <label
                  className="text-[14px] font-medium text-[#2E251F]"
                  style={{
                    lineHeight: "1.5em",
                  }}
                >
                  Date Range
                </label>
              </div>
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full h-[40px] px-[13px] pr-[40px] bg-[#F3F3F5] border border-[#F2F0ED] rounded-[10px] text-[14px] font-normal text-[#0A0A0A] outline-none appearance-none"
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
                      stroke="#717182"
                      strokeWidth="1.33"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-3 py-[11.5px] bg-[#16A249] rounded-[10px] text-[14px] font-medium text-white h-[44px]"
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
                  stroke="white"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 2L8 10"
                  stroke="white"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 6L8 2L12 6"
                  stroke="white"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Export Report
            </button>
          </div>

          {/* Export Format Info */}
          <div className="mt-5 p-[17px] bg-[#FAFAF9] border border-[#F2F0ED] rounded-[10px]">
            <p
              className="text-[14px] font-normal text-[#2E251F] mb-2"
              style={{
                lineHeight: "1.429em",
              }}
            >
              Export Format
            </p>
            <p
              className="text-[14px] font-normal text-[#7E7167]"
              style={{
                lineHeight: "1.429em",
              }}
            >
              Reports will be exported in CSV format, compatible with Excel and
              other spreadsheet applications.
            </p>
          </div>
        </div>
      </div>

      {/* Add New User Modal */}
      <Modal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        size="md"
        showCloseButton={false}
        className="rounded-[20px]"
      >
        <div className="p-6">
          <h2
            className="text-[24px] font-medium text-black mb-6"
            style={{
              lineHeight: "1.5em",
            }}
          >
            Add New User
          </h2>
          {/* Add user form would go here */}
          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={() => setShowAddUserModal(false)}
              className="px-6 py-2 border border-[#004829] rounded-[10px] text-[16px] font-medium text-[#004829]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowAddUserModal(false);
                setShowSuccessModal(true);
              }}
              className="px-6 py-2 bg-[#004829] rounded-[10px] text-[16px] font-medium text-white"
            >
              Add User
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        size="md"
        showCloseButton={false}
        className="rounded-[20px] max-w-[666px]"
      >
        <div className="flex flex-col items-center text-center py-0 px-0">
          <div className="w-full px-[74px] pt-[47px] pb-[47px]">
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
              User Added Successfully!
            </h3>
            <p
              className="text-[20px] font-normal text-[#626262] mb-[47px]"
              style={{
                lineHeight: "1.4em",
              }}
            >
              New user has been added successfully. Please close modal to
              continue.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
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

