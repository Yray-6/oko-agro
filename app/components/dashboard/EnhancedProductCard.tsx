'use client'
import Image from 'next/image';
import Link from 'next/link';

export interface Product {
  id: number;
  name: string;
  quantity: string;
  price: string;
  certification: string;
  status: 'Active' | 'Pending Inspection' | 'Sold Out';
  listedDate: string;
  image: string;
  slug?: string;
  inventoryStatus?: string; // e.g., "200/500kg (60% Sold)" or "500/500kg (100% Sold)" or "Unlisted"
  inventoryPercentage?: number; // 0-100
}

interface ProductCardProps {
  product: Product;
  onEditListing?: (productId: number) => void;
  onSuspendListing?: (productId: number) => void;
  onCancelListing?: (productId: number) => void;
}

interface StatusBadgeProps {
  status: Product['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Active':
        return 'bg-green-500 text-white';
      case 'Pending Inspection':
        return 'bg-yellow-500 text-white';
      case 'Sold Out':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

const InventoryBar: React.FC<{ percentage: number; status: string }> = ({ percentage, status }) => {
  const getBarColor = () => {
    if (percentage >= 100) return 'bg-gray-400';
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">Inventory</span>
        <span className="text-xs text-gray-500">{status}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${getBarColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

const ActionButtons: React.FC<{
  productId: number;
  status: Product['status'];
  onEditListing?: (productId: number) => void;
  onSuspendListing?: (productId: number) => void;
  onCancelListing?: (productId: number) => void;
}> = ({ productId, status, onEditListing, onSuspendListing, onCancelListing }) => {
  return (
    <div className="flex flex-col space-y-2">
      {onEditListing && (
        <button
          onClick={() => onEditListing(productId)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-sm">Edit Listing</span>
        </button>
      )}
      
      {onSuspendListing && status === 'Active' && (
        <button
          onClick={() => onSuspendListing(productId)}
          className="flex items-center space-x-2 text-orange-600 hover:text-orange-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round"  strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">Suspend Listing</span>
        </button>
      )}
      
      {onCancelListing && status === 'Pending Inspection' && (
        <button
          onClick={() => onCancelListing(productId)}
          className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round"  strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-sm">Cancel Listing</span>
        </button>
      )}
    </div>
  );
};

const EnhancedProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onEditListing, 
  onSuspendListing, 
  onCancelListing 
}) => {
  const productUrl = `/products/${product.slug || product.id}`;

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4 flex-1">
          <Link href={productUrl} className="flex-shrink-0">
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
              <p>Quantity: {product.quantity} | {product.price}</p>
              <p>Certification: {product.certification}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <StatusBadge status={product.status} />
          <p className="text-sm text-gray-600">Listed: {product.listedDate}</p>
        </div>
      </div>

      {/* Inventory Progress Bar */}
      {product.inventoryStatus && product.inventoryPercentage !== undefined && (
        <div className="mb-4">
          <InventoryBar 
            percentage={product.inventoryPercentage} 
            status={product.inventoryStatus}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end">
        <ActionButtons
          productId={product.id}
          status={product.status}
          onEditListing={onEditListing}
          onSuspendListing={onSuspendListing}
          onCancelListing={onCancelListing}
        />
      </div>
    </div>
  );
};

export default EnhancedProductCard;