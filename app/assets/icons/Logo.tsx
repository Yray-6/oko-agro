import React from 'react';

interface LogoProps {
  size?: number;
  color?: string;
  className?: string;
  fillColor?: string;
  circleColor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 30, 
  color = "white",
  fillColor,
  circleColor = "#1A5043",
  className = "",
  ...props 
}) => {
  const actualFillColor = fillColor || color;
  const height = (size * 41) / 30; // Maintain aspect ratio

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 30 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path 
        d="M20.063 12.907C20.063 16.1393 17.0999 21.895 15.1958 21.895C13.2918 21.895 10.5315 16.1393 10.5315 12.907C10.5315 9.67462 13.2918 2.03772 15.1958 2.03772C17.0999 2.03772 20.063 9.67462 20.063 12.907Z" 
        fill={actualFillColor}
      />
      <path 
        d="M7.49455 13.5829C-7.66593 14.4449 10.551 20.5818 11.1275 27.6929" 
        stroke={color} 
        strokeWidth="1.58858" 
        strokeLinecap="round"
      />
      <path 
        d="M7.49455 17.3955C-7.66593 18.2575 10.551 24.3944 11.1275 31.5056" 
        stroke={color} 
        strokeWidth="1.58858" 
        strokeLinecap="round"
      />
      <path 
        d="M22.2911 13.6608C37.4516 14.5228 19.2346 20.6597 18.6582 27.7709" 
        stroke={color} 
        strokeWidth="1.58858" 
        strokeLinecap="round"
      />
      <path 
        d="M22.2911 17.4735C37.4516 18.3354 19.2346 24.4723 18.6582 31.5835" 
        stroke={color} 
        strokeWidth="1.58858" 
        strokeLinecap="round"
      />
      <path 
        d="M15.5572 0C18.9759 4.98583 20.8831 8.89781 20.9234 12.6162C20.9641 16.3819 19.0945 19.758 15.4859 23.6729L15.1402 23.3535L14.7945 23.6729C11.1858 19.7579 9.31626 16.3819 9.35697 12.6162C9.39727 8.89776 11.3043 4.98593 14.7232 0L15.1402 0.285156L15.5572 0ZM15.1392 2.23535C12.3428 6.51374 10.9764 9.72279 10.9449 12.6338C10.9136 15.5335 12.2109 18.2923 15.1392 21.6719C18.068 18.292 19.3668 15.5337 19.3355 12.6338C19.304 9.72263 17.9359 6.51408 15.1392 2.23535Z" 
        fill={actualFillColor}
      />
      <circle 
        cx="14.5029" 
        cy="32.2207" 
        r="7.14932" 
        fill={circleColor} 
        stroke={color} 
        strokeWidth="1.59"
      />
    </svg>
  );
};

export default Logo