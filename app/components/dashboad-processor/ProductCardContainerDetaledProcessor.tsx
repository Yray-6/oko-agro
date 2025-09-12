"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CreateNewRequestModal from "./CreateNewRequest";

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
  onRequestSuccess?: () => void; // Optional callback for request success
}

type StatusFilter = "All" | "Active" | "Pending Inspection" | "Sold Out";

const ProductCardContainerDetailedProcessor: React.FC<
  ProductCardContainerDetailedProps
> = ({ products, onRequestSuccess }) => {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState<string>("");

  // Map display names to filter values
  const statusDisplayMap: Record<string, StatusFilter> = {
    "All Listings": "All",
  };

  // Get display names in order
  const availableStatusDisplayNames = [
    "All Listings", 
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

  // Handle Quick Order button click
  const handleQuickOrder = (productName: string) => {
    setSelectedProductName(productName);
    setShowCreateRequestModal(true);
  };

  // Handle successful request submission
  const handleRequestSuccess = () => {
    setShowCreateRequestModal(false);
    setSelectedProductName("");
    // Call optional callback if provided
    if (onRequestSuccess) {
      onRequestSuccess();
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

  // Individual Product Card Component
  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const productUrl = `/products/${product.slug || product.id}`;

    return (
      <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between ">
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
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <StatusBadge status={product.status} />
            <p className="text-sm text-gray-600">
              Listed: {product.listedDate}
            </p>
            {/* Quick Order Button */}
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => handleQuickOrder(product.name)}
                className="border border-mainGreen rounded-lg px-6 py-2 text-sm text-mainGreen hover:bg-mainGreen hover:text-white transition-colors"
              >
                Quick Order
              </button>
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

      {/* Create New Request Modal */}
      <CreateNewRequestModal
        isOpen={showCreateRequestModal}
        onClose={() => setShowCreateRequestModal(false)}
        onSuccess={handleRequestSuccess}
        productName={selectedProductName}
      />
    </div>
  );
};

export default ProductCardContainerDetailedProcessor;