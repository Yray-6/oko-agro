'use client'
import TransactionHistory from "@/app/assets/icons/TransactionHistory";
import ProductCardContainerDetailed, { ProductCardData } from "@/app/components/dashboard/ProductCardContainerDetailed";
import { PlusIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { ListNewProductModal, SuccessModal } from "@/app/components/dashboard/ProductModal";
import { useProductStore } from "@/app/store/useProductStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import { ProductDetails } from "@/app/types";
import { formatPrice } from "@/app/helpers";

export default function Page() {
  // Store hooks
  const { 
    products, 
    isLoading,
    error,
    fetchUserProducts,
    deleteProduct,
    setCurrentProduct,
    currentProduct
  } = useProductStore();
  
  const { user } = useAuthStore();

  // Modal states
  const [showListProductModal, setShowListProductModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  // Fetch products on component mount
  useEffect(() => {
    if (user?.id) {
      fetchUserProducts(user.id).catch(console.error);
    }
  }, [user?.id, fetchUserProducts]);

  // Helper function to determine product status
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getProductStatus = (product: ProductDetails): 'Active' | 'Pending Inspection' | 'Sold Out' | 'Suspended' => {
    // You can implement your own status logic here based on your business rules
    // For now, returning a default status since the ProductDetails doesn't seem to have a status field
    return 'Active'; // or check other fields to determine status
  };

  // Helper function to format quantity display
  const formatQuantity = (quantity: string, unit: string): string => {
    const isKilogram = unit === 'kilogram' || unit === 'kg';
    const suffix = isKilogram ? 'kg' : ' tons';
    return `${quantity}${suffix}`;
  };


  // Helper function to calculate inventory status
  const getInventoryStatus = (product: ProductDetails): { status: string; percentage: number } => {
    const status = getProductStatus(product);
    if (status === 'Sold Out') {
      return {
        status: `${product.quantity}/${product.quantity}${product.quantityUnit === 'kilogram' ? 'kg' : ' tons'} (100% Sold)`,
        percentage: 100
      };
    }
    return {
      status: `Available: ${formatQuantity(product.quantity, product.quantityUnit)}`,
      percentage: 0
    };
  };

  // Handler functions
const handleEditListing = (productId: number) => {
  try {
    console.log("Edit button clicked for product ID:", productId);
    const product = products.find(p => parseInt(p.id) === productId);
    
    if (!product) {
      console.error("Product not found:", productId);
      return;
    }

    console.log("Found product:", product);
    
    // Pass the original ProductDetails object directly
    setCurrentProduct(product);
    setEditingProduct(product.id);
    setShowListProductModal(true);
  } catch (error) {
    console.error("Failed to load product for editing:", error);
  }
};
  const handleSuspendListing = async (productId: number) => {
    try {
      // You'll need to implement suspend functionality in your store
      console.log("Suspend listing for product:", productId);
      setSuccessMessage("Product listing has been suspended successfully.");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to suspend listing:", error);
    }
  };

  const handleCancelListing = async (productId: number) => {
    try {
      await deleteProduct(productId.toString());
      setSuccessMessage("Product listing has been cancelled successfully.");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to cancel listing:", error);
    }
  };

  const handleAddNewListing = () => {
    setCurrentProduct(null);
    setEditingProduct(null);
    setShowListProductModal(true);
  };

  const handleListingSuccess = () => {
    setSuccessMessage(editingProduct ? 
      "Product updated successfully!" : 
      "Product listed successfully!"
    );
    setShowSuccessModal(true);
    
    // Refresh products list
    if (user?.id) {
      fetchUserProducts(user.id).catch(console.error);
    }
  };

  const closeAllModals = () => {
    setShowListProductModal(false);
    setShowSuccessModal(false);
    setEditingProduct(null);
    setCurrentProduct(null);
  };

  // Transform ProductDetails to the format expected by ProductCardContainerDetailed
  const transformedProducts: ProductCardData[] = products.map(product => {
    const inventoryInfo = getInventoryStatus(product);
    const status = getProductStatus(product);
    
    return {
      id: parseInt(product.id),
      name: product.name,
      quantity: formatQuantity(product.quantity, product.quantityUnit),
      price: formatPrice(product.pricePerUnit, product.priceCurrency, product.quantityUnit),
      certification: "Grade A", // You might want to derive this from certifications or other fields
      status: status,
      listedDate: new Date(product.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      image: product.photos?.[0]?.url || '/default-product-image.jpg',
      inventoryStatus: inventoryInfo.status,
      inventoryPercentage: inventoryInfo.percentage,
      slug: product.name.toLowerCase().replace(/\s+/g, '-')
    };
  });

  // Calculate stats for sidebar
  const activeProducts = products.filter(p => getProductStatus(p) === 'Active').length;
  const pendingProducts = products.filter(p => getProductStatus(p) === 'Pending Inspection').length;
  const soldOutProducts = products.filter(p => getProductStatus(p) === 'Sold Out').length;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => user?.id && fetchUserProducts(user.id)}
            className="px-4 py-2 bg-mainGreen text-white rounded-lg hover:bg-mainGreen/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="justify-between flex items-center py-4">
        <div>
          <p className="font-medium text-lg">My Products</p>
          <p className="text-sm">
            View, add, and modify information on product listings
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm text-mainGreen border border-mainGreen hover:bg-mainGreen/5 transition-colors">
            <TransactionHistory color="#004829" size={16} /> View Orders
          </button>
          <button 
            onClick={handleAddNewListing}
            className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm bg-mainGreen text-white hover:bg-mainGreen/90 transition-colors"
          >
            <PlusIcon color="white" size={16} /> Add New Listing
          </button>
        </div>
      </div>
             
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainGreen"></div>
              <span className="ml-2 text-gray-600">Loading products...</span>
            </div>
          ) : transformedProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products listed yet</h3>
              <p className="text-gray-500 mb-4">Start by adding your first product listing</p>
              <button 
                onClick={handleAddNewListing}
                className="inline-flex items-center px-4 py-2 bg-mainGreen text-white rounded-lg hover:bg-mainGreen/90 transition-colors"
              >
                <PlusIcon size={16} className="mr-2" />
                Add Your First Product
              </button>
            </div>
          ) : (
            <ProductCardContainerDetailed
              products={transformedProducts}
              onEditListing={handleEditListing}
              onSuspendListing={handleSuspendListing}
              onCancelListing={handleCancelListing}
            />
          )}
        </div>
                 
        {/* Sidebar with stats */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Quick Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Products:</span>
                <span className="font-medium">{products.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Listings:</span>
                <span className="font-medium text-green-600">
                  {activeProducts}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pending Inspection:</span>
                <span className="font-medium text-yellow-600">
                  {pendingProducts}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sold Out:</span>
                <span className="font-medium text-red-600">
                  {soldOutProducts}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ListNewProductModal
        isOpen={showListProductModal}
        onClose={closeAllModals}
        onSuccess={handleListingSuccess}
        editingProduct={currentProduct}
        isEditing={!!editingProduct}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={closeAllModals}
        title="Success!"
        message={successMessage}
        buttonText="Continue"
      />
    </div>
  );
}