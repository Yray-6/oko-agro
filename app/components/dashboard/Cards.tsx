import React from 'react';

// Type for any React icon component (Lucide, custom SVGs, etc.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconComponent = React.ComponentType<any>;

interface CardProps {
  title?: string;
  value?: string | number;
  subtitle?: string;
  subtitleColor?: string;
  icon?: IconComponent;
  iconColor?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ 
  title = "Active Listings", 
  value = "9", 
  subtitle = "Inventory: 70% left",
  subtitleColor = "text-gray-500",
  icon: Icon,
  iconColor = "text-blue-500",
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm  duration-200 ${className}`}>
      {/* Header with title and icon */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs text-black">{title}</h3>
        {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
      </div>
      
      {/* Main value */}
      <div className="mb-2">
        <span className="text-2xl font-medium  text-gray">{value}</span>
      </div>
      
      {/* Subtitle with customizable color */}
      <div className={`text-xs ${subtitleColor}`}>
        {subtitle}
      </div>
    </div>
  );
};

export default Card;