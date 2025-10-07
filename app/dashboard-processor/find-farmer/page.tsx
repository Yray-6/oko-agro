"use client";
import React from "react";
import { TrendingUp, Users, Target } from "lucide-react";
import { useProductStore } from "@/app/store/useProductStore";
import FarmerMatchingUI from "@/app/components/dashboad-processor/FarmersMatchingUi";
import Link from "next/link";
import DashboardIcon from "@/app/assets/icons/Dashboard";

interface StatsData {
  perfectMatches: number;
  totalFarmers: number;
  matchedFarmers: number;
  matchPercentage: number;
  uniqueCrops: number;
  topState: string;
  currentPage: number;
  pageSize: number;
}

export default function FindFarmersPage() {
  const {
    farmers,
    farmersSearchMeta,
    isSearchingFarmers,
  } = useProductStore();

  // Calculate comprehensive stats from the farmers data
  const stats: StatsData = React.useMemo(() => {
    // Count perfect matches
    const perfectMatches = farmers.filter(
      (farmer) => farmer.perfectMatch
    ).length;

    // Total farmers from API
    const totalFarmers = farmersSearchMeta?.totalRecord || 0;

    // Matched farmers from API
    const matchedFarmers = farmersSearchMeta?.matchedRecord || 0;

    // Calculate percentage of perfect matches
    const matchPercentage = totalFarmers > 0 
      ? Math.round((perfectMatches / totalFarmers) * 100)
      : 0;

    // Count unique crops across all farmers
    const allCrops = farmers.flatMap(f => f.crops?.map(c => c.name) || []);
    const uniqueCrops = new Set(allCrops).size;

    // Count farmers by state
    const stateCount = farmers.reduce((acc: Record<string, number>, f) => {
      const state = f.state || 'Unknown';
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topStateEntry = Object.entries(stateCount).sort((a, b) => b[1] - a[1])[0];
    const topState = topStateEntry ? `${topStateEntry[0]} (${topStateEntry[1]})` : 'N/A';

    return {
      perfectMatches,
      totalFarmers,
      matchedFarmers,
      matchPercentage,
      uniqueCrops,
      topState,
      currentPage: farmersSearchMeta?.pageNumber || 1,
      pageSize: farmersSearchMeta?.pageSize || 20,
    };
  }, [farmers, farmersSearchMeta]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="justify-between flex items-center py-4 mb-6">
        <div>
          <p className="font-medium text-lg">Find Farmers</p>
          <p className="text-sm text-gray-600">
            Connect with farmers with capacity to fulfill your request
          </p>
        </div>
        <div>
            <Link href={'/dashboard-processor'}>
                <button className="flex gap-2 items-center cursor-pointer px-4 py-2 rounded-lg text-sm text-mainGreen border border-mainGreen hover:bg-mainGreen/5 transition-colors">
             <DashboardIcon color="#004829" size={16} /> 
            Back to Dashboard
          </button></Link>
      
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Main Content Area - 9 columns */}
        <div className="col-span-9">
          {/* Your FarmerMatchingUI component goes here */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
                <FarmerMatchingUI/>
          </div>
        </div>

        {/* Stats Sidebar - 3 columns */}
        <div className="col-span-3 flex flex-col gap-3">
          {/* Perfect Matches */}
          <div className="flex justify-center items-center flex-col border border-[#B8860B]/30 bg-[#B8860B]/5 text-[#6B7C5A] rounded-xl py-4 w-full transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-[#B8860B]" />
            </div>
            <p className="text-[#B8860B] text-2xl font-bold">
              {isSearchingFarmers ? (
                <span className="animate-pulse">...</span>
              ) : (
                stats.perfectMatches
              )}
            </p>
            <p className="text-xs font-medium">Perfect Matches</p>
            {stats.matchPercentage > 0 && (
              <p className="text-[10px] text-[#6B7C5A] mt-1">
                {stats.matchPercentage}% match rate
              </p>
            )}
          </div>

          {/* Total Farmers */}
          <div className="flex justify-center items-center flex-col border border-mainGreen/30 bg-mainGreen/5 text-[#6B7C5A] rounded-xl py-4 w-full transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-mainGreen" />
            </div>
            <p className="text-mainGreen text-2xl font-bold">
              {isSearchingFarmers ? (
                <span className="animate-pulse">...</span>
              ) : (
                stats.totalFarmers
              )}
            </p>
            <p className="text-xs font-medium">Total Farmers</p>
            {stats.currentPage > 1 && (
              <p className="text-[10px] text-[#6B7C5A] mt-1">
                Page {stats.currentPage}
              </p>
            )}
          </div>

          {/* Matched Results */}
          <div className="flex justify-center items-center flex-col border border-[#6B7C5A]/30 bg-[#6B7C5A]/5 text-[#6B7C5A] rounded-xl py-4 w-full transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-[#6B7C5A]" />
            </div>
            <p className="text-[#6B7C5A] text-2xl font-bold">
              {isSearchingFarmers ? (
                <span className="animate-pulse">...</span>
              ) : (
                stats.matchedFarmers
              )}
            </p>
            <p className="text-xs font-medium">Matched Results</p>
            {stats.uniqueCrops > 0 && (
              <p className="text-[10px] text-[#6B7C5A] mt-1">
                {stats.uniqueCrops} crop types
              </p>
            )}
          </div>

          {/* Top Location */}
          {stats.topState !== 'N/A' && (
            <div className="flex justify-center items-center flex-col border border-[#6B7C5A]/30 text-[#6B7C5A] rounded-xl py-4 w-full">
              <p className="text-mainGreen text-sm font-medium">
                {stats.topState}
              </p>
              <p className="text-xs">Top Location</p>
            </div>
          )}

          {/* Quick Stats Summary */}
          {!isSearchingFarmers && farmers.length > 0 && (
            <div className="border border-[#6B7C5A]/30 rounded-xl p-3 text-xs text-[#6B7C5A]">
              <p className="font-medium mb-2">Search Summary</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Showing:</span>
                  <span className="font-medium">{farmers.length} farmers</span>
                </div>
                {stats.perfectMatches > 0 && (
                  <div className="flex justify-between">
                    <span>Perfect:</span>
                    <span className="font-medium text-[#B8860B]">
                      {stats.perfectMatches} matches
                    </span>
                  </div>
                )}
                {stats.uniqueCrops > 0 && (
                  <div className="flex justify-between">
                    <span>Crops:</span>
                    <span className="font-medium">{stats.uniqueCrops} types</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}