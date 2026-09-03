'use client';

import React from 'react';
import { Notification } from '@/app/types';

function getUnreadDotColor(type: string): string {
  switch (type) {
    case 'buy_request':
    case 'order_status':
      return 'bg-[#00CE74]';
    case 'contact_message':
      return 'bg-[#71EAFF]';
    case 'system':
      return 'bg-[#EEC41E]';
    case 'dispute':
      return 'bg-red-400';
    case 'rating':
      return 'bg-amber-400';
    default:
      return 'bg-[#71EAFF]';
  }
}

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onViewMore: (notification: Notification) => void;
  isMarking?: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onViewMore,
  isMarking,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-[0_0_1px_rgba(0,0,0,0.25)] p-3 flex flex-col gap-1">
      <div className="flex items-start gap-3">
        {/* Unread dot */}
        <div className="mt-[7px] flex-shrink-0">
          {!notification.isRead ? (
            <div className={`w-2.5 h-2.5 rounded-full ${getUnreadDotColor(notification.type)}`} />
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-normal leading-[1.5em] tracking-[-0.011em] text-black truncate">
            {notification.title}
          </p>
          <p className="text-[10px] font-light leading-[1.5em] tracking-[-0.011em] text-black mt-0.5 line-clamp-2">
            {notification.message}
          </p>
        </div>

        {/* Mark as read chip */}
        {!notification.isRead && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            disabled={isMarking}
            className="flex-shrink-0 bg-white shadow-[0_0_1.16px_rgba(0,0,0,0.25)] rounded-md px-2.5 py-1 text-[10px] font-medium text-[#666666] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Mark as read
          </button>
        )}
      </div>

      {/* View more */}
      <div className="flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewMore(notification);
          }}
          className="text-[10px] font-medium text-[#004829] underline hover:text-[#006B3F] transition-colors"
        >
          View more
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
