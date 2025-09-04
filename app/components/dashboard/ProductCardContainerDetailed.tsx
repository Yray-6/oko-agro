"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface Product {
  id: number;
  name: string;
  quantity: string;
  price: string;
  certification: string;
  status: "Active" | "Pending Inspection" | "Sold Out";
  listedDate: string;
  image: string;
  slug?: string;
  inventoryStatus?: string;
  inventoryPercentage?: number;
}

interface ProductCardContainerDetailedProps {
  products: Product[];
  onEditListing?: (productId: number) => void;
  onSuspendListing?: (productId: number) => void;
  onCancelListing?: (productId: number) => void;
}

type StatusFilter = "All" | "Active" | "Pending Inspection" | "Sold Out";

const ProductCardContainerDetailed: React.FC<
  ProductCardContainerDetailedProps
> = ({ products, onEditListing, onSuspendListing, onCancelListing }) => {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");

  // Map display names to filter values
  const statusDisplayMap: Record<string, StatusFilter> = {
    "All Listings": "All",
    "Active Listings": "Active",
    "Pending Inspection": "Pending Inspection",
    "Sold Out Listings": "Sold Out"
  };

  // Get display names in order
  const availableStatusDisplayNames = [
    "All Listings", 
    "Active Listings", 
    "Pending Inspection", 
    "Sold Out Listings"
  ];

  // Filter products based on active filter
  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter((product) => product.status === activeFilter);

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
  const StatusBadge: React.FC<{ status: Product["status"] }> = ({ status }) => {
    const getStatusStyles = () => {
      switch (status) {
        case "Active":
          return "bg-green-500 text-white";
        case "Pending Inspection":
          return "bg-yellow-500 text-white";
        case "Sold Out":
          return "bg-gray-500 text-white";
        default:
          return "bg-gray-400 text-white";
      }
    };

    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles()}`}
      >
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
      if (percentage >= 80) return "bg-green-500";
      if (percentage >= 60) return "bg-yellow-500";
      return "bg-orange-500";
    };

    return (
      <div className="w-full">
        <div className="flex justify-end items-center mb-1">
          <span className="text-xs text-gray-500">{status}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Inventory</span>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getBarColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Action Buttons Component
  const ActionButtons: React.FC<{
    productId: number;
    status: Product["status"];
  }> = ({ productId, status }) => {
    return (
      <div className="flex flex-col items-end justify-end space-y-2">
        {onEditListing && (
          <button
            onClick={() => onEditListing(productId)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="text-sm">Edit Listing</span>
          </button>
        )}

        {onSuspendListing && status === "Active" && (
          <button
            onClick={() => onSuspendListing(productId)}
            className="flex items-center space-x-2 text-yellow-600 hover:text-yellow-800 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">Suspend Listing</span>
          </button>
        )}

        {onCancelListing && status === "Pending Inspection" && (
          <button
            onClick={() => onCancelListing(productId)}
            className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="text-sm">Cancel Listing</span>
          </button>
        )}
      </div>
    );
  };

  // Individual Product Card Component
  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const productUrl = `/products/${product.slug || product.id}`;

    return (
      <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <Link href={productUrl} className="flex-shrink-0 self-start">
              <Image
                src={product.image}
                alt={product.name}
                width={64}
                height={64}
                className="rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
              />
            </Link>
            <div className="flex-1">
              <Link href={productUrl} className="block">
                <h3 className="font-medium text-gray-900 mb-1 hover:text-blue-600 transition-colors cursor-pointer">
                  {product.name}
                </h3>
              </Link>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  Quantity: {product.quantity} | {product.price}
                </p>
                <p>Certification: {product.certification}</p>

                {/* Inventory Progress Bar */}
                {product.inventoryStatus &&
                  product.inventoryPercentage !== undefined && (
                    <div className="mt-8 mr-12">
                      <InventoryBar
                        percentage={product.inventoryPercentage}
                        status={product.inventoryStatus}
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <StatusBadge status={product.status} />
            <p className="text-sm text-gray-600">
              Listed: {product.listedDate}
            </p>
            {/* Action Buttons */}
            <div className="flex justify-end mt-4">
              <ActionButtons productId={product.id} status={product.status} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Get display name for current filter (for the results summary)
  const getDisplayNameForFilter = (filter: StatusFilter) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const entry = Object.entries(statusDisplayMap).find(([_, value]) => value === filter);
    return entry ? entry[0] : filter;
  };

  return (
    <div className="w-full space-y-6">
      {/* Status Filter Buttons */}
      <div className="flex flex-wrap gap-3">
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

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
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
            className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8v.01M6 5v.01"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No products found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeFilter === "All"
                ? "No products available at the moment."
                : `No products with status "${getDisplayNameForFilter(activeFilter)}" found.`}
            </p>
            {activeFilter !== "All" && (
              <button
                onClick={() => setActiveFilter("All")}
                className="mt-3 text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                View all products
              </button>
            )}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {filteredProducts.length > 0 && filteredProducts.length >= 10 && (
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