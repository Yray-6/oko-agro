import React from 'react';

interface QualityProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  [key: string]: any;
}

const Quality: React.FC<QualityProps> = ({ 
  size = 21, 
  color = "#004829",
  strokeWidth = 1.26923,
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
        d="M9.15387 11.2693C9.15387 11.2693 9.57695 11.2693 10 12.1154C10 12.1154 11.3439 10 12.5385 9.57697" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M15.0769 10.8462C15.0769 13.1828 13.1827 15.077 10.8462 15.077C8.50957 15.077 6.61539 13.1828 6.61539 10.8462C6.61539 8.5096 8.50957 6.61542 10.8462 6.61542C13.1827 6.61542 15.0769 8.5096 15.0769 10.8462Z" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
      />
      <path 
        d="M18.4615 10.1551V7.69873C18.4615 6.31104 18.4615 5.61719 18.1196 5.1645C17.7777 4.71181 17.0046 4.49204 15.4583 4.0525C14.4019 3.7522 13.4706 3.39041 12.7266 3.06012C11.7121 2.60981 11.2049 2.38464 10.8462 2.38464C10.4874 2.38464 9.9802 2.60981 8.96576 3.06012C8.22172 3.39041 7.29048 3.75219 6.23405 4.0525C4.68779 4.49204 3.91465 4.71181 3.57271 5.1645C3.23077 5.61719 3.23077 6.31104 3.23077 7.69873V10.1551C3.23077 14.9149 7.51466 17.7707 9.65647 18.9011C10.1702 19.1722 10.427 19.3077 10.8462 19.3077C11.2653 19.3077 11.5222 19.1722 12.0359 18.9011C14.1776 17.7707 18.4615 14.9149 18.4615 10.1551Z" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Quality