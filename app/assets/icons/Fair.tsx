import React from 'react';

interface FairProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const Fair: React.FC<FairProps> = ({ 
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
        d="M14.6037 18.7558L15.0709 18.1718C15.4815 17.6586 16.3534 17.7 16.7002 18.249C17.1173 18.9096 18.1478 18.7782 18.4335 18.1706C18.4484 18.1391 18.4112 18.2181 18.443 17.9447C18.4747 17.6713 18.4615 17.6089 18.4351 17.4841L16.8078 9.80039C16.3989 7.86934 16.1944 6.9038 15.491 6.33651C14.7876 5.76923 13.7948 5.76923 11.8094 5.76923H9.8829C7.89746 5.76923 6.90472 5.76923 6.20133 6.33651C5.49793 6.9038 5.29345 7.86934 4.88449 9.80039L3.25726 17.4841C3.23081 17.6089 3.21758 17.6713 3.24934 17.9447C3.28109 18.2181 3.24392 18.1391 3.25878 18.1706C3.54456 18.7782 4.57494 18.9096 4.99217 18.249C5.33898 17.7 6.21082 17.6586 6.62139 18.1718L7.08868 18.7558C7.67743 19.4916 8.90694 19.4916 9.4957 18.7558L9.56914 18.6639C10.1939 17.8832 11.4985 17.8832 12.1232 18.6639L12.1966 18.7558C12.7854 19.4916 14.0149 19.4916 14.6037 18.7558Z" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinejoin="round"
      />
      <path 
        d="M2.79364 8.7308C2.29838 8.21633 2.39162 7.55374 2.39162 5.89767C2.39162 4.24161 2.39162 3.41358 2.88688 2.89911C3.38214 2.38464 4.17925 2.38464 5.77347 2.38464H15.919C17.5132 2.38464 18.3104 2.38464 18.8056 2.89911C19.3009 3.41358 19.3009 4.24161 19.3009 5.89767C19.3009 7.55374 19.3935 8.21633 18.8983 8.7308" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
      />
      <path 
        d="M10.8461 9.15387H8.30768" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12.5385 12.5385H7.46155" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Fair;