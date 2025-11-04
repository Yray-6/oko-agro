"use client";
import React, { useState } from "react";
import Image from "next/image";
import Logo from "../assets/icons/Logo";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);

  const navItems: NavItem[] = [
    {
      icon: (
        <Image
          src="/icons/dashboard-square-01.svg"
          alt="Dashboard"
          width={27}
          height={23}
          className="flex-shrink-0"
        />
      ),
      label: "Dashboard",
      href: "/admin",
    },
    {
      icon: (
        <Image
          src="/icons/user-multiple-nav.svg"
          alt="User Management"
          width={24}
          height={24}
          className="flex-shrink-0"
        />
      ),
      label: "User Management",
      href: "/admin/user-management",
    },
    {
      icon: (
        <Image
          src="/icons/invoice-04.svg"
          alt="Order Management"
          width={24}
          height={24}
          className="flex-shrink-0"
        />
      ),
      label: "Order Management",
      href: "/admin/order-management",
    },
    {
      icon: (
        <Image
          src="/icons/analytics-03.svg"
          alt="Analytics"
          width={24}
          height={24}
          className="flex-shrink-0"
        />
      ),
      label: "Analytics",
      href: "/admin/analytics",
    },
    {
      icon: (
        <Image
          src="/icons/account-setting-01.svg"
          alt="Settings"
          width={24}
          height={24}
          className="flex-shrink-0"
        />
      ),
      label: "Settings",
      href: "/admin/settings",
    },
  ];

  return (
    <div className="flex h-screen bg-[#F8F8F8]">
      {/* Sidebar - Expandable on hover */}
      <div
        className={`fixed left-0 top-0 h-full bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out z-10 ${
          isHovered ? "w-[263px]" : "w-[49px]"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo */}
        <div className="flex items-center h-[104px] px-3">
          <div className="flex items-center gap-3">
            <Logo className="w-[26.64px] h-[36.99px] text-mainGreen" color="#004829" />
            <span
              className={`text-[27.42px] font-normal text-mainGreen transition-opacity duration-300 whitespace-nowrap ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              style={{ fontFamily: "Shine Flower, sans-serif" }}
            >
              Òkó Agro
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-[14px] px-3">
          <ul className="space-y-[10px]">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center px-0 py-0 text-black rounded-lg hover:bg-gray-50 transition-colors duration-200 group h-[50px]"
                >
                  <div className="flex-shrink-0">{item.icon}</div>
                  <div className={`ml-[3px] transition-opacity duration-300 whitespace-nowrap ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}>
                    <span
                      style={{
                      fontSize: "20px",
                        fontWeight: 400,
                        lineHeight: "1.5em",
                        letterSpacing: "-1.1%",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Log Out */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-8">
          <a
            href="/admin/logout"
            className="flex items-center px-0 py-0 text-[#CD0003] rounded-lg hover:bg-red-50 transition-colors duration-200 h-[50px]"
          >
            <Image
              src="/icons/logout-01.svg"
              alt="Log Out"
              width={24}
              height={24}
              className="flex-shrink-0"
            />
            <span
              className={`ml-[3px] transition-opacity duration-300 whitespace-nowrap ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              style={{
                      fontSize: "20px",
                fontWeight: 400,
                lineHeight: "1.5em",
                letterSpacing: "-1.1%",
                color: "#CD0003",
              }}
            >
              Log Out
            </span>
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isHovered ? "ml-[263px]" : "ml-[49px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;

