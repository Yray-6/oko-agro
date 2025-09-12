import React from 'react';
import Link from 'next/link';

// Type for any React icon component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconComponent = React.ComponentType<any>;

interface LinkCardProps {
  title: string;
  icon: IconComponent;
  href: string;
  iconColor?: string;
  iconSize?: string;
  textColor?: string;
  textSize?: string;
  backgroundColor?: string;
  borderColor?: string;
  hoverEffect?: boolean;
  className?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

const LinkCard: React.FC<LinkCardProps> = ({
  title,
  icon: Icon,
  href,
  iconColor = "#0BA964",
  iconSize = "w-6 h-6",
  textColor,
  textSize = "text-sm",
  backgroundColor,
  borderColor ,
  hoverEffect = true,
  className = "",
  target = "_self"
}) => {
  const hoverClasses = hoverEffect 
    ? "hover:shadow-md hover:border-gray-300 hover:scale-105 transition-all duration-200" 
    : "";

  return (
    <Link href={href} target={target} className="inline-block">
      <div 
        className={`
          ${backgroundColor} 
          ${borderColor} 
          ${hoverClasses}
          p-4 bg-skyBlue rounded-2xl
          border border-gray-100
          cursor-pointer 
          flex flex-col items-center justify-center 
          text-center 
          min-h-[120px] 
          min-w-[160px]
          ${className}
        `}
      >
        {/* Icon */}
        <div className="mb-4">
          <Icon className={`${iconSize} ` } color={iconColor} />
        </div>
        
        {/* Title */}
        <h3 className={`${textColor} ${textSize} text-gray  leading-tight`}>
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default LinkCard;