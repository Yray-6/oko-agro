import React from "react";
import Logo from "../assets/icons/Logo";
import Connect from "../assets/icons/Connect";
import Leaf from "../assets/icons/Leaf";
import Tractor from "../assets/icons/Tractor";

export default function Hero() {
  return (
    <div className="h-screen px-[7%] hero-bg text-white">
      <div className=" flex justify-between  py-5 items-center">
        <div className="flex gap-2 items-center">
          <Logo /> Òkó Agro
        </div>

        <div className=" flex gap-10 text-sm">
          <p>Features</p>
          <p>How It Works</p>
          <p>Contact Us</p>
        </div>

        <div className="flex gap-5 items-center text-sm">
          Sign In
          <button className="text-mainGreen px-3 py-2 rounded bg-white">
            {" "}
            Get Started
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 mt-20">
        <div className="col-span-8">
          <div className="grid grid-cols-2 items-center gap-2">
            <div className="rounded-xl justify-center border col-span-1 border-white bg-white/20 flex gap-2 px-3 py-1 text-sm">
              <Connect /> Connecting Agricultural Community
            </div>
            <div className=" col-span-1 w-full ">
              <hr />
            </div>
          </div>
          <div className="mt-6">
            <p className=" text-[2.8rem] leading-normal font-semibold"> Direct <span className="text-lightGreen">Farm-to-Processor</span> Platform with <span className="text-mainYellow">Quality Assurance</span> </p>
            <p className="mt-5 text-lg">Empowering farmers to increase their earnings by 25% while ensuring processors receive only top-quality, certified products — through our trusted marketplace and professional inspection system.</p>
          </div>
          <div className="mt-10 flex gap-12">
            <button className=" flex gap-3 text-white px-3 py-2 rounded bg-mainGreen"><Leaf/>  I’m a Farmer</button>
              <button className=" flex gap-3 text-mainGreen px-3 py-2 rounded bg-white"><Tractor/>  I’m a Processor</button>
          </div>
        </div>
      </div>
    </div>
  );
}
