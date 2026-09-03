'use client'
import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Loader2, ChevronLeft, ChevronRight, Eye, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardIcon from "@/app/assets/icons/Dashboard";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useBuyRequestStore } from "@/app/store/useRequestStore";
import ContactProcessorModal from "@/app/components/dashboard/ContactProcessorModal";
import { BuyRequest } from "@/app/types";
import { formatQuantity } from "@/app/helpers";

export default function MarketplacePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    generalRequests, 
    generalRequestsPagination,
    isFetching, 
    fetchGeneralRequests 
  } = useBuyRequestStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const filterRef = useRef<HTMLDivElement>(null);

  // Fetch general buy requests on mount and page change
  useEffect(() => {
    fetchGeneralRequests(currentPage, pageSize);
  }, [currentPage, pageSize, fetchGeneralRequests]);

  // Format price
  const formatPrice = (price: string): string => {
    return `₦${parseFloat(price).toLocaleString('en-NG')}`;
  };

  // Extract numeric quantity for filtering
  const getQuantityValue = (quantity: string): number => {
    const match = quantity.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  // Filter and sort buy requests
  let filteredRequests = generalRequests.filter(request => {
    // Hide requests that have a seller assigned and are no longer pending
    if (request.seller && request.status !== 'pending') return false;

    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const cropName = request.cropType?.name || '';
    const companyName = request.buyer?.companyName || '';
    const location = request.deliveryLocation || '';
    const description = request.description || '';
    
    return (
      cropName.toLowerCase().includes(searchLower) ||
      companyName.toLowerCase().includes(searchLower) ||
      location.toLowerCase().includes(searchLower) ||
      description.toLowerCase().includes(searchLower)
    );
  });

  // Apply sorting
  if (sortBy === 'date-recent') {
    filteredRequests = [...filteredRequests].sort((a, b) => {
      const dateA = a.estimatedDeliveryDate || a.createdAt || '';
      const dateB = b.estimatedDeliveryDate || b.createdAt || '';
      return dateB.localeCompare(dateA);
    });
  } else if (sortBy === 'date-oldest') {
    filteredRequests = [...filteredRequests].sort((a, b) => {
      const dateA = a.estimatedDeliveryDate || a.createdAt || '';
      const dateB = b.estimatedDeliveryDate || b.createdAt || '';
      return dateA.localeCompare(dateB);
    });
  } else if (sortBy === 'price-low') {
    filteredRequests = [...filteredRequests].sort((a, b) => {
      const priceA = parseFloat(a.pricePerKgOffer || '0');
      const priceB = parseFloat(b.pricePerKgOffer || '0');
      return priceA - priceB;
    });
  } else if (sortBy === 'price-high') {
    filteredRequests = [...filteredRequests].sort((a, b) => {
      const priceA = parseFloat(a.pricePerKgOffer || '0');
      const priceB = parseFloat(b.pricePerKgOffer || '0');
      return priceB - priceA;
    });
  } else if (sortBy === 'quantity-low') {
    filteredRequests = [...filteredRequests].sort((a, b) => {
      return getQuantityValue(a.productQuantityKg) - getQuantityValue(b.productQuantityKg);
    });
  } else if (sortBy === 'quantity-high') {
    filteredRequests = [...filteredRequests].sort((a, b) => {
      return getQuantityValue(b.productQuantityKg) - getQuantityValue(a.productQuantityKg);
    });
  }

  const handleFilterOption = (option: string) => {
    setShowFilters(false);
    
    // Handle different filter options
    switch (option) {
      case 'crop-category':
        // Open crop category filter (you can implement a sub-menu or modal)
        break;
      case 'date-recent':
        setSortBy('date-recent');
        break;
      case 'date-oldest':
        setSortBy('date-oldest');
        break;
      case 'location':
        // Open location filter
        break;
      case 'price':
        // Open price filter
        break;
      case 'quantity':
        // Open quantity filter
        break;
      default:
        break;
    }
  };

  const [selectedRequest, setSelectedRequest] = useState<BuyRequest | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const handleSendMessage = (request: BuyRequest) => {
    setSelectedRequest(request);
    setShowContactModal(true);
  };

  const handleViewProcessor = (request: BuyRequest) => {
    if (request.buyer?.id) {
      router.push(`/dashboard/find-processor/processor-details?processorId=${request.buyer.id}`);
    }
  };

  // Pagination helpers
  const totalPages = Math.ceil(generalRequestsPagination.totalRecord / pageSize);
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCloseContactModal = () => {
    setShowContactModal(false);
    setSelectedRequest(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="justify-between flex items-center py-4 mb-6">
        <div>
          <p className="font-medium text-lg">Marketplace</p>
          <p className="text-sm text-gray-600">
            View all processor requests available on the platform
          </p>
        </div>
        <div>
          <Link href="/dashboard">
            <button className="flex gap-2 items-center cursor-pointer px-4 py-2 rounded-lg text-sm text-mainGreen border border-mainGreen hover:bg-mainGreen/5 transition-colors">
              <DashboardIcon color="#004829" size={16} /> 
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>

      {/* Search and Filter Bar */}
  

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Main Content Area - 9 columns */}
        <div className="col-span-12 lg:col-span-9">
        <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by company, location, or crop type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#F8FAF5] border border-gray-200 rounded-[10px] focus:ring-2 focus:ring-mainGreen focus:border-transparent outline-none text-sm"
          />
        </div>
        <div className="relative" ref={filterRef}>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-[rgba(45,80,22,0.15)] rounded-[10px] hover:bg-gray-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.33 2H4.67M1.33 8H14.67M1.33 14H14.67" stroke="#0A0A0A" strokeWidth="1.33" strokeLinecap="round"/>
            </svg>
            <span className="text-sm font-semibold text-[#0A0A0A]">Filters</span>
            <ChevronDown 
              size={16} 
              className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Filter Dropdown Menu */}
          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-2">
                <button
                  onClick={() => handleFilterOption('crop-category')}
                  className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
                >
                  By Crop Category
                </button>
                <button
                  onClick={() => handleFilterOption('date-recent')}
                  className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
                >
                  By Date (Recent to Oldest)
                </button>
                <button
                  onClick={() => handleFilterOption('location')}
                  className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
                >
                  By Location
                </button>
                <button
                  onClick={() => handleFilterOption('price')}
                  className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
                >
                  By Price
                </button>
                <button
                  onClick={() => handleFilterOption('quantity')}
                  className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
                >
                  By Quantity
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
          {/* Loading State */}
          {isFetching && filteredRequests.length === 0 && (
            <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
              <Loader2 className="w-8 h-8 animate-spin text-mainGreen" />
            </div>
          )}

          {/* Buy Requests List */}
          {!isFetching && (
            <div className="space-y-[18px]">
              {filteredRequests.map((request) => {
                const cropName = request.cropType?.name || request.description || 'Product';
                const companyName = request.buyer?.companyName || `${request.buyer?.firstName} ${request.buyer?.lastName}` || 'Processor';
                
                return (
                  <div
                    key={request.id}
                    className="bg-white rounded-[11.75px] border border-gray-200 shadow-[0px_0px_2.35px_0px_rgba(0,0,0,0.25)] p-4 flex gap-4"
                  >
                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-medium text-black mb-2">
                          {cropName} {companyName && `- ${companyName}`}
                        </h3>
                        <div className="space-y-1 text-sm font-light text-black">
                          <p>Quantity: {formatQuantity(request.productQuantityKg)}kg | {formatPrice(request.pricePerKgOffer)}/kg</p>
                          {request.estimatedDeliveryDate && (
                            <p className="mt-5">Expected Delivery Date: {new Date(request.estimatedDeliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          )}
                          <p className="text-xs text-gray-500">Location: {request.deliveryLocation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex flex-col items-end justify-end gap-2">
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewProcessor(request)}
                          className="px-4 py-2 border border-mainGreen rounded-[10px] shadow-[0px_0px_1.62px_0px_rgba(0,0,0,0.25)] hover:bg-mainGreen/5 transition-colors flex items-center gap-2"
                        >
                          <Eye size={16} className="text-mainGreen" />
                          <span className="text-sm font-medium text-mainGreen">View Processor</span>
                        </button>
                        <button
                          onClick={() => handleSendMessage(request)}
                          className="px-4 py-2 border border-mainGreen rounded-[10px] shadow-[0px_0px_1.62px_0px_rgba(0,0,0,0.25)] hover:bg-mainGreen/5 transition-colors flex items-center gap-2"
                        >
                          <MessageSquare size={16} className="text-mainGreen" />
                          <span className="text-sm font-medium text-mainGreen">Send A Message</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!isFetching && filteredRequests.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-2 font-medium">No buy requests found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or check back later</p>
            </div>
          )}

          {/* Pagination Controls */}
          {!isFetching && generalRequestsPagination.totalRecord > 0 && (
            <div className="flex items-center justify-between mt-6 bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, generalRequestsPagination.totalRecord)} of {generalRequestsPagination.totalRecord} requests
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          currentPage === pageNum
                            ? 'bg-mainGreen text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Sidebar - 3 columns */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          {/* Requests Card */}
          <div className="bg-white border border-[rgba(45,80,22,0.15)] rounded-2xl p-4">
            <div className="flex flex-col items-center text-center">
              <p className="text-2xl font-semibold text-[#2D5016] mb-1">
                {generalRequestsPagination.totalRecord}
              </p>
              <p className="text-sm text-[#6B7C5A]">Requests</p>
            </div>
          </div>

          {/* Processors Card */}
          <div className="bg-white border border-[rgba(45,80,22,0.15)] rounded-2xl p-4">
            <div className="flex flex-col items-center text-center">
              <p className="text-2xl font-semibold text-[#2D5016] mb-1">
                {new Set(generalRequests.map(r => r.buyer?.id).filter(Boolean)).size}
              </p>
              <p className="text-sm text-[#6B7C5A]">Processors</p>
            </div>
          </div>

          {/* Crop Categories Card */}
          <div className="bg-white border border-[rgba(45,80,22,0.15)] rounded-2xl p-4">
            <div className="flex flex-col items-center text-center">
              <p className="text-2xl font-semibold text-[#2D5016] mb-1">
                {new Set(generalRequests.map(r => r.cropType?.id).filter(Boolean)).size}
              </p>
              <p className="text-sm text-[#6B7C5A]">Crop Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Processor Modal — shared component */}
      {selectedRequest && (
        <ContactProcessorModal
          isOpen={showContactModal}
          onClose={handleCloseContactModal}
          buyRequest={selectedRequest}
          processorId={selectedRequest.buyer?.id || ''}
          processorName={selectedRequest.buyer?.companyName || `${selectedRequest.buyer?.firstName} ${selectedRequest.buyer?.lastName}` || 'Processor'}
        />
      )}
    </div>
  );
}
