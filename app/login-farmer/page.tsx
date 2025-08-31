import React from "react";
import Logo from "../assets/icons/Logo";
import Tractor from "../assets/icons/Tractor";
import FarmerRegistrationForm from "../components/forms/FarmerOnboarding";
import Link from "next/link";
import FarmerLoginForm from "../components/forms/LoginFarmer";

export default function page() {
  return (
    <div className="min-h-screen login-farmer-bg px-[7%]">
      <div className="py-5 flex justify-between items-center">
        <div className="flex gap-2 text-white items-center">
          {" "}
          <Logo /> Òkó Agro{" "}
        </div>
         <button className="  text-mainGreen px-3 py-2 rounded bg-white"> <Link href={'/login-processor'} className="flex gap-3"><Tractor/>  Login as Processor</Link> </button>
      </div>
      <div className="grid grid-cols-2 py-12 gap-5">
        <div className="bg-mainGreen/40 text-white p-6 col-span-1 self-end">
            <p className="text-3xl">Welcome Back, Farmer 🌱</p>
            <p className="mt-6">Log in to manage your farm profile, showcase your produce, track quality inspections, and connect with trusted buyers. Your gateway to fair prices, better opportunities, and a stronger farming community.</p>
        </div>
        <div className=" col-span-1">
            <FarmerLoginForm/>
        </div>
      </div>
    </div>
  );
}
