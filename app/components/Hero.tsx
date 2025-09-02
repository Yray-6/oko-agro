'use client'
import React, { useState } from "react";
import Logo from "../assets/icons/Logo";
import Connect from "../assets/icons/Connect";
import Leaf from "../assets/icons/Leaf";
import Tractor from "../assets/icons/Tractor";
import Link from "next/link";

export default function Hero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-[7%] hero-bg text-white">
      {/* Navigation */}
      <div className="flex justify-between items-center py-5">
        {/* Logo */}
        <div className="flex gap-2 items-center">
          <Logo />
          <span className="text-lg font-medium">Òkó Agro</span>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden lg:flex gap-16 text-sm">
          <p className="cursor-pointer hover:text-lightGreen transition-colors">
            Features
          </p>
          <p className="cursor-pointer hover:text-lightGreen transition-colors">
            How It Works
          </p>
          <p className="cursor-pointer hover:text-lightGreen transition-colors">
            Contact Us
          </p>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex gap-5 items-center text-sm">
          <Link
            href={"/login-farmer"}
            className="hover:text-lightGreen transition-colors"
          >
            Sign In
          </Link>
          <button className="text-mainGreen px-3 py-2 rounded bg-white hover:bg-gray-100 transition-colors">
            <Link href={"/register-farmer"}>Get Started</Link>
          </button>
        </div>

        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 focus:outline-none z-50"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-white transform transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white my-1 transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transform transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      />

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-mainGreen to-green-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20">
          <div className="flex gap-3 items-center text-white">
            <div className="bg-white/20 p-2 rounded-lg">
              <Logo />
            </div>
            <div>
              <span className="font-bold text-lg">Òkó Agro</span>
              <p className="text-xs text-green-100">Agricultural Platform</p>
            </div>
          </div>
          <button
            onClick={toggleMenu}
            className="w-10 h-10 flex justify-center items-center text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-6 flex-1">
          <div className="space-y-2">
            <div className="text-green-100 text-xs uppercase tracking-wide font-semibold mb-4">
              Navigation
            </div>
            <a
              href="#features"
              className="flex items-center group w-full text-left py-4 px-4 rounded-xl text-white hover:bg-white/10 transition-all duration-200"
              onClick={toggleMenu}
            >
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Features</div>
                <div className="text-xs text-green-100">Platform capabilities</div>
              </div>
            </a>

            <a
              href="#how-it-works"
              className="flex items-center group w-full text-left py-4 px-4 rounded-xl text-white hover:bg-white/10 transition-all duration-200"
              onClick={toggleMenu}
            >
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">How It Works</div>
                <div className="text-xs text-green-100">Step by step guide</div>
              </div>
            </a>

            <a
              href="#contact"
              className="flex items-center group w-full text-left py-4 px-4 rounded-xl text-white hover:bg-white/10 transition-all duration-200"
              onClick={toggleMenu}
            >
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Contact Us</div>
                <div className="text-xs text-green-100">Get in touch</div>
              </div>
            </a>
          </div>

          {/* Auth Buttons Section */}
          <div className="mt-8">
            <div className="text-green-100 text-xs uppercase tracking-wide font-semibold mb-4">
              Account
            </div>
            <div className="space-y-3">
              <Link
                href="/login-farmer"
                className="flex items-center justify-center w-full py-4 text-white font-medium transition-all duration-200 border border-white/20 rounded-xl hover:bg-white/10 hover:border-white/30"
                onClick={toggleMenu}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </Link>
              <Link
                href="/register-farmer"
                className="flex items-center justify-center w-full py-4 bg-white text-mainGreen rounded-xl hover:bg-gray-100 font-medium transition-all duration-200 shadow-lg"
                onClick={toggleMenu}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Get Started
              </Link>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-green-100 text-xs">
                Connecting farmers with processors
              </p>
              <p className="text-green-200 text-xs mt-1 font-medium">
                Quality • Trust • Growth
              </p>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 mt-10 lg:mt-20">
        <div className="col-span-1 lg:col-span-8">
          {/* Badge Section */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 items-start sm:items-center gap-4 sm:gap-2">
            <div className="rounded-xl justify-center border border-white bg-white/20 flex gap-2 px-3 py-1 text-xs sm:text-sm w-fit">
              <Connect />
              <span className="whitespace-nowrap">
                Connecting Agricultural Community
              </span>
            </div>
            <div className="hidden sm:block w-full">
              <hr />
            </div>
          </div>

          {/* Main Heading */}
          <div className="mt-6 lg:mt-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.8rem] leading-tight lg:leading-normal font-semibold">
              Direct{" "}
              <span className="text-lightGreen">Farm-to-Processor</span>{" "}
              Platform with{" "}
              <span className="text-mainYellow">Quality Assurance</span>
            </h1>
            <p className="mt-4 lg:mt-5 text-base lg:text-lg leading-relaxed max-w-2xl">
              Empowering farmers to increase their earnings by 25% while ensuring
              processors receive only top-quality, certified products — through
              our trusted marketplace and professional inspection system.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-4 lg:gap-12">
            <Link href={"/login-farmer"} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto flex gap-3 justify-center items-center text-white px-6 py-3 rounded bg-mainGreen hover:bg-green-600 transition-colors">
                <Leaf />
                <span>I'm a Farmer</span>
              </button>
            </Link>
            <Link href={"/login-processor"} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto flex gap-3 justify-center items-center text-mainGreen px-6 py-3 rounded bg-white hover:bg-gray-100 transition-colors">
                <Tractor />
                <span>I'm a Processor</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}