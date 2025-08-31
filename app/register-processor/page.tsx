import React from "react";
import Logo from "../assets/icons/Logo";
import Tractor from "../assets/icons/Tractor";
import FarmerRegistrationForm from "../components/forms/FarmerOnboarding";
import Link from "next/link";
import ProcessorRegistrationForm from "../components/forms/ProcessorRegistrationForm";

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
            <p className="text-3xl">Power Your Supply Chain with Farm-Fresh Quality</p>
            <p className="mt-6">Oko Agro is more than a marketplace — it’s a quality assurance system built for processors. From real-time inspection updates to verified product certifications, we help you focus on scaling your production while we ensure every supply you order meets the highest industry standards.</p>
        </div>
        <div className=" col-span-1">
            <ProcessorRegistrationForm/>
        </div>
      </div>
    </div>
  );
}
