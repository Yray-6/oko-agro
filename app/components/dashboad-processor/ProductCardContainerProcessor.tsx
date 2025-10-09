'use client'
import { useState } from "react";
import ProductCardProcessor from "./ProductCardProcessor";
import { useBuyRequestStore } from "@/app/store/useRequestStore";
import { BuyRequest } from "@/app/types";

const ProductCardContainerProcessor: React.FC = () => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const { myRequests } = useBuyRequestStore();

  // Convert BuyRequest to Product format for ProductCard
  const convertToProduct = (request: BuyRequest) => {
    // Get crop type image (you might want to create a mapping for this)
    const getCropImage = (cropName: string) => {
      // This is a placeholder - you should import actual images
      const imageMap: Record<string, string> = {
        'rice': '/assets/images/rice.png',
        'cassava': '/assets/images/cassava.png',
        'maize': '/assets/images/maize.png',
        'potato': '/assets/images/potato.png',
        // Add more mappings as needed
      };
      
      const cropLower = cropName.toLowerCase();
      for (const key in imageMap) {
        if (cropLower.includes(key)) {
          return imageMap[key];
        }
      }
      return '/assets/images/default-crop.png'; // fallback image
    };

    // Map status to display format
    const getStatusDisplay = (status: string): 'Active' | 'Pending Inspection' | 'Sold Out' => {
      const statusMap: Record<string, 'Active' | 'Pending Inspection' | 'Sold Out'> = {
        'pending': 'Active',
        'accepted': 'Pending Inspection',
        'completed': 'Sold Out',
        'rejected': 'Sold Out',
        'cancelled': 'Sold Out',
      };
      return statusMap[status.toLowerCase()] || 'Active';
    };

    return {
      id: parseInt(request.id) || 0,
      name: request.cropType?.name || 'Unknown Crop',
      quantity: `${request.productQuantity} ${request.productQuantityUnit}`,
      price: `₦${parseFloat(request.pricePerUnitOffer || '0').toLocaleString()}/${request.productQuantityUnit}`,
      certification: request.qualityStandardType?.name || 'N/A',
      status: getStatusDisplay(request.status),
      listedDate: new Date(request.estimatedDeliveryDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      slug: `buy-request-${request.id}`,
      image: getCropImage(request.cropType?.name || ''),
      requestNumber: request.requestNumber,
      deliveryLocation: request.deliveryLocation,
      description: request.description,
    };
  };

  const products = myRequests.map(convertToProduct);
  const displayedProducts = showAll ? products : products.slice(0, 3);

  const handleToggleView = (): void => {
    setShowAll(!showAll);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-medium">
          Recent Requests 
          {products.length > 0 && (
            <span className="ml-2 text-gray-500 text-sm">
              ({products.length} total)
            </span>
          )}
        </h1>
        
        {products.length > 3 && (
          <button
            onClick={handleToggleView}
            className="text-mainGreen underline font-medium cursor-pointer transition-colors hover:text-mainGreen/80"
          >
            {showAll ? 'Show Less' : 'View all'}
          </button>
        )}
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg mb-2">No buy requests yet</p>
          <p className="text-gray-400 text-sm">Click &quot;New Request&quot; to create your first buy request</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedProducts.map((product) => (
            <ProductCardProcessor key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCardContainerProcessor;