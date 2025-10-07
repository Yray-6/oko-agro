"use client";
import ProcessorMatchingUI from "@/app/components/dashboard/ProcessorMatchingUi";
import { useProductStore } from "@/app/store/useProductStore";
import React from "react";
import { TrendingUp, Users, Target } from "lucide-react";
import Link from "next/link";

interface StatsData {
  perfectMatches: number;
  totalProcessors: number;
  matchedProcessors: number;
  matchPercentage: number;
  uniqueCrops: number;
  topState: string;
  currentPage: number;
  pageSize: number;
}

export default function Page() {
  const {
    processors,
    processorsSearchMeta,
    isSearchingProcessors,
  } = useProductStore();

  // Calculate comprehensive stats from the processors data
  const stats: StatsData = React.useMemo(() => {
    // Count perfect matches
    const perfectMatches = processors.filter(
      (processor) => processor.perfectMatch
    ).length;

    // Total processors from API
    const totalProcessors = processorsSearchMeta?.totalRecord || 0;

    // Matched processors from API
    const matchedProcessors = processorsSearchMeta?.matchedRecord || 0;

    // Calculate percentage of perfect matches
    const matchPercentage = totalProcessors > 0 
      ? Math.round((perfectMatches / totalProcessors) * 100)
      : 0;

    // Count unique crops across all processors
    const allCrops = processors.flatMap(p => p.crops?.map(c => c.name) || []);
    const uniqueCrops = new Set(allCrops).size;

    // Count processors by state
    const stateCount = processors.reduce((acc: Record<string, number>, p) => {
      const state = p.state || 'Unknown';
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topStateEntry = Object.entries(stateCount).sort((a, b) => b[1] - a[1])[0];
    const topState = topStateEntry ? `${topStateEntry[0]} (${topStateEntry[1]})` : 'N/A';

    return {
      perfectMatches,
      totalProcessors,
      matchedProcessors,
      matchPercentage,
      uniqueCrops,
      topState,
      currentPage: processorsSearchMeta?.pageNumber || 1,
      pageSize: processorsSearchMeta?.pageSize || 20,
    };
  }, [processors, processorsSearchMeta]);

  return (
    <div>
      <div className="justify-between flex items-center py-4">
        <div>
          <p className="font-medium text-lg">Find Processors</p>
          <p className="text-sm">
            Connect with processors looking for your crops
          </p>
        </div>
        <div><Link href="/dashboard">
        </Link>
      
        </div>
      </div>
      {/* <div>
        <SearchBar />
      </div> */}
      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-9">
          <ProcessorMatchingUI />
        </div>
        <div className="col-span-3 flex flex-col gap-3 mt-10">
          {/* Perfect Matches with Icon */}
          <div className="flex justify-center items-center flex-col border border-[#B8860B]/30 bg-[#B8860B]/5 text-[#6B7C5A] rounded-xl py-4 w-full transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-[#B8860B]" />
            </div>
            <p className="text-[#B8860B] text-2xl font-bold">
              {isSearchingProcessors ? (
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

          {/* Total Processors */}
          <div className="flex justify-center items-center flex-col border border-mainGreen/30 bg-mainGreen/5 text-[#6B7C5A] rounded-xl py-4 w-full transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-mainGreen" />
            </div>
            <p className="text-mainGreen text-2xl font-bold">
              {isSearchingProcessors ? (
                <span className="animate-pulse">...</span>
              ) : (
                stats.totalProcessors
              )}
            </p>
            <p className="text-xs font-medium">Total Processors</p>
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
              {isSearchingProcessors ? (
                <span className="animate-pulse">...</span>
              ) : (
                stats.matchedProcessors
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
          {!isSearchingProcessors && processors.length > 0 && (
            <div className="border border-[#6B7C5A]/30 rounded-xl p-3 text-xs text-[#6B7C5A]">
              <p className="font-medium mb-2">Search Summary</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Showing:</span>
                  <span className="font-medium">{processors.length} processors</span>
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