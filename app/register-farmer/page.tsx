import React from "react";
import Logo from "../assets/icons/Logo";
import Tractor from "../assets/icons/Tractor";
import FarmerRegistrationForm from "../components/forms/FarmerOnboarding";
import Link from "next/link";

export default function page() {
  return (
    <div className="min-h-screen login-bg px-[7%]">
      <div className="py-5 flex justify-between items-center">
        <div className="flex gap-2 text-white items-center">
          {" "}
          <Logo /> Òkó Agro{" "}
        </div>
         <button className="  text-mainGreen px-3 py-2 rounded bg-white"> <Link href={'/register-processor'} className="flex gap-3"><Tractor/>  Register as Processor</Link> </button>
      </div>
      <div className="grid grid-cols-2 py-12 gap-5">
        <div className="bg-mainGreen/40 text-white p-6 col-span-1 self-end">
            <p className="text-3xl">Turn Your Harvest Into Higher Earnings</p>
            <p className="mt-6">Sign up as a farmer to showcase your produce, access certified inspections, and connect with trusted buyers who value your hard work. Unlock better prices, wider markets, and more growth opportunities — all in one place.</p>
        </div>
        <div className=" col-span-1">
            <FarmerRegistrationForm/>
        </div>
      </div>
    </div>
  );
}
