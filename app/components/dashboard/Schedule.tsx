import React from 'react';
import { Clock, MapPin } from 'lucide-react';

interface ScheduleEventProps {
  title: string;
  time: string;
  location: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  className?: string;
}

const ScheduleEvent: React.FC<ScheduleEventProps> = ({
  title,
  time,
  location,
  status,
  className = ''
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
    <div className={`bg-white border-l-4 border-red rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center gap-4">
        {/* Status Indicator Line */}
        <div className={`w-1 h-12 rounded-full ${colors.border.replace('border-', 'bg-')}`}></div>
        
        {/* Content */}
        <div className="flex-1 flex items-center justify-between">
          <div className="flex-1">
            {/* Title */}
            <h3 className=" font-medium text-base mb-1">{title}</h3>
            
            {/* Time and Location */}
            <div className="flex items-center gap-4 text-xs text-[#6A7C6A]">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};


export default ScheduleEvent;