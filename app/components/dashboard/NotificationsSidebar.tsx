'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/app/store/useNotificationStore';
import { useAuthStore } from '@/app/store/useAuthStore';
import NotificationCard from './NotificationCard';
import { resolveNotificationRoute, UserRole } from '@/app/utils/notificationRouting';
import { Notification } from '@/app/types';

interface NotificationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsSidebar: React.FC<NotificationsSidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    notifications,
    contactMessages,
    isFetching,
    fetchAllNotifications,
    markAsRead,
    isMarking,
  } = useNotificationStore();

  const role: UserRole = user?.role === 'processor' ? 'processor' : 'farmer';
  const viewAllHref = role === 'processor' ? '/dashboard-processor/notifications' : '/dashboard/notifications';

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchAllNotifications().catch(console.error);
    }
  }, [isOpen, user?.id, fetchAllNotifications]);

  const allNotifications = [...notifications, ...contactMessages]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 15);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleViewMore = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id);
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
    const route = resolveNotificationRoute(notification, role);
    onClose();
    if (route) {
      router.push(route);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] max-w-full bg-white shadow-xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
          <div className="flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6.44V9.77" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
              <path d="M12.02 2C8.34 2 5.36 4.98 5.36 8.66V10.76C5.36 11.44 5.08 12.46 4.73 13.04L3.46 15.16C2.68 16.47 3.22 17.93 4.66 18.41C9.44 20 14.61 20 19.39 18.41C20.74 17.96 21.32 16.38 20.59 15.16L19.32 13.04C18.97 12.46 18.69 11.43 18.69 10.76V8.66C18.68 5 15.68 2 12.02 2Z" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
              <path d="M15.33 18.82C15.33 20.65 13.83 22.15 12 22.15C11.09 22.15 10.25 21.77 9.65 21.17C9.05 20.57 8.67 19.73 8.67 18.82" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10"/>
            </svg>
            <span className="text-sm font-semibold text-black">Notifications</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {isFetching && allNotifications.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-mainGreen" />
            </div>
          ) : allNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <p className="text-sm">No notifications</p>
              <p className="text-xs text-gray-400 mt-1">You&apos;re all caught up!</p>
            </div>
          ) : (
            allNotifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onMarkAsRead={handleMarkAsRead}
                onViewMore={handleViewMore}
                isMarking={isMarking}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F0F0F0]">
          <Link href={viewAllHref} onClick={onClose}>
            <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
              View All Notifications
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotificationsSidebar;
