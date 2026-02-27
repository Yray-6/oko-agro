/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Users,
  Eye,
  MessageCircle,
  Star,
  CircleCheckBig,
  Search,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import processor1 from "@/app/assets/images/Processor1.png";
import processor2 from "@/app/assets/images/Processor2.png";
import processor3 from "@/app/assets/images/Processor3.png";
import { useProductStore } from "@/app/store/useProductStore";
import { useRouter } from "next/navigation";
import apiClient from "@/app/utils/apiClient";
import { UserRatingStatsResponse } from "@/app/types";

interface Farmer {
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

// Helper function to fetch rating for a user
const fetchUserRating = async (userId: string): Promise<{ average: number; total: number }> => {
  try {
    const response = await apiClient.get<UserRatingStatsResponse>(
      `/ratings?userId=${userId}`
    );
    if (response.data.statusCode === 200 && response.data.data) {
      return {
        average: response.data.data.average || 0,
        total: response.data.data.total || 0,
      };
    }
  } catch (error) {
    console.error(`Error fetching rating for user ${userId}:`, error);
  }
  return { average: 0, total: 0 };
};

// Helper function to map API data to UI format
const mapApiToFarmer = (apiFarmer: any, index: number, ratings?: Record<string, { average: number; total: number }>): Farmer => {
  const images = [processor1.src, processor2.src, processor3.src];
  const randomImage = images[index % images.length];
  
  const farmerRating = ratings?.[apiFarmer.id] || { average: 0, total: 0 };
  
  return {
    id: apiFarmer.id,
    name: apiFarmer.farmName || `${apiFarmer.firstName} ${apiFarmer.lastName}`,
    contactPerson: `${apiFarmer.firstName} ${apiFarmer.lastName}`,
    location: `${apiFarmer.state}, ${apiFarmer.country}`,
    distance: "N/A",
    capacity: "Contact for details",
    priceRange: "₦1,000-1,500/kg",
    priceUnit: "negotiable",
    products: apiFarmer.crops?.map((crop: any) => crop.name) || [],
    urgentRequests: [],
    responseTime: "< 2 hours",
    activeRequests: 0,
    rating: farmerRating.average,
    reviewCount: farmerRating.total,
    isMatched: apiFarmer.perfectMatch || false,
    image: randomImage,
    description: `Located at ${apiFarmer.farmAddress}`,
    paymentMethod: "Escrow payment",
    lastActive: "Recently active",
    qualityStandards: ["Verified", "Licensed"],
  };
};

const FarmerCard: React.FC<{
  farmer: Farmer;
  showContactButton?: boolean;
}> = ({ farmer, showContactButton = true }) => {
  const router = useRouter();

  const handleFarmerDetails = () => {
    // Navigate to farmer details page with farmer ID as query parameter
    router.push(`/dashboard-processor/find-farmer/farmer-details?farmerId=${farmer.id}`);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-yellow p-4">
        <div className="flex items-start gap-4">
          {/* Company Image */}
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={farmer.image}
              alt={farmer.name}
              className="w-full h-full object-cover"
              width={64}
              height={64}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{farmer.name}</h3>
                <CircleCheckBig className="text-green" size={16} />
                {farmer.isMatched && (
                  <span className="bg-[#B8860B] text-white text-xs px-2.5 py-0.5 rounded-full">
                    Matched
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {farmer.reviewCount > 0 ? (
                  <>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium text-sm text-gray-900">
                      {farmer.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({farmer.reviewCount})
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500 text-sm">
                    No ratings yet
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-[#6B7C5A] mb-1">
              {farmer.contactPerson}
            </p>

            <div className="flex items-center gap-4 text-sm text-[#6B7C5A] mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{farmer.location}</span>
                {farmer.distance !== "N/A" && (
                  <span className="text-mainGreen font-medium p-1 rounded-xl bg-[#6B7C5A]/10">
                    {farmer.distance}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{farmer.capacity}</span>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex gap-2 flex-wrap">
                {farmer.products.map((product, index) => (
                  <span
                    key={index}
                    className="text-[#B8860B] text-xs font-medium px-2 py-1 rounded-xl border border-[#B8860B]"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center mt-3 justify-end">
              {showContactButton && (
                <div className="flex gap-2 ">
                  <button 
                    onClick={handleFarmerDetails} 
                    className="flex items-center gap-1 px-3 py-2 text-black hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View Farmer</span>
                  </button>
                  {/* <button className="flex items-center gap-1 px-4 py-2 bg-mainGreen text-white rounded-lg hover:bg-green-800 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Contact</span>
                  </button> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const FarmerMatchingUI: React.FC = () => {
  const {
    farmers,
    farmersSearchMeta,
    isSearchingFarmers,
    farmersSearchError,
    searchFarmers,
  } = useProductStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [mappedFarmers, setMappedFarmers] = useState<Farmer[]>([]);
  const [ratings, setRatings] = useState<Record<string, { average: number; total: number }>>({});
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);

  // Initial load - fetch all farmers
  useEffect(() => {
    handleSearch("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch ratings for all farmers when farmers list changes
  useEffect(() => {
    const fetchRatings = async () => {
      if (farmers.length === 0) return;
      
      setIsLoadingRatings(true);
      try {
        // Fetch ratings for all farmers in parallel
        const ratingPromises = farmers.map(async (farmer) => {
          const rating = await fetchUserRating(farmer.id);
          return { userId: farmer.id, rating };
        });
        
        const ratingResults = await Promise.all(ratingPromises);
        const ratingsMap: Record<string, { average: number; total: number }> = {};
        
        ratingResults.forEach(({ userId, rating }) => {
          ratingsMap[userId] = rating;
        });
        
        setRatings(ratingsMap);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setIsLoadingRatings(false);
      }
    };

    fetchRatings();
  }, [farmers]);

  // Map API data to UI format whenever farmers or ratings change
  useEffect(() => {
    if (farmers.length > 0) {
      const mapped = farmers.map((farmer, index) => mapApiToFarmer(farmer, index, ratings));
      setMappedFarmers(mapped);
    }
  }, [farmers, ratings]);

  const handleSearch = async (term?: string) => {
    try {
      await searchFarmers({
        search: term !== undefined ? term : searchTerm,
        pageNumber: 1,
        pageSize: 20,
      });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleLoadMore = async () => {
    if (farmersSearchMeta) {
      try {
        await searchFarmers({
          search: searchTerm,
          pageNumber: farmersSearchMeta.pageNumber + 1,
          pageSize: farmersSearchMeta.pageSize,
        });
      } catch (error) {
        console.error("Load more error:", error);
      }
    }
  };

  const perfectMatches = mappedFarmers.filter((f) => f.isMatched);
  const otherFarmers = mappedFarmers.filter((f) => !f.isMatched);

  return (
    <div className="mx-auto bg-gray-50 min-h-screen">
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
            disabled={isSearchingFarmers}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-mainGreen text-white rounded-lg hover:bg-mainGreen/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSearchingFarmers ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Searching...</span>
              </>
            ) : (
              <span className="text-sm">Search</span>
            )}
          </button>
        </div>
        
        {farmersSearchError && (
          <div className="mt-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {farmersSearchError}
          </div>
        )}

        {farmersSearchMeta && (
          <div className="mt-2 text-sm text-gray-600">
            Showing {mappedFarmers.length} of {farmersSearchMeta.totalRecord} farmers
            {farmersSearchMeta.matchedRecord > 0 && (
              <span className="ml-2 text-mainGreen font-medium">
                ({farmersSearchMeta.matchedRecord} perfect matches)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isSearchingFarmers && mappedFarmers.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-mainGreen" />
        </div>
      )}

      {/* No Results */}
      {!isSearchingFarmers && mappedFarmers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No farmers found. Try a different search term.</p>
        </div>
      )}

      {/* Perfect Matches Section */}
      {perfectMatches.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 my-2">
            <h2 className="font-medium text-gray-900">Perfect Matches</h2>
            <span className="bg-orange text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
              {perfectMatches.length}
            </span>
          </div>
          <div className="space-y-4">
            {perfectMatches.map((farmer) => (
              <FarmerCard key={farmer.id} farmer={farmer} />
            ))}
          </div>
        </div>
      )}

      {/* All Farmers Section */}
      {otherFarmers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-medium text-gray-900">All Farmers</h2>
            <span className="text-gray-600">({otherFarmers.length})</span>
          </div>
          <div className="space-y-4">
            {otherFarmers.map((farmer) => (
              <FarmerCard
                key={farmer.id}
                farmer={farmer}
                showContactButton={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Load More Button */}
      {farmersSearchMeta && 
       farmersSearchMeta.pageNumber * farmersSearchMeta.pageSize < farmersSearchMeta.totalRecord && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isSearchingFarmers}
            className="px-6 py-3 bg-white border border-mainGreen text-mainGreen rounded-lg hover:bg-mainGreen/5 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSearchingFarmers ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Load More Farmers</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default FarmerMatchingUI;