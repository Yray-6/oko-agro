import React, { useState } from "react";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
        aria-label="Toggle menu"
      >
        <span
          className={`block w-6 h-0.5 bg-white transform transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-1.5" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transform transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-1.5" : ""
          }`}
        />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      />

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-64 bg-mainGreen shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20">
          <span className="text-lg font-semibold text-white">Menu</span>
          <button
            onClick={toggleMenu}
            className="w-8 h-8 flex justify-center items-center text-white hover:text-gray-200"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-6 bg-mainGreen h-full">
          <ul className="space-y-4">
            <li>
              <a
                href="#features"
                className="block text-white hover:text-gray-200 py-2 text-base font-medium transition-colors"
                onClick={toggleMenu}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="block text-white hover:text-gray-200 py-2 text-base font-medium transition-colors"
                onClick={toggleMenu}
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="block text-white hover:text-gray-200 py-2 text-base font-medium transition-colors"
                onClick={toggleMenu}
              >
                Contact Us
              </a>
            </li>
          </ul>

          {/* Auth Buttons in Mobile Menu */}
          <div className="mt-8 space-y-3">
            <a
              href="/login-farmer"
              className="block w-full text-center py-3 text-white hover:text-gray-200 font-medium transition-colors border border-white/20 rounded-lg"
              onClick={toggleMenu}
            >
              Sign In
            </a>
            <a
              href="/register-farmer"
              className="block w-full text-center py-3 bg-white text-mainGreen rounded-lg hover:bg-gray-100 font-medium transition-colors"
              onClick={toggleMenu}
            >
              Get Started
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}