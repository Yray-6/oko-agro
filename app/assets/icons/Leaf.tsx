import React from 'react';

interface LeafProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const Leaf: React.FC<LeafProps> = ({ 
  size = 24, 
  color = "white",
  strokeWidth = 1.5,
  className = "",
  ...props 
}) => {
  const height = (size * 25) / 24; // Maintain aspect ratio

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path 
        d="M7.64584 16.2108C7.23279 15.3966 7 14.4755 7 13.5C7 10.2848 9.5 8 13 7.5C17.0817 6.9169 18.8333 4.66667 20 3.5C23.5 16.5 17 19.5 13 19.5C11.9071 19.5 10.8825 19.2078 10 18.6973" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M3 21.5C3.5 18.5 5.45791 16.6355 10 15.5C13.2167 14.6958 15.4634 12.6791 17 10.5549" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
      />
    </svg>
  );
};


export default Leaf