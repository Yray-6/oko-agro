'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bell, 
  Filter, 
  CheckCheck, 
  RefreshCw, 
  Mail, 
  ShoppingCart, 
  Truck,
  Search,
  X,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/app/store/useNotificationStore';
import { useAuthStore } from '@/app/store/useAuthStore';
import ActivityItemComponent, { notificationToActivityItem } from '@/app/components/dashboard/ActivityItems';
import { Notification, NotificationType } from '@/app/types';
import Link from 'next/link';

type FilterType = 'all' | 'unread' | 'contact_message' | 'buy_request' | 'order_status';

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    notifications, 
    contactMessages, 
    unreadCount, 
    isFetching,
    fetchAllNotifications,
    markAsRead,
    markAllAsRead,
    isMarking
  } = useNotificationStore();

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch notifications on mount
  useEffect(() => {
    if (user?.id) {
      fetchAllNotifications().catch(console.error);
    }
  }, [user?.id, fetchAllNotifications]);

  // Get filtered and searched notifications
  const getFilteredNotifications = useCallback((): Notification[] => {
    let allNotifications = [...notifications, ...contactMessages];
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      allNotifications = allNotifications.filter(n => 
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query) ||
        n.senderName?.toLowerCase().includes(query)
      );
    }
    
    // Sort by date (newest first)
    allNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Apply filter
    switch (filter) {
      case 'unread':
        allNotifications = allNotifications.filter(n => !n.isRead);
        break;
      case 'contact_message':
        allNotifications = contactMessages;
        break;
      case 'buy_request':
        allNotifications = notifications.filter(n => n.type === 'buy_request');
        break;
      case 'order_status':
        allNotifications = notifications.filter(n => n.type === 'order_status');
        break;
      default:
        // 'all' - show everything
        break;
    }

    return allNotifications;
  }, [notifications, contactMessages, filter, searchQuery]);

  const filteredNotifications = getFilteredNotifications();
  const activities = filteredNotifications.map(notificationToActivityItem);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Navigate based on notification type
    if (notification.relatedEntityId) {
      if (notification.relatedEntityType === 'buy_request' || notification.type === 'buy_request') {
        router.push(`/dashboard/orders`);
      } else if (notification.relatedEntityType === 'order') {
        router.push(`/dashboard/orders`);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      await fetchAllNotifications();
    } catch (error) {
      console.error('Failed to refresh notifications:', error);
    }
  };

  const filterOptions: { value: FilterType; label: string; icon?: React.ReactNode }[] = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread', icon: <Bell className="w-3 h-3" /> },
    { value: 'contact_message', label: 'Messages', icon: <Mail className="w-3 h-3" /> },
    { value: 'buy_request', label: 'Buy Requests' },
    { value: 'order_status', label: 'Order Updates' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Stay updated with your orders and messages
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  disabled={isMarking}
                  className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all read
                </button>
              )}
              <button 
                onClick={handleRefresh}
                disabled={isFetching}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh notifications"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${isFetching ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mainGreen focus:border-transparent outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {}}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {filterOptions.find(f => f.value === filter)?.label}
                </span>
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[160px] hidden">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                      filter === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {notifications.length + contactMessages.length}
                </p>
              </div>
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Unread</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">
                  {unreadCount}
                </p>
              </div>
              <Bell className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">Messages</p>
                <p className="text-2xl font-bold text-amber-700 mt-1">
                  {contactMessages.length}
                </p>
              </div>
              <Mail className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Orders</p>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  {notifications.filter(n => n.type === 'order_status' || n.type === 'buy_request').length}
                </p>
              </div>
              <Truck className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg border border-gray-200">
          {isFetching && activities.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainGreen"></div>
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Bell className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm text-gray-400 mt-2">
                {searchQuery ? 'Try adjusting your search' : filter !== 'all' ? 'Try changing the filter' : 'You\'re all caught up!'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {activities.map((activity) => {
                const notification = filteredNotifications.find(n => n.id === activity.id);
                return (
                  <div
                    key={activity.id}
                    onClick={() => notification && handleNotificationClick(notification)}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <ActivityItemComponent 
                      activity={activity}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

