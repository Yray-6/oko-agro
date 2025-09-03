import React from "react";
import Logo from "../assets/icons/Logo";
import Tractor from "../assets/icons/Tractor";
import FarmerRegistrationForm from "../components/forms/FarmerOnboarding";
import Link from "next/link";

export default function page() {
  return (
    <div className="min-h-screen login-bg px-4 sm:px-6 lg:px-[7%]">
      {/* Header */}
      <div className="py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/" className="flex gap-2 text-white items-center">
          <Logo /> Òkó Agro
        </Link>
        
        <button className="text-mainGreen px-3 py-2 rounded bg-white w-full sm:w-auto">
          <Link href={'/register-processor'} className="flex gap-3 items-center justify-center">
            <Tractor/> Register as Processor
          </Link>
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 py-8 lg:py-12 gap-6 lg:gap-5 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-mainGreen/70 text-white p-6 lg:p-8 md:block hidden rounded-lg lg:rounded lg:col-span-1 lg:self-end order-2 lg:order-1">
          <p className="text-2xl sm:text-3xl font-semibold mb-4">Turn Your Harvest Into Higher Earnings 🌾</p>
          <p className="text-sm sm:text-base leading-relaxed">
            Sign up as a farmer to showcase your produce, access certified inspections, and connect with trusted buyers who value your hard work. Unlock better prices, wider markets, and more growth opportunities — all in one place.
          </p>
        </div>

        {/* Registration Form Section */}
        <div className="col-span-1 order-1 lg:order-2">
          <FarmerRegistrationForm/>
        </div>
      </div>
    </div>
  );
}