import React from 'react';

interface UserCardProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const UserCard: React.FC<UserCardProps> = ({
  size = 24,
  color = "#004829",
  strokeWidth = 1.5,
  className = "",
  ...props
}) => {
  // Scale factor to convert from 14x14 viewBox to 24x24 default size
  const scaleFactor = size / 14;
  const adjustedStrokeWidth = strokeWidth / scaleFactor;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M1.16675 6.99967C1.16675 4.79978 1.16675 3.69985 1.85016 3.01642C2.53359 2.33301 3.63352 2.33301 5.83342 2.33301H8.16675C10.3666 2.33301 11.4666 2.33301 12.15 3.01642C12.8334 3.69985 12.8334 4.79978 12.8334 6.99967C12.8334 9.19954 12.8334 10.2995 12.15 10.9829C11.4666 11.6663 10.3666 11.6663 8.16675 11.6663H5.83342C3.63352 11.6663 2.53359 11.6663 1.85016 10.9829C1.16675 10.2995 1.16675 9.19954 1.16675 6.99967Z"
        stroke={color}
        strokeWidth={adjustedStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.41659 5.83366C6.41659 5.18933 5.89427 4.66699 5.24992 4.66699C4.60559 4.66699 4.08325 5.18933 4.08325 5.83366C4.08325 6.47801 4.60559 7.00033 5.24992 7.00033C5.89427 7.00033 6.41659 6.47801 6.41659 5.83366Z"
        stroke={color}
        strokeWidth={adjustedStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.58341 9.33333C7.58341 8.04469 6.53872 7 5.25008 7C3.96142 7 2.91675 8.04469 2.91675 9.33333"
        stroke={color}
        strokeWidth={adjustedStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75 5.25H11.0833"
        stroke={color}
        strokeWidth={adjustedStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75 7H11.0833"
        stroke={color}
        strokeWidth={adjustedStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default UserCard;