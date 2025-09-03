import React from 'react';

interface FindProcessorProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const FindProcessor: React.FC<FindProcessorProps> = ({
  size = 24,
  color = "#0BA964",
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
        d="M15.5 15L17.5 17M16.5 11.5C16.5 9.01472 14.4853 7 12 7C9.51472 7 7.5 9.01472 7.5 11.5C7.5 13.9853 9.51472 16 12 16C14.4853 16 16.5 13.9853 16.5 11.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 21.5C16.8623 21.5 17.7935 21.5 18.5391 21.2286C19.789 20.7737 20.7737 19.789 21.2286 18.5391C21.5 17.7935 21.5 16.8623 21.5 15M9 21.5C7.13769 21.5 6.20653 21.5 5.46091 21.2286C4.21096 20.7737 3.22633 19.789 2.77138 18.5391C2.5 17.7935 2.5 16.8623 2.5 15M9 2.5C7.13769 2.5 6.20653 2.5 5.46091 2.77138C4.21096 3.22632 3.22633 4.21096 2.77138 5.46091C2.5 6.20653 2.5 7.13768 2.5 9M15 2.5C16.8623 2.5 17.7935 2.5 18.5391 2.77138C19.789 3.22632 20.7737 4.21096 21.2286 5.46091C21.5 6.20653 21.5 7.13768 21.5 9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FindProcessor;