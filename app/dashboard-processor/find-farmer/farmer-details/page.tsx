"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  ArrowLeft,
  Loader2,
  Phone,
  Mail,
} from "lucide-react";
import { useProductStore } from "@/app/store/useProductStore";
import ProductCardContainerDetailedProcessor from "@/app/components/dashboad-processor/ProductCardContainerDetaledProcessor";
import CalendarViewProcessor from "@/app/components/dashboad-processor/CalendarViewProcessor";
import rice from "@/app/assets/images/rice.png";
import { UserProfile } from "@/app/types";
import AnimatedLoading from "@/app/Loading";
import { formatPrice } from "@/app/helpers";

export default function FarmerDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const farmerId = searchParams.get("farmerId");

  const { products, isFetching, fetchError, fetchUserProducts } = useProductStore();


  const productOwner = products[0]?.owner

  const [farmerDetails, setFarmerDetails] = useState<UserProfile | null>(null);
  const [isLoadingFarmer, setIsLoadingFarmer] = useState(true);

  // Fetch farmer details from the farmers list in store
  useEffect(() => {
    if (farmerId) {
      // Get farmer from the store's farmers list
      const { farmers } = useProductStore.getState();
      const farmer = farmers.find((f) => f.id === farmerId);
      
      if (farmer) {
        setFarmerDetails(farmer);
        setIsLoadingFarmer(false);
      } else {
        setIsLoadingFarmer(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch farmer's products
  useEffect(() => {
    if (farmerId) {
      fetchUserProducts(farmerId);
    }
  }, [farmerId, fetchUserProducts]);

  // Map products to the format expected by ProductCardContainer
  const mappedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    quantity: `${product.quantity} ${product.quantityUnit}`,
    price: formatPrice(product.pricePerUnit, product.priceCurrency, product.quantityUnit),
    certification: "Grade A",
    status: product.status || "Active",
    listedDate: new Date(product.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    image: product.photos?.[0]?.url || rice.src,
    inventoryStatus: `${product.quantity}/${product.quantity}${product.quantityUnit}`,
    inventoryPercentage: 100,
    slug: product.id,
  }));

  const handleBack = () => {
    router.back();
  };

  if (isLoadingFarmer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-mainGreen" />
      </div>
    );
  }

  // if (!farmerDetails) {
  //   return (
  //     <div className="p-6">
  //       <button
  //         onClick={handleBack}
  //         className="flex items-center gap-2 text-mainGreen hover:underline mb-4"
  //       >
  //         <ArrowLeft className="w-4 h-4" />
  //         Back
  //       </button>
  //       <div className="text-center py-12">
  //         <p className="text-gray-500">Farmer not found</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white ">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-mainGreen hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Farmers
          </button>

          <div className="flex items-start gap-6">
            {/* Farmer Profile Image */}
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
              <Image
                src={rice.src}
                alt={farmerDetails?.farmName || "Farmer"}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Farmer Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {farmerDetails?.farmName || `${farmerDetails?.firstName} ${farmerDetails?.lastName}`}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {farmerDetails?.firstName} {farmerDetails?.lastName}
                  </p>
                </div>

                <button className="px-6 py-2 bg-mainGreen text-white flex items-center gap-2 justify-center rounded-lg hover:bg-green-800 transition-colors">
                  Contact Farmer <Phone size={16}/>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-mainGreen" />
                  <span>
                    {farmerDetails?.state}, {farmerDetails?.country}
                  </span>
                  
                </div>
                

                {productOwner?.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-mainGreen" />
                    <span>{productOwner.phoneNumber}</span>
                  </div>
                )}

                {productOwner?.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-mainGreen" />
                    <span>{productOwner.email}</span>
                  </div>
                )}
              </div>

              {/* Crops */}
          
            </div>
          </div>
        </div>
      </div>

      {/* Additional Farmer Details */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Farmer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmerDetails?.farmAddress && (
              <div>
                <p className="text-sm text-gray-500">Farm Address</p>
                 <p className="text-gray-900 font-medium">
                      {farmerDetails.farmAddress}
                 </p>
           
              </div>
            )}

            {productOwner?.farmSize && (
              <div>
                <p className="text-sm text-gray-500">Farm Size</p>
                <p className="text-gray-900 font-medium">
                  {productOwner.farmSize} {productOwner.farmSizeUnit}
                </p>
              </div>
            )}

            {productOwner?.estimatedAnnualProduction && (
              <div>
                <p className="text-sm text-gray-500">Est. Annual Production</p>
                <p className="text-gray-900 font-medium">
                  {productOwner.estimatedAnnualProduction}
                </p>
              </div>
            )}

            {productOwner?.farmingExperience && (
              <div>
                <p className="text-sm text-gray-500">Farming Experience</p>
                <p className="text-gray-900 font-medium">{productOwner.farmingExperience}</p>
              </div>
            )}

            {productOwner?.internetAccess && (
              <div>
                <p className="text-sm text-gray-500">Internet Access</p>
                <p className="text-gray-900 font-medium">{productOwner.internetAccess}</p>
              </div>
            )}

            {productOwner?.howUserSellCrops && (
              <div>
                <p className="text-sm text-gray-500">Selling Method</p>
                <p className="text-gray-900 font-medium">{productOwner.howUserSellCrops}</p>
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Available Products</h2>
            <span className="text-sm text-gray-600">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>

          {isFetching ? (
            <div className="flex items-center justify-center py-12 bg-white rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-mainGreen" />
            </div>
          ) : fetchError ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {fetchError}
            </div>
          ) : mappedProducts.length > 0 ? (
            <ProductCardContainerDetailedProcessor products={mappedProducts} />
          ) : (
            <div className="bg-white rounded-lg p-12 text-center">
              <p className="text-gray-500">No products available at the moment</p>
            </div>
          )}
        </div>

        {/* Calendar View */}
        {mappedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Harvest Calendar</h2>
            <CalendarViewProcessor />
          </div>
        )}
      </div>
      {isFetching && <AnimatedLoading/>}
    </div>
  );
}