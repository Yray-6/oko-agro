import React from "react";
import Logo from "../assets/icons/Logo";
import Link from "next/link";
import AdminLoginForm from "../components/forms/LoginAdmin";

export default function page() {
  return (
    <div className="min-h-screen login-farmer-bg px-4 sm:px-6 lg:px-[7%]">
      {/* Header */}
      <div className="py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/" className="flex gap-2 text-white items-center">
          <Logo /> Òkó Agro
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 py-8 lg:py-12 gap-6 lg:gap-5 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-mainGreen/70 text-white p-6 lg:p-8 md:block hidden rounded-lg lg:rounded lg:col-span-1 lg:self-end order-2 lg:order-1">
          <p className="text-2xl sm:text-3xl font-semibold mb-4">Admin Portal 🔐</p>
          <p className="text-sm sm:text-base leading-relaxed">
            Log in to access the admin dashboard. Manage users, products, orders, and platform analytics from one centralized location.
          </p>
        </div>

        {/* Login Form Section */}
        <div className="col-span-1 order-1 lg:order-2">
          <AdminLoginForm/>
        </div>
      </div>
    </div>
  );
}

