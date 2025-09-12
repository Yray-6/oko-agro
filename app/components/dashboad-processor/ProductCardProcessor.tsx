
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
        return 'bg-green text-white';
      case 'Pending Inspection':
        return 'bg-yellow text-white';
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
  const productUrl = `/products/${product.slug || product.id}`;

  return (
    <div className="flex items-start justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
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
          <div className="text-sm black space-y-1">
            <p>Quantity: {product.quantity} | {product.price}</p>
            <p>Certification: {product.certification}</p>
             <p className="text-sm text-black mt-2"> <span className='text-gray-500'>Expected Delivery Date:</span>  {product.listedDate}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between space-y-6">
        <StatusBadge status={product.status} />
       
      </div>
    </div>
  );
};

export default ProductCardProcessor;