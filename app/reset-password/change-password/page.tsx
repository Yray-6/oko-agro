"use client";
import React, { Suspense } from "react";
import Logo from "@/app/assets/icons/Logo";
import Tractor from "@/app/assets/icons/Tractor";
import Link from "next/link";
import CreatePasswordForm from "@/app/components/forms/CreatePassword";

// Loading component for the page
const PageLoading = () => (
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

    {/* Main Content with Loading */}
    <div className="grid grid-cols-1 lg:grid-cols-2 py-8 lg:py-12 gap-6 lg:gap-5 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-mainGreen/70 text-white p-6 lg:p-8 md:block hidden rounded-lg lg:rounded-none lg:col-span-1 lg:self-end order-2 lg:order-1">
        <p className="text-2xl sm:text-3xl font-semibold mb-4">Create Your New Password</p>
        <p className="text-sm sm:text-base leading-relaxed">
          You&apos;re almost done! Create a strong, secure password for your account. Make sure it&apos;s something you&apos;ll remember but others can&apos;t easily guess.
        </p>
      </div>

      {/* Loading Form Section */}
      <div className="col-span-1 order-1 lg:order-2">
        <div className="p-4 sm:p-6 lg:p-8 bg-white/80 rounded-lg shadow-lg max-w-md mx-auto lg:mx-0">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainGreen"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Page() {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 py-8 lg:py-12 gap-6 lg:gap-5 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-mainGreen/70 text-white p-6 lg:p-8 md:block hidden rounded-lg lg:rounded-none lg:col-span-1 lg:self-end order-2 lg:order-1">
          <p className="text-2xl sm:text-3xl font-semibold mb-4">Create Your New Password</p>
          <p className="text-sm sm:text-base leading-relaxed">
            You&apos;re almost done! Create a strong, secure password for your account. Make sure it&apos;s something you&apos;ll remember but others can&apos;t easily guess.
          </p>
        </div>

        {/* Create Password Form Section */}
        <div className="col-span-1 order-1 lg:order-2">
          <Suspense fallback={
            <div className="p-4 sm:p-6 lg:p-8 bg-white/80 rounded-lg shadow-lg max-w-md mx-auto lg:mx-0">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainGreen"></div>
                <span className="ml-2 text-gray-600">Loading...</span>
              </div>
            </div>
          }>
            <CreatePasswordForm/>
          </Suspense>
        </div>
      </div>
    </div>
  );
}