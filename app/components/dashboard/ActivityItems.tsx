
import { ClipboardCheck } from 'lucide-react';

export interface ActivityItem {
  id: number;
  type: 'payment' | 'inspector' | 'message' | 'request';
  title: string;
  description: string;
  amount?: string;
  timestamp?: string;
  product?: string;
  grade?: string;
  processor?: string;
  bgColor?: string;
}

interface ActivityIconProps {
  type: ActivityItem['type'];
  bgColor?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ActivityIcon: React.FC<ActivityIconProps> = ({ type, bgColor }) => {
  const getIcon = () => {
    switch (type) {
      case 'payment':
        return <div className="w-2 h-2 rounded-full bg-white"></div>;
      case 'inspector':
        return <ClipboardCheck className="w-4 h-4" />;
      case 'message':
        return <div className="w-2 h-2 rounded-full bg-white"></div>;
      case 'request':
        return <div className="w-2 h-2 rounded-full bg-white"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-white"></div>;
    }
  };

  const getBackgroundColor = () => {
    if (bgColor) return bgColor;
    
    switch (type) {
      case 'payment':
        return 'bg-green';
      case 'inspector':
        return 'bg-yellow-500';
      case 'message':
      case 'request':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`w-8 h-8 rounded-full ${getBackgroundColor()} flex items-center justify-center text-white flex-shrink-0`}>
      {getIcon()}
    </div>
  );
};

interface ActivityItemComponentProps {
  activity: ActivityItem;
}

const ActivityItemComponent: React.FC<ActivityItemComponentProps> = ({ activity }) => {
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 bg-skyBlue rounded-lg transition-colors">
 
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {activity.title}
              {activity.amount && (
                <span className="ml-1 font-semibold">{activity.amount}</span>
              )}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {activity.description}
            </p>
            {activity.product && (
              <p className="text-xs text-gray-500 mt-1">
                Product: {activity.product}
                {activity.grade && ` - ${activity.grade}`}
              </p>
            )}
            {activity.processor && (
              <p className="text-xs text-gray-500">
                Processor: {activity.processor}
              </p>
            )}
            {activity.timestamp && (
              <p className="text-xs text-gray-500">
                {activity.timestamp}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItemComponent