"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";


import Logo from "../assets/icons/Logo";
import DashboardIcon from "../assets/icons/Dashboard";
import Product from "../assets/icons/Product";
import TransactionHistory from "../assets/icons/TransactionHistory";
import Calendar from "../assets/icons/Calendar";
import Message from "../assets/icons/Message";
import Settings from "../assets/icons/Settings";
import Logout from "../assets/icons/Logout";
import { Search } from "lucide-react";
import Notification from "../assets/icons/Notification";
import Orders from "../assets/icons/Orders";
import { useAuthStore } from "../store/useAuthStore";
import AnimatedLoading from "../Loading";


interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const Dashboard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Get user data and logout function from auth store
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const navItems: NavItem[] = [
    {
      icon: <DashboardIcon size={20} />,
      label: "Dashboard",
      href: "/dashboard",
    },
    { icon: <Product size={20} />, label: "My Products", href: "/dashboard/products" },
    { icon: <Orders size={20} />, label: "Orders", href: "/dashboard/orders" },
    {
      icon: <TransactionHistory size={20} />,
      label: "Transaction History",
      href: "/dashboard/transactions",
    },
    { icon: <Calendar size={20} />, label: "Calendar", href: "/dashboard/calendar" },
    { icon: <Message size={20} />, label: "Messages", href: "/messages" },
    { icon: <Settings size={20} />, label: "Settings", href: "/dashboard/settings" },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Call the logout function from auth store
      logout();
      
      // Redirect to login page
      router.push('/login-farmer');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
      router.push('/login-farmer');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return "User";
  };


  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-mainGreen/10 shadow-lg transition-all duration-300 ease-in-out z-10 ${
          isHovered ? "w-56" : "w-16"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4">
          <div className="flex items-center space-x-3">
            <Logo className="w-8 h-8 text-mainGreen" color="#004829" />
            <span
              className={`text-xl font-semibold text-mainGreen transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              Òkó Agro
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-2">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center px-2 py-3 text-black rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <div className="flex-shrink-0">{item.icon}</div>
                  <span
                    className={`ml-3 transition-opacity duration-300 whitespace-nowrap ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Log Out */}
        <div className="absolute bottom-4 left-0 right-0 px-2">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center w-full px-3 py-3 text-red rounded-lg hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Logout size={20} />
            <span
              className={`ml-3 transition-opacity duration-300 whitespace-nowrap ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isHovered ? "ml-56" : "ml-16"
        }`}
      >
        {/* Top Header */}
        <header className="bg-white h-16">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-black">Dashboard</h1>
            </div>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 text-sm w-96 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mainGreen focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-center space-x-4">
              {/* Icons */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Message size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Notification size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {getUserInitials()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {getUserDisplayName()}
                  </p>
          
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">{children}</main>
        {isLoggingOut && (<AnimatedLoading />)}
      </div>
    </div>
  );
};

export default Dashboard;