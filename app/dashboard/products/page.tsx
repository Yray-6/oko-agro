'use client'
import TransactionHistory from "@/app/assets/icons/TransactionHistory";
import ProductCardContainerDetailed, { ProductCardData } from "@/app/components/dashboard/ProductCardContainerDetailed";
import { PlusIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { ListNewProductModal, SuccessModal } from "@/app/components/dashboard/ProductModal";
import ConfirmationModal from "@/app/components/dashboard/ConfirmationModal";
import { useProductStore } from "@/app/store/useProductStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import { ProductDetails } from "@/app/types";
import { formatPrice } from "@/app/helpers";
import AnimatedLoading from "@/app/Loading";

export default function Page() {
  // Store hooks
  const { 
    products, 
    isLoading,
    isFetching,
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
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    if (user?.id) {
      fetchUserProducts(user.id).catch(console.error);
    }
  }, [user?.id, fetchUserProducts]);

  // Helper function to determine product status
  const getProductStatus = (product: ProductDetails): 'Active' | 'Pending Inspection' | 'Sold Out' | 'Suspended' => {
    // Map approvalStatus from API to display status
    const approvalStatus = product.approvalStatus?.toLowerCase();
    
    if (approvalStatus === 'pending') {
      return 'Pending Inspection';
    }
    if (approvalStatus === 'approved') {
      return 'Active';
    }
    if (approvalStatus === 'rejected') {
      return 'Sold Out';
    }
    
    // Fallback: check status field if approvalStatus is not available
    if (product.status === 'Pending Inspection' || product.status === 'Sold Out' || product.status === 'Suspended') {
      return product.status as 'Active' | 'Pending Inspection' | 'Sold Out' | 'Suspended';
    }
    
    // Default to Active if no status is found
    return 'Active';
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
const handleEditListing = (productId: string) => {
  try {
    console.log("Edit button clicked for product ID:", productId);
    const product = products.find(p => p.id === productId); // Direct string comparison
    
    if (!product) {
      console.error("Product not found:", productId);
      return;
    }

    console.log("Found product:", product);
    setCurrentProduct(product);
    setEditingProduct(product.id);
    setShowListProductModal(true);
  } catch (error) {
    console.error("Failed to load product for editing:", error);
  }
};
  const handleDeleteListing = (productId: string) => {
    setDeleteProductId(productId);
  };

  const confirmDelete = async () => {
    if (!deleteProductId) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteProductId);
      setDeleteProductId(null);
      setSuccessMessage("Product has been deleted successfully.");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to delete listing:", error);
    } finally {
      setIsDeleting(false);
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
      id: product.id,
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
            className="flex gap-2 items-center px-4 py-2 rounded-lg text-sm bg-mainGreen cursor-pointer text-white hover:bg-mainGreen/90 transition-colors"
          >
            <PlusIcon color="white" size={16} /> Add New Listing
          </button>
        </div>
      </div>
             
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9">
          {isLoading || isFetching ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainGreen"></div>
              <span className="ml-2 text-gray-600">Loading products...</span>
            </div>
          ) : products && transformedProducts.length === 0 ? (
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
              onDeleteListing={handleDeleteListing}
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

      <ConfirmationModal
        isOpen={!!deleteProductId}
        onClose={() => setDeleteProductId(null)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />{isFetching && <AnimatedLoading/>}
    </div>
  );
}