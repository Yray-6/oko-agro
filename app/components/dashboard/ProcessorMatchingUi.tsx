"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Users,
  Eye,
  MessageCircle,
  Star,
  CircleCheckBig,
  X,
  Phone,
  Search,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import processor1 from "@/app/assets/images/Processor1.png";
import processor2 from "@/app/assets/images/Processor2.png";
import processor3 from "@/app/assets/images/Processor3.png";
import { useProductStore } from "@/app/store/useProductStore";

interface Processor {
  id: string;
  name: string;
  contactPerson: string;
  location: string;
  distance: string;
  capacity: string;
  priceRange: string;
  priceUnit: string;
  products: string[];
  urgentRequests: string[];
  responseTime: string;
  activeRequests: number;
  rating: number;
  reviewCount: number;
  isMatched: boolean;
  image: string;
  description?: string;
  paymentMethod?: string;
  lastActive?: string;
  qualityStandards?: string[];
}

// Helper function to map API data to UI format
const mapApiToProcessor = (apiProcessor: any, index: number): Processor => {
  const images = [processor1.src, processor2.src, processor3.src];
  const randomImage = images[index % images.length];
  
  return {
    id: apiProcessor.id,
    name: apiProcessor.farmName || `${apiProcessor.firstName} ${apiProcessor.lastName}`,
    contactPerson: `${apiProcessor.firstName} ${apiProcessor.lastName}`,
    location: `${apiProcessor.state}, ${apiProcessor.country}`,
    distance: "N/A", // Not provided by API
    capacity: "Contact for details",
    priceRange: "₦1,000-1,500/kg",
    priceUnit: "negotiable",
    products: apiProcessor.crops?.map((crop: any) => crop.name) || [],
    urgentRequests: [],
    responseTime: "< 2 hours",
    activeRequests: 0,
    rating: 4.5,
    reviewCount: 0,
    isMatched: apiProcessor.perfectMatch || false,
    image: randomImage,
    description: `Located at ${apiProcessor.farmAddress}`,
    paymentMethod: "Escrow payment",
    lastActive: "Recently active",
    qualityStandards: ["Verified", "Licensed"],
  };
};

