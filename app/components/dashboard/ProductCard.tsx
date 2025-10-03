
import { imageLoader } from '@/app/helpers';
import Image from 'next/image';


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

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {


  return (
    <div className="flex items-start justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4 flex-1">

          <Image 
            src={product.image} 
            alt={product.name}
            loader={imageLoader}
            width={64}
            height={64}
            className="rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
          />
       
        <div className="flex-1">
       
            <h3 className="font-medium text-gray-900 mb-1 hover:text-blue-600 transition-colors cursor-pointer">
              {product.name}
            </h3>
         
          <div className="text-sm black space-y-1">
            <p>Quantity: {product.quantity} | {product.price}</p>
            <p>Certification: {product.certification}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between space-y-6">
        <StatusBadge status={product.status} />
        <p className="text-sm text-black">Listed: {product.listedDate}</p>
      </div>
    </div>
  );
};

export default ProductCard;