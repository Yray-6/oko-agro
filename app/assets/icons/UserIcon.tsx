import React from 'react';

interface UserIconProps {
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const UserIcon: React.FC<UserIconProps> = ({ 
  size = 19, 
  strokeColor = "#141B34",
  strokeWidth = 1.5,
  className = "",
  ...props 
}) => {

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path 
        d="M5.54159 6.72933C5.54159 4.54321 7.31381 2.771 9.49992 2.771C11.686 2.771 13.4583 4.54321 13.4583 6.72933C13.4583 8.91544 11.686 10.6877 9.49992 10.6877C7.31381 10.6877 5.54159 8.91544 5.54159 6.72933Z" 
        stroke={strokeColor} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M3.95842 16.2292C3.95842 13.1686 6.4395 10.6875 9.50008 10.6875C12.5607 10.6875 15.0417 13.1686 15.0417 16.2292" 
        stroke={strokeColor} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default UserIcon;