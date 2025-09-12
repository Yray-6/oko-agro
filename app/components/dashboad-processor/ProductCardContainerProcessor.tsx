'use client'
import { useState } from "react";
import ProductCard, { Product } from "./ProductCardProcessor";
import rice from '@/app/assets/images/rice.png'
import cassava from '@/app/assets/images/yam.png'
import maize from '@/app/assets/images/maize.png'
import potato from '@/app/assets/images/potato.png'

const ProductCardContainerProcessor: React.FC = () => {
  const [showAll, setShowAll] = useState<boolean>(false);

  // Sample data based on your images
  const products: Product[] = [
    {
      id: 1,
      name: "Long Grain Rice",
      quantity: "500kg",
      price: "₦1,000/kg",
      certification: "Grade A",
      status: "Active",
      listedDate: "08 Aug 2025",
      slug: "long-grain-rice",
      image: rice.src
    },
    {
      id: 2,
      name: "Premium Cassava",
      quantity: "500kg",
      price: "₦1,000/kg",
      certification: "N/A",
      status: "Pending Inspection",
      listedDate: "08 Aug 2025",
      slug: "premium-cassava",
      image: cassava.src
    },
    {
      id: 3,
      name: "Fresh Maize",
      quantity: "2 Tons",
      price: "₦800/kg",
      certification: "Grade A",
      status: "Sold Out",
      listedDate: "10 Jul 2025",
      slug: "fresh-maize",
      image: maize.src
    },
    {
      id: 4,
      name: "Sweet Potato Tubers",
      quantity: "800kg",
      price: "₦2,000/kg",
      certification: "Grade A",
      status: "Sold Out",
      listedDate: "10 Jul 2025",
      slug: "sweet-potato-tubers",
      image: potato.src
    },

  ];

  const displayedProducts: Product[] = showAll ? products : products.slice(0, 3);

  const handleToggleView = (): void => {
    setShowAll(!showAll);
  };

  return (
    <div >
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-medium">My Products</h1>
        
        <button
          onClick={handleToggleView}
          className="text-mainGreen underline font-medium transition-colors"
        >
          {showAll ? 'Show Less' : 'View all'}
        </button>
      </div>
      
      <div className="space-y-4">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      

    </div>
  );
};

export default ProductCardContainerProcessor;