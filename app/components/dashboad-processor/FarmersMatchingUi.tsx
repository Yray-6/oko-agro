"use client";
import React, { useState } from "react";
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
} from "lucide-react";
import Image from "next/image";
import processor1 from "@/app/assets/images/Processor1.png";
import processor2 from "@/app/assets/images/Processor2.png";
import processor3 from "@/app/assets/images/Processor3.png";
import { useRouter } from "next/navigation";

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

const ProcessorModal: React.FC<{
  processor: Processor;
  isOpen: boolean;
  onClose: () => void;
}> = ({ processor, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] px-3 overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1"
        >
          <X size={20} />
        </button>

        {/* Header Section */}
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
              {/* Description */}
              <p className="text-[#6B7C5A] text-xs mt-3 leading-relaxed mb-6">
                {processor.description ||
                  "Boutique processor focusing on organic and fair trade products. Premium pricing for high-quality produce."}
              </p>
              {/* Key Information Grid */}
              <div className="grid grid-cols-2 ">
                <div className="space-y-3 mb-6 col-span-1">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-[#6B7C5A]" />
                    <span className="text-gray-700">{processor.location}</span>
                    <span className="bg-[#6B7C5A]/10 text-[#6B7C5A] px-2 py-1 rounded-lg text-xs font-medium">
                      {processor.distance}
                    </span>
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

        {/* Preferred Crops Section */}
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
          {/* Quality Standards Section */}
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

        {/* Urgent Requirements */}
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

        {/* Action Buttons */}
        <div className="mb-8 pt-0 gap-4 flex ">
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
  const router = useRouter();

  return (
    <>
      <div className="bg-white rounded-lg border border-yellow p-4 ">
        <div className="flex items-start gap-4">
          {/* Company Image */}
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={processor.image}
              alt={processor.name}
              className="w-full h-full object-cover"
              width={64}
              height={64}
            />
          </div>

          {/* Main Content */}
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
                <span className="text-mainGreen font-medium p-1 rounded-xl bg-[#6B7C5A]/10">
                  {processor.distance}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{processor.capacity}</span>
              </div>
            </div>

            <div className="mb-3">
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

            <div className="flex items-center mt-3 justify-between">
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
                    onClick={() => router.push('/dashboard-processor/find-farmer/farmer-details')}
                    className="flex items-center gap-1 px-3 py-2 text-black hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View Farmer</span>
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

const FarmerMatchingUI: React.FC = () => {
  const perfectMatches: Processor[] = [
    {
      id: "1",
      name: "Prisitine Crops and Livestock",
      contactPerson: "Chioma Eze",
      location: "Lagos, Nigeria",
      distance: "25km",
      capacity: "30 tons/month",
      priceRange: "₦1,600-2,000/kg",
      priceUnit: "for Yam",
      products: ["Plantain", "Yam", "Cassava"],
      urgentRequests: [" Organic Cassava"],
      responseTime: "< 1 hour",
      activeRequests: 15,
      rating: 4.2,
      reviewCount: 89,
      isMatched: true,
      image: processor1.src,
    },
    {
      id: "2",
      name: "Prisitine Crops and Livestock",
      contactPerson: "Sarah Okafor",
      location: "Abuja, Nigeria",
      distance: "45km",
      capacity: "50 tons/month",
      priceRange: "₦1,000-1,200/kg",
      priceUnit: "for Cassava",
      products: ["Cassava", "Maize", "Rice"],
      urgentRequests: [" Premium Cassava", " Organic Maize"],
      responseTime: "< 2 hours",
      activeRequests: 12,
      rating: 4.8,
      reviewCount: 156,
      isMatched: true,
      image: processor2.src,
    },
  ];

  const allProcessors: Processor[] = [
    ...perfectMatches,
    {
      id: "3",
      name: "Prisitine Crops and Livestock",
      contactPerson: "Chioma Eze",
      location: "Lagos, Nigeria",
      distance: "25km",
      capacity: "30 tons/month",
      priceRange: "₦160-200/kg",
      priceUnit: "for Yam",
      products: ["Plantain", "Yam", "Cassava"],
      urgentRequests: [],
      responseTime: "< 1 hour",
      activeRequests: 15,
      rating: 4.2,
      reviewCount: 89,
      isMatched: true,
      image: processor3.src,
    },
  ];

  return (
    <div className=" mx-auto bg-gray-50 min-h-screen">
      {/* Perfect Matches Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 my-2">
          <h2 className=" font-medium text-gray-900">Perfect Matches</h2>
          <span className="bg-orange text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
            2
          </span>
        </div>
        <div className="space-y-4">
          {perfectMatches.map((processor) => (
            <ProcessorCard key={processor.id} processor={processor} />
          ))}
        </div>
      </div>

      {/* All Processors Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className=" font-medium text-gray-900">All Processors</h2>
          <span className="text-gray-600">(4)</span>
        </div>
        <div className="space-y-4">
          {allProcessors.slice(2).map((processor) => (
            <ProcessorCard
              key={processor.id}
              processor={processor}
              showContactButton={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerMatchingUI;
