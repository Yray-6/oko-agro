'use client'
import { useState, useEffect } from "react";
import ProductCard, { Product } from "./ProductCard";
import { useProductStore } from "@/app/store/useProductStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import { formatPrice } from "@/app/helpers";

const ProductCardContainer: React.FC = () => {
  const [showAll, setShowAll] = useState<boolean>(false);
  
  // Store hooks
  const { products, isLoading, error, fetchUserProducts } = useProductStore();
  const { user } = useAuthStore();

  // Fetch products on component mount
  useEffect(() => {
    if (user?.id) {
      fetchUserProducts(user.id).catch(console.error);
    }
  }, [user?.id, fetchUserProducts]);

  // Helper function to format quantity display
  const formatQuantity = (quantity: string, unit: string): string => {
    const isKilogram = unit === 'kilogram' || unit === 'kg';
    const suffix = isKilogram ? 'kg' : ' Tons';
    return `${quantity}${suffix}`;
  };

  // Helper function to format price display


  // Helper function to determine product status
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getProductStatus = (product: any): 'Active' | 'Pending Inspection' | 'Sold Out' => {
    // Use the product's status field if available, otherwise default to Active
    if (product.status === 'Pending Inspection' || product.status === 'Sold Out') {
      return product.status;
    }
    return 'Active';
  };

  // Transform ProductDetails to Product format for the card
  const transformedProducts: Product[] = products.map(product => ({
    id: parseInt(product.id),
    name: product.name,
    quantity: formatQuantity(product.quantity, product.quantityUnit),
    price: formatPrice(product.pricePerUnit, product.priceCurrency, product.quantityUnit),
    certification: "Grade A", // You can derive this from certifications if available
    status: getProductStatus(product),
    listedDate: new Date(product.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    image: product.photos?.[0]?.url || '/default-product-image.jpg',
    slug: product.name.toLowerCase().replace(/\s+/g, '-')
  }));

  const displayedProducts: Product[] = showAll ? transformedProducts : transformedProducts.slice(0, 3);

  const handleToggleView = (): void => {
    setShowAll(!showAll);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainGreen"></div>
        <span className="ml-2 text-gray-600">Loading products...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => user?.id && fetchUserProducts(user.id)}
          className="px-4 py-2 bg-mainGreen text-white rounded-lg hover:bg-mainGreen/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (transformedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-2">No products listed yet</p>
        <p className="text-sm text-gray-500">Your products will appear here once you list them</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-medium">My Products</h1>
        
        {transformedProducts.length > 3 && (
          <button
            onClick={handleToggleView}
            className="text-mainGreen underline font-medium transition-colors"
          >
            {showAll ? 'Show Less' : 'View all'}
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCardContainer;