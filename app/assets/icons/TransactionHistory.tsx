import React from 'react';

interface TransactionHistoryProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  size = 24,
  color = "#141B34",
  strokeWidth = 1.5,
  className = "",
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M18.9999 10.5V9.99995C18.9999 6.22876 18.9998 4.34311 17.8283 3.17154C16.6567 2 14.7711 2 10.9999 2C7.22883 2 5.3432 2.00006 4.17163 3.17159C3.00009 4.34315 3.00007 6.22872 3.00004 9.99988L3 14.5C2.99997 17.7874 2.99996 19.4312 3.90788 20.5375C4.07412 20.7401 4.25986 20.9258 4.46243 21.0921C5.56877 22 7.21249 22 10.4999 22"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 7H15M7 11H11"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 18.5L16.5 17.95V15.5M12 17.5C12 19.9853 14.0147 22 16.5 22C18.9853 22 21 19.9853 21 17.5C21 15.0147 18.9853 13 16.5 13C14.0147 13 12 15.0147 12 17.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TransactionHistory;