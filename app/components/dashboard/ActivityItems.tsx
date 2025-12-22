'use client';

import { 
  ClipboardCheck, 
  MessageCircle, 
  ShoppingCart, 
  Truck, 
  CheckCircle2,
  Bell,
  Mail
} from 'lucide-react';
import { Notification, NotificationType } from '@/app/types';

// Legacy activity item interface (for backward compatibility)
export interface ActivityItem {
  id: number | string;
  type: 'payment' | 'inspector' | 'message' | 'request' | NotificationType;
  title: string;
  description: string;
  amount?: string;
  timestamp?: string;
  product?: string;
  grade?: string;
  processor?: string;
  bgColor?: string;
  isRead?: boolean;
  senderName?: string;
}

// Convert Notification to ActivityItem
export const notificationToActivityItem = (notification: Notification): ActivityItem => {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    description: notification.message,
    timestamp: formatTimestamp(notification.createdAt),
    isRead: notification.isRead,
    senderName: notification.senderName,
    bgColor: getNotificationBgColor(notification.type, notification.isRead),
  };
};

// Format timestamp for display
const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

// Get background color based on notification type
const getNotificationBgColor = (type: string, isRead?: boolean): string => {
  if (isRead) {
    return 'bg-gray-100';
  }
  
  switch (type) {
    case 'buy_request':
      return 'bg-emerald-50';
    case 'order_status':
      return 'bg-blue-50';
    case 'contact_message':
      return 'bg-amber-50';
    case 'payment':
      return 'bg-green-50';
    case 'inspector':
      return 'bg-yellow-50';
    default:
      return 'bg-skyBlue';
  }
};

interface ActivityIconProps {
  type: ActivityItem['type'];
  isRead?: boolean;
}

const ActivityIcon: React.FC<ActivityIconProps> = ({ type, isRead }) => {
  const getIcon = () => {
    switch (type) {
      case 'buy_request':
        return <ShoppingCart className="w-4 h-4" />;
      case 'order_status':
        return <Truck className="w-4 h-4" />;
      case 'contact_message':
        return <Mail className="w-4 h-4" />;
      case 'payment':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'inspector':
        return <ClipboardCheck className="w-4 h-4" />;
      case 'message':
        return <MessageCircle className="w-4 h-4" />;
      case 'request':
        return <Bell className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getBackgroundColor = () => {
    if (isRead) {
      return 'bg-gray-400';
    }
    
    switch (type) {
      case 'buy_request':
        return 'bg-emerald-500';
      case 'order_status':
        return 'bg-blue-500';
      case 'contact_message':
        return 'bg-amber-500';
      case 'payment':
        return 'bg-green-500';
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
    <div className={`w-8 h-8 rounded-full ${getBackgroundColor()} flex items-center justify-center text-white flex-shrink-0 transition-colors`}>
      {getIcon()}
    </div>
  );
};

interface ActivityItemComponentProps {
  activity: ActivityItem;
  onClick?: () => void;
}

const ActivityItemComponent: React.FC<ActivityItemComponentProps> = ({ activity, onClick }) => {
  const bgClass = activity.bgColor || getNotificationBgColor(activity.type, activity.isRead);
  
  return (
    <div 
      className={`flex items-start space-x-3 p-3 hover:bg-gray-50 ${bgClass} rounded-lg transition-colors cursor-pointer ${
        !activity.isRead ? 'border-l-4 border-l-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <ActivityIcon type={activity.type} isRead={activity.isRead} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={`text-sm font-medium ${activity.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
              {activity.title}
              {activity.amount && (
                <span className="ml-1 font-semibold text-green-600">{activity.amount}</span>
              )}
            </p>
            <p className={`text-xs mt-1 ${activity.isRead ? 'text-gray-400' : 'text-gray-600'}`}>
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
            {activity.senderName && (
              <p className="text-xs text-gray-500 mt-1">
                From: {activity.senderName}
              </p>
            )}
            {activity.timestamp && (
              <p className="text-xs text-gray-400 mt-1">
                {activity.timestamp}
              </p>
            )}
          </div>
          {!activity.isRead && (
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItemComponent;
