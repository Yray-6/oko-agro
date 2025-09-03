import React from "react";
import Logo from "../assets/icons/Logo";
import Tractor from "../assets/icons/Tractor";
import Link from "next/link";
import FarmerLoginForm from "../components/forms/LoginFarmer";

export default function page() {
  return (
    <div className="min-h-screen login-farmer-bg px-4 sm:px-6 lg:px-[7%]">
      {/* Header */}
      <div className="py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/" className="flex gap-2 text-white items-center">
          <Logo /> Òkó Agro
        </Link>
        
        <button className="text-mainGreen px-3 py-2 rounded bg-white w-full sm:w-auto">
          <Link href={'/login-processor'} className="flex gap-3 items-center justify-center">
            <Tractor/> Login as Processor
          </Link>
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 py-8 lg:py-12  gap-6 lg:gap-5 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-mainGreen/70 text-white p-6 lg:p-8 md:block hidden rounded-lg lg:rounded-none lg:col-span-1 lg:self-end order-2 lg:order-1">
          <p className="text-2xl sm:text-3xl font-semibold mb-4">Welcome Back, Farmer 🌱</p>
          <p className="text-sm sm:text-base leading-relaxed">
            Log in to manage your farm profile, showcase your produce, track quality inspections, and connect with trusted buyers. Your gateway to fair prices, better opportunities, and a stronger farming community.
          </p>
        </div>

        {/* Login Form Section */}
        <div className="col-span-1 order-1 lg:order-2">
          <FarmerLoginForm/>
        </div>
      </div>
    </div>
  );
}