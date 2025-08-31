import React from "react";
import Logo from "../assets/icons/Logo";
import Tractor from "../assets/icons/Tractor";
import FarmerRegistrationForm from "../components/forms/FarmerOnboarding";
import Link from "next/link";
import FarmerLoginForm from "../components/forms/LoginFarmer";
import ProcessorLoginForm from "../components/forms/LoginProcessor";

export default function page() {
  return (
    <div className="min-h-screen login-processor-bg px-[7%]">
      <div className="py-5 flex justify-between items-center">
        <div className="flex gap-2 text-white items-center">
          {" "}
          <Logo /> Òkó Agro{" "}
        </div>
         <button className="  text-mainGreen px-3 py-2 rounded bg-white"> <Link href={'/login-farmer'} className="flex gap-3"><Tractor/>  Login as Farmer</Link> </button>
      </div>
      <div className="grid grid-cols-2 py-12 gap-5">
        <div className="bg-mainGreen/40 text-white p-6 col-span-1 self-end">
            <p className="text-3xl">Welcome Back, Processor</p>
            <p className="mt-6">Log in to discover certified farm produce, manage purchase orders, and connect directly with trusted farmers through the Oko Agro marketplace.</p>
        </div>
        <div className=" col-span-1">
            <ProcessorLoginForm/>
        </div>
      </div>
    </div>
  );
}
