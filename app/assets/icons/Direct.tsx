import React from 'react';

interface DirectProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  [key: string]: any;
}

const Direct: React.FC<DirectProps> = ({ 
  size = 21, 
  color = "#004829",
  strokeWidth = 1.5,
  className = "",
  ...props 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path 
        d="M10 4.9231H15.9231" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M9.15384 9.15387L12.9615 12.9616" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M4.92308 10V15.9231" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M6.14529 9.906C8.22226 9.906 9.90597 8.22229 9.90597 6.14532C9.90597 4.06836 8.22226 2.38464 6.14529 2.38464C4.06833 2.38464 2.38461 4.06836 2.38461 6.14532C2.38461 8.22229 4.06833 9.906 6.14529 9.906Z" 
        stroke={color} 
        strokeWidth={strokeWidth}
      />
      <path 
        d="M4.92307 19.3077C5.85771 19.3077 6.61538 18.55 6.61538 17.6154C6.61538 16.6808 5.85771 15.9231 4.92307 15.9231C3.98844 15.9231 3.23077 16.6808 3.23077 17.6154C3.23077 18.55 3.98844 19.3077 4.92307 19.3077Z" 
        stroke={color} 
        strokeWidth={strokeWidth}
      />
      <path 
        d="M14.2308 15.9231C15.1654 15.9231 15.9231 15.1654 15.9231 14.2308C15.9231 13.2961 15.1654 12.5385 14.2308 12.5385C13.2961 12.5385 12.5385 13.2961 12.5385 14.2308C12.5385 15.1654 13.2961 15.9231 14.2308 15.9231Z" 
        stroke={color} 
        strokeWidth={strokeWidth}
      />
      <path 
        d="M17.6154 6.61539C18.55 6.61539 19.3077 5.85772 19.3077 4.92308C19.3077 3.98845 18.55 3.23077 17.6154 3.23077C16.6808 3.23077 15.9231 3.98845 15.9231 4.92308C15.9231 5.85772 16.6808 6.61539 17.6154 6.61539Z" 
        stroke={color} 
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default Direct