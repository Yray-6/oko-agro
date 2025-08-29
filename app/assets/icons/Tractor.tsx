
import React from 'react';

const Tractor = ({ 
  size = 24, 
  color = "#004829", 
  className = "",
  ...props 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path 
        d="M6.5 21.5C8.98528 21.5 11 19.4853 11 17C11 14.5147 8.98528 12.5 6.5 12.5C4.01472 12.5 2 14.5147 2 17C2 19.4853 4.01472 21.5 6.5 21.5Z" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M19 21.5C20.6569 21.5 22 20.1569 22 18.5C22 16.8431 20.6569 15.5 19 15.5C17.3431 15.5 16 16.8431 16 18.5C16 20.1569 17.3431 21.5 19 21.5Z" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M2 10.9995C3.25349 10.0579 4.81159 9.5 6.5 9.5C10.6421 9.5 14 12.8579 14 17C14 17.096 13.9982 17.1915 13.9946 17.2866C13.9719 17.8913 13.9605 18.1937 14.1081 18.3469C14.2556 18.5 14.5282 18.5 15.0734 18.5H16" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M13 9.5L16.1057 10.0823C18.4466 10.5212 19.6171 10.7407 20.3085 11.5739C21 12.407 21 13.6047 21 16" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M20 12.5H19" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M13 13V10.0871C13 9.69778 12.9432 9.31056 12.8313 8.93768L11.5 3.5M4 9.5V3.5" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M3 3.5H13" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M18 10V8.5C18 7.39543 18.8954 6.5 20 6.5" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M7 9.5V3.5" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Tractor;