const ProcessorModal: React.FC<{
  processor: Processor;
  isOpen: boolean;
  onClose: () => void;
}> = ({ processor, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] px-3 overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1"
        >
          <X size={20} />
        </button>

        <div className="p-6 pb-4 mt-10 border border-mainGreen/10 rounded-lg">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={processor.image}
                alt={processor.name}
                className="w-full h-full object-cover"
                width={64}
                height={64}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  {processor.name}
                </h2>
                <CircleCheckBig className="text-green" size={16} />
              </div>
              <p className="text-sm text-[#6B7C5A] mb-2">
                Contact: {processor.contactPerson}
              </p>
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium text-sm">{processor.rating}</span>
                <span className="text-gray-500 text-sm">
                  ({processor.reviewCount} reviews)
                </span>
              </div>
              <p className="text-gray-500 text-xs">
                Last active: {processor.lastActive || "30 minutes ago"}
              </p>
              <p className="text-[#6B7C5A] text-xs mt-3 leading-relaxed mb-6">
                {processor.description ||
                  "Boutique processor focusing on organic and fair trade products. Premium pricing for high-quality produce."}
              </p>
              <div className="grid grid-cols-2 ">
                <div className="space-y-3 mb-6 col-span-1">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-[#6B7C5A]" />
                    <span className="text-gray-700">{processor.location}</span>
                    {processor.distance !== "N/A" && (
                      <span className="bg-[#6B7C5A]/10 text-[#6B7C5A] px-2 py-1 rounded-lg text-xs font-medium">
                        {processor.distance}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-[#6B7C5A]" />
                    <span className="text-gray-700">
                      Capacity: {processor.capacity}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-[#6B7C5A]" />
                    <span className="text-gray-700">
                      Response time: {processor.responseTime}
                    </span>
                  </div>
                </div>
                <div className="col-span-1 space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-4 h-4 flex items-center justify-center mt-0.5">
                      <span className="text-[#6B7C5A] font-bold">₦</span>
                    </div>
                    <div>
                      <span className="text-gray-900 font-medium">
                        {processor.priceRange}
                      </span>
                      <span className="text-[#6B7C5A] ml-1">
                        {processor.priceUnit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#6B7C5A] rounded-full"></div>
                    </div>
                    <span className="text-gray-700">
                      Payment: {processor.paymentMethod || "Escrow payment"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <MessageCircle className="w-4 h-4 text-[#6B7C5A]" />
                    <span className="text-gray-700">
                      {processor.activeRequests} active requests
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {processor.isMatched && (
              <span className="bg-[#B8860B] text-white text-xs  px-2 py-1 rounded-full font-medium">
                Perfect Match
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 mt-4">
          <div className=" p-6 border border-mainGreen/10 rounded-lg">
            <h3 className="font-medium text-sm text-gray-900 mb-3">
              Preferred Crops
            </h3>
            <div className="flex gap-2 flex-wrap">
              {processor.products.map((product, index) => (
                <span
                  key={index}
                  className={`text-xs flex items-center px-3 py-1.5 rounded-lg ${
                    product === "Cassava"
                      ? "text-white   bg-[#B8860B]"
                      : "text-[#6B7C5A] bg-[#6B7C5A]/10"
                  }`}
                >
                  {product}
                  {product === "Cassava" && (
                    <span className="ml-1">
                      <CircleCheckBig size={12} />
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div className=" p-6 border border-mainGreen/10 rounded-lg">
            <h3 className="font-medium text-sm mb-3">Quality Standards</h3>
            <div className="flex gap-2 flex-wrap">
              {(processor.qualityStandards || ["Organic", "Fair Trade"]).map(
                (standard, index) => (
                  <span
                    key={index}
                    className="text-[#6B7C5A] text-xs font-medium px-3 py-1.5 rounded-lg bg-[#6B7C5A]/10"
                  >
                    {standard}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {processor.urgentRequests.length > 0 && (
          <div className="p-6 mb-6 mt-5 border border-orange/50 rounded-lg">
            <div className="flex items-center gap-2 text-[#B8860B] mb-3">
              <div className="w-2 h-2 bg-[#B8860B] rounded-full"></div>
              <span className="font-medium text-sm">Urgent Requirements</span>
            </div>
            <div className="space-x-2">
              {processor.urgentRequests.map((request, index) => (
                <div
                  key={index}
                  className="bg-[#B8860B] inline text-white text-xs font-medium px-3 py-1 rounded-lg"
                >
                  {request}
                </div>
              ))}
            </div>
            <p className="text-[#6B7C5A] text-xs mt-2">
              This processor is actively looking for these products and may
              offer premium pricing.
            </p>
          </div>
        )}

        <div className="mb-8 mt-5 pt-0 gap-4 flex ">
          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-mainGreen text-white rounded-lg hover:bg-mainGreen/90 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">Send Message</span>
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-[#6B7C5A rounded-lg transition-colors">
            <Phone className="w-4 h-4" />
            <span className="font-medium">Request Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ProcessorCard: React.FC<{
  processor: Processor;
  showContactButton?: boolean;
}> = ({ processor, showContactButton = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg border border-yellow p-4 ">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={processor.image}
              alt={processor.name}
              className="w-full h-full object-cover"
              width={64}
              height={64}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold ">{processor.name}</h3>
                <CircleCheckBig className="text-green" size={16} />
                {processor.isMatched && (
                  <span className="bg-[#B8860B] text-white text-xs  px-2.5 py-0.5 rounded-full">
                    Matched
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium text-sm text-gray-900">
                  {processor.rating}
                </span>
                <span className="text-gray-500 text-sm">
                  ({processor.reviewCount})
                </span>
              </div>
            </div>

            <p className="text-sm text-[#6B7C5A]  mb-1">
              {processor.contactPerson}
            </p>

            <div className="flex items-center gap-4 text-sm text-[#6B7C5A] mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{processor.location}</span>
                {processor.distance !== "N/A" && (
                  <span className="text-mainGreen font-medium p-1 rounded-xl bg-[#6B7C5A]/10">
                    {processor.distance}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{processor.capacity}</span>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm text-gray-900">
                  {processor.priceRange}
                </span>
                <span className="text-[#6B7C5A] text-sm">
                  {processor.priceUnit}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {processor.products.map((product, index) => (
                  <span
                    key={index}
                    className=" text-[#B8860B] text-xs font-medium px-2 py-1 rounded-xl border border-[#B8860B]"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>

            {processor.urgentRequests.length > 0 && (
              <div className="mb-2">
                {processor.urgentRequests.map((request, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-orange text-xs"
                  >
                    <span className="font-medium">Urgent</span>
                    <span>{request}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-[#6B7C5A]">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Responds {processor.responseTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{processor.activeRequests} active requests</span>
                </div>
              </div>

              {showContactButton && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center cursor-pointer gap-1 px-3 py-2 text-black hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View</span>
                  </button>
                  <button className="flex items-center gap-1 px-4 py-2 bg-mainGreen text-white rounded-lg hover:bg-green-800 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Contact</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProcessorModal
        processor={processor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

const ProcessorMatchingUI: React.FC = () => {
  const {
    processors,
    processorsSearchMeta,
    isSearchingProcessors,
    processorsSearchError,
    searchProcessors,
  } = useProductStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [mappedProcessors, setMappedProcessors] = useState<Processor[]>([]);

  // Initial load
  useEffect(() => {
    handleSearch("lagos");
  }, []);

  // Map API data to UI format whenever processors change
  useEffect(() => {
    if (processors.length > 0) {
      const mapped = processors.map((proc, index) => mapApiToProcessor(proc, index));
      setMappedProcessors(mapped);
    }
  }, [processors]);

  const handleSearch = async (term?: string) => {
    try {
      await searchProcessors({
        search: term || searchTerm,
        pageNumber: 1,
        pageSize: 20,
      });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleLoadMore = async () => {
    if (processorsSearchMeta) {
      try {
        await searchProcessors({
          search: searchTerm,
          pageNumber: processorsSearchMeta.pageNumber + 1,
          pageSize: processorsSearchMeta.pageSize,
        });
      } catch (error) {
        console.error("Load more error:", error);
      }
    }
  };

  const perfectMatches = mappedProcessors.filter((p) => p.isMatched);
  const otherProcessors = mappedProcessors.filter((p) => !p.isMatched);

  return (
    <div className=" mx-auto bg-gray-50 min-h-screen">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by location, Name, Address (e.g., Lagos, Abuja)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainGreen focus:border-transparent"
          />
          <button
            onClick={() => handleSearch()}
            disabled={isSearchingProcessors}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-mainGreen text-white rounded-lg hover:bg-mainGreen/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSearchingProcessors ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Searching...</span>
              </>
            ) : (
              <span className="text-sm">Search</span>
            )}
          </button>
        </div>
        
        {processorsSearchError && (
          <div className="mt-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {processorsSearchError}
          </div>
        )}

        {processorsSearchMeta && (
          <div className="mt-2 text-sm text-gray-600">
            Showing {mappedProcessors.length} of {processorsSearchMeta.totalRecord} processors
            {processorsSearchMeta.matchedRecord > 0 && (
              <span className="ml-2 text-mainGreen font-medium">
                ({processorsSearchMeta.matchedRecord} perfect matches)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isSearchingProcessors && mappedProcessors.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-mainGreen" />
        </div>
      )}

      {/* No Results */}
      {!isSearchingProcessors && mappedProcessors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No processors found. Try a different search term.</p>
        </div>
      )}

      {/* Perfect Matches Section */}
      {perfectMatches.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 my-2">
            <h2 className=" font-medium text-gray-900">Perfect Matches</h2>
            <span className="bg-orange text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
              {perfectMatches.length}
            </span>
          </div>
          <div className="space-y-4">
            {perfectMatches.map((processor) => (
              <ProcessorCard key={processor.id} processor={processor} />
            ))}
          </div>
        </div>
      )}

      {/* All Processors Section */}
      {otherProcessors.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className=" font-medium text-gray-900">All Processors</h2>
            <span className="text-gray-600">({otherProcessors.length})</span>
          </div>
          <div className="space-y-4">
            {otherProcessors.map((processor) => (
              <ProcessorCard
                key={processor.id}
                processor={processor}
                showContactButton={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Load More Button */}
      {processorsSearchMeta && 
       processorsSearchMeta.pageNumber * processorsSearchMeta.pageSize < processorsSearchMeta.totalRecord && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isSearchingProcessors}
            className="px-6 py-3 bg-white border border-mainGreen text-mainGreen rounded-lg hover:bg-mainGreen/5 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSearchingProcessors ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Load More Processors</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProcessorMatchingUI;