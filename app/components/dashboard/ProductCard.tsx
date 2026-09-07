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
    <span
      className={`inline-flex items-center justify-center px-3 py-0.5 text-sm font-normal rounded-xl ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="flex items-start justify-between p-4 bg-white rounded-xl shadow-[0px_0px_2.35px_0px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Image
          src={product.image}
          alt={product.name}
          loader={imageLoader}
          width={64}
          height={64}
          className="rounded-[7px] object-cover shrink-0"
        />

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-black mb-1 truncate">
            {product.name}
          </h3>
          <div className="text-base font-light text-black space-y-1">
            <p>
              Quantity: {product.quantity} <span className="mx-1">|</span> {product.price}
            </p>
            <p>Certification: {product.certification}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-6 shrink-0 ml-4">
        <StatusBadge status={product.status} />
        <p className="text-base font-light text-black whitespace-nowrap">
          Listed: {product.listedDate}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;