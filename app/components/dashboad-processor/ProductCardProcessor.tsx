
import Link from 'next/link';

export interface Product {
  id: number;
  name: string;
  quantity: string;
  price: string;
  certification: string;
  status: 'pending' | 'accepted' | 'awaiting_shipping' | 'in_transit' | 'delivered' | 'completed' | 'Active' | 'Pending Inspection' | 'Sold Out' | 'rejected';
  listedDate: string;
  image: string;
  slug?: string;
  requestNumber?: number | string;
  deliveryLocation?: string;
  description?: string;
  originalStatus?: string;
  orderState?: string;
}

interface ProductCardProps {
  product: Product;
}

interface StatusBadgeProps {
  status: Product['status'];
  originalStatus?: string;
  orderState?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, originalStatus, orderState }) => {
  const getStatusStyles = (displayValue: string, currentStatus: Product['status']) => {
    const displayLower = displayValue.toLowerCase();
    
    // Check for rejected status first (highest priority)
    if (currentStatus === 'rejected' || displayLower.includes('rejected') || originalStatus?.toLowerCase() === 'rejected') {
      return 'bg-red-500 text-white';
    }
    
    // For orderState values (only if not rejected)
    if (displayLower.includes('awaiting_shipping') || displayLower.includes('awaiting shipping')) {
      return 'bg-blue-500 text-white';
    }
    if (displayLower.includes('in_transit') || displayLower.includes('in transit')) {
      return 'bg-purple-500 text-white';
    }
    if (displayLower.includes('delivered')) {
      return 'bg-green-600 text-white';
    }
    if (displayLower.includes('completed')) {
      return 'bg-green-700 text-white';
    }
    
    // For status values
    const normalizedStatus = currentStatus.toLowerCase();
    switch (normalizedStatus) {
      case 'active':
      case 'accepted':
        return 'bg-green-500 text-white';
      case 'pending':
      case 'pending inspection':
        return 'bg-yellow-500 text-white';
      case 'completed':
      case 'sold out':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'rejected':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getStatusDisplay = (): string => {
    // If orderState is "completed", show "Completed"
    const isCompleted = orderState?.toLowerCase() === 'completed' || status === 'completed';
    const isRejected = status === 'rejected' || originalStatus?.toLowerCase() === 'rejected';
    
    if (isRejected) {
      return 'Rejected';
    }
    
    if (isCompleted) {
      return 'Completed';
    }
    
    // Display orderState if order is accepted/active and orderState exists
    if ((status === 'accepted' || originalStatus === 'accepted') && orderState) {
      return orderState.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    const statusMap: Record<string, string> = {
      'pending': 'Pending',
      'accepted': 'Accepted',
      'awaiting_shipping': 'Awaiting Shipping',
      'in_transit': 'In Transit',
      'delivered': 'Delivered',
      'completed': 'Completed',
      'active': 'Active',
      'pending inspection': 'Pending Inspection',
      'sold out': 'Sold Out',
      'rejected': 'Rejected',
    };
    
    return statusMap[originalStatus?.toLowerCase() || status.toLowerCase()] || status;
  };

  const displayStatus = getStatusDisplay();

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(displayStatus, status)}`}>
      {displayStatus}
    </span>
  );
};

const ProductCardProcessor: React.FC<ProductCardProps> = ({ product }) => {
  const productUrl = `/dashboard-processor/requests/${product.slug || product.id}`;

  return (
    <div className="flex items-start justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4 flex-1">
        <Link href={productUrl} className="flex-shrink-0">
          {/* <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            {product.image ? (
              <Image 
                src={product.image} 
                alt={product.name}
                width={64}
                height={64}
                className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
              />
            ) : (
              <div className="text-gray-400 text-xs text-center px-2">
                {product.name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div> */}
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={productUrl} className="block">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer truncate">
                {product.name}
              </h3>
              {product.requestNumber && (
                <span className="text-xs text-gray-500 flex-shrink-0">
                  #{product.requestNumber}
                </span>
              )}
            </div>
          </Link>
          <div className="text-sm text-black space-y-1">
            <p className="truncate">
              <span className="font-medium">Quantity:</span> {product.quantity} | {product.price}
            </p>
            <p className="truncate">
              <span className="font-medium">Quality:</span> {product.certification}
            </p>
            {product.deliveryLocation && (
              <p className="truncate text-gray-600">
                <span className="font-medium text-black">Location:</span> {product.deliveryLocation}
              </p>
            )}
            <p className="text-sm text-black mt-2">
              <span className="text-gray-500">Expected Delivery:</span> {product.listedDate}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between ml-4 flex-shrink-0">
        <StatusBadge status={product.status} originalStatus={product.originalStatus} orderState={product.orderState} />
      </div>
    </div>
  );
};

export default ProductCardProcessor;