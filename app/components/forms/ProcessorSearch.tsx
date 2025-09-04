'use client'
import React, { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onInputChange?: (query: string) => void;
  className?: string;
  showSearchIcon?: boolean;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search by company, location, or crop type...",
  onSearch,
  onInputChange,
  className = "",
  showSearchIcon = true,
  autoFocus = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onInputChange?.(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery("");
    onInputChange?.("");
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full  ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        {showSearchIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-[#6B7C5A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        )}

        {/* Input Field */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`
            w-full  px-4 py-2 text-sm text-black bg-[#6B7C5A]/5 rounded-lg
            placeholder:text-[#6B7C5A]
            focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent
            hover:border-gray-300
            transition-all duration-200
            ${showSearchIcon ? 'pl-12' : 'pl-4'}
            ${searchQuery ? 'pr-12' : 'pr-4'}
          `}
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <svg
              className="h-5 w-5"
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
        )}
      </div>
    </form>
  );
};

export default SearchBar;