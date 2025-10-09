
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
  requestNumber?: number | string;
  deliveryLocation?: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
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
        <StatusBadge status={product.status} />
      </div>
    </div>
  );
};

export default ProductCardProcessor;