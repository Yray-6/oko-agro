import React from 'react';

interface DotProps {
  size?: number;
  outerColor?: string;
  innerColor?: string;
  className?: string;
  [key: string]: any;
}

const Dot: React.FC<DotProps> = ({ 
  size = 20, 
  outerColor = "#004829",
  innerColor = "white",
  className = "",
  ...props 
}) => {
  const center = size / 2;
  const outerRadius = size / 2;
  const innerRadius = (size / 2) * 0.675676; // Maintains the original proportion

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <circle 
        cx={center} 
        cy={center} 
        r={outerRadius} 
        fill={outerColor}
      />
      <circle 
        cx={center} 
        cy={center} 
        r={innerRadius} 
        fill={innerColor}
      />
    </svg>
  );
};

export default Dot