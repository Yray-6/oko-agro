import React from 'react';
import { MapPin } from 'lucide-react';

interface ScheduleEventProps {
  title: string;
  location: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  className?: string;
  onClick?: () => void;
  onViewDetails?: () => void;
}

const ScheduleEvent: React.FC<ScheduleEventProps> = ({
  title,
  location,
  status,
  className = '',
  onClick,
  onViewDetails
}) => {
  const getStatusColors = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          border: 'border-transparent',
          badge: 'bg-mainGreen/10 text-mainGreen border border-mainGreen/10'
        };
      case 'in-progress':
        return {
          border: 'border-blue-400',
          badge: 'bg-blue-50 text-blue-600 border border-blue-200'
        };
      case 'completed':
        return {
          border: 'border-green-400',
          badge: 'bg-green-50 text-green-600 border border-green-200'
        };
      default:
        return {
          border: 'border-gray-400',
          badge: 'bg-gray-50 text-gray-600 border border-gray-200'
        };
    }
  };

  const colors = getStatusColors(status);

  return (
    <div 
      className={`bg-white border-l-4 border-red rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center gap-4">
        {/* Status Indicator Line */}
        <div className={`w-1 h-12 rounded-full ${colors.border.replace('border-', 'bg-')}`}></div>
        
        {/* Content */}
        <div className="flex-1 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-medium text-base mb-1">{title}</h3>
            
            {/* Location */}
            <div className="flex items-center gap-4 text-xs text-[#6A7C6A]">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Status Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.badge} whitespace-nowrap`}>
              {status}
            </span>
            
            {/* View Details Button - Always show if onViewDetails is provided */}
            {onViewDetails && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
                className="px-3 py-1.5 text-xs font-medium text-mainGreen border border-mainGreen rounded-md hover:bg-mainGreen/10 transition-colors whitespace-nowrap flex-shrink-0"
                type="button"
              >
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default ScheduleEvent;