"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { imageLoader } from "@/app/helpers";

// Updated interface to match what the page component actually provides
export interface ProductCardData {
  id: string;
  name: string;
  quantity: string;
  price: string;
  certification: string;
  status: "Active" | "Pending Inspection" | "Sold Out" | "Suspended";
  listedDate: string;
  image: string;
  slug?: string;
  inventoryStatus?: string;
  inventoryPercentage?: number;
}

interface ProductCardContainerDetailedProps {
  products: ProductCardData[];
  onEditListing?: (productId: string) => void;
  onSuspendListing?: (productId: string) => void;
  onCancelListing?: (productId: string) => void;
}

type StatusFilter = "All" | "Active" | "Pending Inspection" | "Sold Out" | "Suspended";

const ProductCardContainerDetailed: React.FC<ProductCardContainerDetailedProps> = ({ 
  products, 
  onEditListing, 
  onSuspendListing, 
  onCancelListing 
}) => {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Map display names to filter values
  const statusDisplayMap: Record<string, StatusFilter> = {
    "All Listings": "All",
    "Active Listings": "Active",
    "Pending Inspection": "Pending Inspection",
    "Sold Out Listings": "Sold Out",
    "Suspended Listings": "Suspended"
  };

  // Get display names in order
  const availableStatusDisplayNames = [
    "All Listings", 
    "Active Listings", 
    "Pending Inspection", 
    "Sold Out Listings",
    "Suspended Listings"
  ];

  // Filter products based on active filter
  const filteredProducts = activeFilter === "All"
    ? products
    : products.filter((product) => product.status === activeFilter);

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime();
      case "oldest":
        return new Date(a.listedDate).getTime() - new Date(b.listedDate).getTime();
      case "price-low":
        return parseFloat(a.price.replace(/[^\d.]/g, '')) - parseFloat(b.price.replace(/[^\d.]/g, ''));
      case "price-high":
        return parseFloat(b.price.replace(/[^\d.]/g, '')) - parseFloat(a.price.replace(/[^\d.]/g, ''));
      case "quantity":
        return parseFloat(a.quantity.replace(/[^\d.]/g, '')) - parseFloat(b.quantity.replace(/[^\d.]/g, ''));
      default:
        return 0;
    }
  });

  // Get count for each status using the actual filter value
  const getStatusCount = (displayName: string) => {
    const filterValue = statusDisplayMap[displayName];
    if (filterValue === "All") return products.length;
    return products.filter((product) => product.status === filterValue).length;
  };

  const getButtonStyles = (displayName: string) => {
    const baseStyles = "px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2";
    const filterValue = statusDisplayMap[displayName];

    if (activeFilter === filterValue) {
      return `${baseStyles} text-mainGreen border-mainGreen`;
    } else {
      return `${baseStyles} text-gray-500 border-transparent hover:text-gray-700`;
    }
  };

  // Status Badge Component
  const StatusBadge: React.FC<{ status: ProductCardData["status"] }> = ({ status }) => {
    const getStatusStyles = () => {
      switch (status) {
        case "Active":
          return "bg-green-500 text-white";
        case "Pending Inspection":
          return "bg-yellow-500 text-white";
        case "Sold Out":
          return "bg-gray-500 text-white";
        case "Suspended":
          return "bg-red-500 text-white";
        default:
          return "bg-gray-400 text-white";
      }
    };

    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles()}`}>
        {status}
      </span>
    );
  };

  // Inventory Bar Component
  const InventoryBar: React.FC<{ percentage: number; status: string }> = ({
    percentage,
    status,
  }) => {
    const getBarColor = () => {
      if (percentage >= 100) return "bg-gray-400";
      if (percentage >= 80) return "bg-red-500";
      if (percentage >= 60) return "bg-yellow-500";
      return "bg-green-500";
    };

    return (
      <div className="w-full mt-8">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Inventory</span>
          <span className="text-xs text-gray-500">{status}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getBarColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  // Action Buttons Component
  const ActionButtons: React.FC<{
    productId: string;
    status: ProductCardData["status"];
  }> = ({ productId, status }) => {
    return (
      <div className="flex flex-col items-center justify-end space-y-2 mt-2">
        {onEditListing && (
          <button
            onClick={() => onEditListing(productId)}
            className="flex items-center space-x-2 border px-4 py-2 w-full text-center rounded border-gray-200 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors text-sm"
            title="Edit this product listing"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Edit</span>
          </button>
        )}

        {/* Show suspend button for Active products */}
        {onSuspendListing && status === "Active" && (
          <button
            onClick={() => onSuspendListing(productId)}
            className="flex items-center space-x-2 border px-4 py-2 rounded border-gray-200 text-yellow-600 hover:text-yellow-800 transition-colors text-sm"
            title="Suspend this listing"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Suspend</span>
          </button>
        )}

        {/* Show reactivate button for Suspended products */}
        {onSuspendListing && status === "Suspended" && (
          <button
            onClick={() => onSuspendListing(productId)}
            className="flex items-center space-x-2 text-green-600 hover:text-green-800 transition-colors text-sm"
            title="Reactivate this listing"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Reactivate</span>
          </button>
        )}

        {/* Show cancel button for any non-active status if needed */}
        {onCancelListing && (status === "Pending Inspection" || status === "Suspended") && (
          <button
            onClick={() => onCancelListing(productId)}
            className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors text-sm"
            title="Cancel this listing"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>Cancel</span>
          </button>
        )}
      </div>
    );
  };

  // Individual Product Card Component
  const ProductCard: React.FC<{ product: ProductCardData }> = ({ product }) => {
    const productUrl = `/products/${product.slug || product.id}`;

    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* Product Image */}
            <Link href={productUrl} className="flex-shrink-0">
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  loader={imageLoader}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                />
                {/* Status indicator on image */}
                <div className="absolute -top-2 -right-2">
                  <div className={`w-4 h-4 rounded-full border-2 border-white ${
                    product.status === 'Active' ? 'bg-green-500' :
                    product.status === 'Pending Inspection' ? 'bg-yellow-500' :
                    product.status === 'Sold Out' ? 'bg-gray-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>
            </Link>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
       
                <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer truncate">
                  {product.name}
                </h3>
         
              
              <div className="space-y-1 mt-2 text-base text-gray-600">
                <div className="flex flex-wrap gap-4">
                  <span className="flex items-center">
                    
                    Quantity: {product.quantity}
                  </span>
                  
                  <span className="flex items-center">
                  
                    Price: {product.price}
                  </span>
                </div>
                
                <div className="flex items-center">
                
                  Certification: {product.certification}
                </div>

                {/* Inventory Progress Bar */}
                {product.inventoryStatus && product.inventoryPercentage !== undefined && (
                  <div className="mt-3">
                    <InventoryBar
                      percentage={product.inventoryPercentage}
                      status={product.inventoryStatus}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side: Status and Actions */}
          <div className="flex flex-col items-end space-y-3 ml-4">
            <StatusBadge status={product.status} />
            
            <div className="text-right">
              <p className="text-xs text-gray-500">Listed</p>
              <p className="text-base text-gray-700">{product.listedDate}</p>
            </div>

            <ActionButtons productId={product.id} status={product.status} />
          </div>
        </div>
      </div>
    );
  };

  // Get display name for current filter (for the results summary)
  const getDisplayNameForFilter = (filter: StatusFilter) => {
    const entry = Object.entries(statusDisplayMap).find(([_, value]) => value === filter);
    return entry ? entry[0] : filter;
  };

  return (
    <div className="w-full space-y-6">
      {/* Status Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {availableStatusDisplayNames.map((displayName) => (
          <button
            key={displayName}
            onClick={() => setActiveFilter(statusDisplayMap[displayName])}
            className={getButtonStyles(displayName)}
          >
            <span>{displayName}</span>
            <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
              {getStatusCount(displayName)}
            </span>
          </button>
        ))}
      </div>

      {/* Results Summary and Sort */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {sortedProducts.length} of {products.length} products
          {activeFilter !== "All" && (
            <span className="ml-1">
              • Filtered by: <span className="font-medium">{getDisplayNameForFilter(activeFilter)}</span>
            </span>
          )}
        </p>

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-sm text-gray-600">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-mainGreen focus:border-mainGreen"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="quantity">Quantity</option>
          </select>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="space-y-4">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8v.01M6 5v.01"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              No products found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {activeFilter === "All"
                ? "No products available at the moment."
                : `No products with status "${getDisplayNameForFilter(activeFilter)}" found.`}
            </p>
            {activeFilter !== "All" && (
              <button
                onClick={() => setActiveFilter("All")}
                className="mt-4 text-sm text-mainGreen hover:text-mainGreen/80 font-medium"
              >
                View all products
              </button>
            )}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {sortedProducts.length > 0 && sortedProducts.length >= 10 && (
        <div className="text-center pt-6">
          <button className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCardContainerDetailed;