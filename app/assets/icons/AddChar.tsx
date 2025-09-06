import React from 'react';

interface AddChatProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const AddChat: React.FC<AddChatProps> = ({
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
        d="M7.29175 1.75217C6.7696 1.74439 6.24449 1.75752 5.7339 1.79146C3.29381 1.95366 1.35015 3.92489 1.19022 6.39958C1.15892 6.88386 1.15892 7.38541 1.19022 7.86969C1.24847 8.771 1.64708 9.60552 2.11636 10.3102C2.38884 10.8035 2.20901 11.4192 1.9252 11.9571C1.72057 12.3449 1.61825 12.5388 1.7004 12.6788C1.78256 12.8189 1.96606 12.8234 2.33308 12.8323C3.05889 12.85 3.54831 12.6442 3.93681 12.3577C4.15715 12.1952 4.26732 12.114 4.34325 12.1046C4.41918 12.0953 4.56861 12.1568 4.86742 12.2799C5.13598 12.3905 5.44781 12.4588 5.7339 12.4778C6.56468 12.533 7.43379 12.5331 8.26626 12.4778C10.7063 12.3156 12.65 10.3444 12.81 7.86969C12.8346 7.48767 12.8398 7.09491 12.8256 6.70833"
        stroke={color}
        strokeWidth={adjustedStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.95825 8.74967H9.04159M4.95825 5.83301H6.99992"
        stroke={color}
        strokeWidth={adjustedStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75 3.20866H12.8333M10.7917 1.16699V5.25033"
        stroke={color}
        strokeWidth={adjustedStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AddChat;