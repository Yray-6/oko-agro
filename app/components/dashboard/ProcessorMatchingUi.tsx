"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, MapPin, Building2, Package } from "lucide-react";
import { useProductStore } from "@/app/store/useProductStore";
import Image from "next/image";
import rice from "@/app/assets/images/rice.png";
import AnimatedLoading from "@/app/Loading";

export default function ProcessorMatchingUI() {
  const router = useRouter();
  const {
    processors,
    isSearchingProcessors,
    searchProcessors,
  } = useProductStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Initial search on component mount
  useEffect(() => {
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      await searchProcessors({
        search: searchQuery,
        pageNumber: 1,
        pageSize: 20,
      });
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleProcessorClick = (processorId: string) => {
    router.push(`/dashboard/find-processor/processor-details?processorId=${processorId}`);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, location, crop type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || isSearchingProcessors}
            className="px-6 py-2 bg-mainGreen text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSearching || isSearchingProcessors ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>

    

      {/* Processors List */}
      <div className="space-y-4">
        {isSearchingProcessors ? (
          <div className="flex items-center justify-center py-12 bg-white rounded-lg">
           <AnimatedLoading/>
          </div>
        ) : processors.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No processors found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          processors.map((processor) => (
            <div
              key={processor.id}
              onClick={() => handleProcessorClick(processor.id)}
              className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                {/* Processor Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                  <Image
                    src={rice.src}
                    alt={processor.farmName || "Processor"}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Processor Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-mainGreen transition-colors">
                        {processor.farmName || `${processor.firstName} ${processor.lastName}`}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {processor.firstName} {processor.lastName}
                      </p>
                    </div>

                    {processor.perfectMatch && (
                      <span className="px-3 py-1 bg-[#B8860B]/10 text-[#B8860B] rounded-full text-xs font-medium flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Perfect Match
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-mainGreen" />
                      <span>
                        {processor.state}, {processor.country}
                      </span>
                    </div>
                    {processor.farmAddress && (
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4 text-mainGreen" />
                        <span className="truncate max-w-xs">
                          {processor.farmAddress}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Crops */}
                  {processor.crops && processor.crops.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {processor.crops.slice(0, 5).map((crop) => (
                          <span
                            key={crop.id}
                            className="px-2 py-1 bg-mainGreen/10 text-mainGreen rounded-full text-xs"
                          >
                            {crop.name}
                          </span>
                        ))}
                        {processor.crops.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{processor.crops.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-4">
                    <button className="text-mainGreen text-sm font-medium group-hover:underline flex items-center gap-1">
                      View Details
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Info */}
      {processors.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          Showing {processors.length} processors
        </div>
      )}
    </div>
  );
}