'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  Filter,
  CheckCheck,
  RefreshCw,
  Search,
  X,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/app/store/useNotificationStore';
import { useAuthStore } from '@/app/store/useAuthStore';
import NotificationCard from '@/app/components/dashboard/NotificationCard';
import { resolveNotificationRoute } from '@/app/utils/notificationRouting';
import { Notification, NotificationType } from '@/app/types';
import Link from 'next/link';

type FilterType = 'all' | 'unread' | 'contact_message' | 'buy_request' | 'order_status' | 'system';

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
    isMarking,
  } = useNotificationStore();

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchAllNotifications().catch(console.error);
    }
  }, [user?.id, fetchAllNotifications]);

  const getFilteredNotifications = useCallback((): Notification[] => {
    let all = [...notifications, ...contactMessages];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      all = all.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q) ||
          n.senderName?.toLowerCase().includes(q),
      );
    }

    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    switch (filter) {
      case 'unread':
        return all.filter((n) => !n.isRead);
      case 'contact_message':
        return all.filter((n) => n.type === 'contact_message');
      case 'buy_request':
        return all.filter((n) => n.type === 'buy_request');
      case 'order_status':
        return all.filter((n) => n.type === 'order_status');
      case 'system':
        return all.filter((n) => n.type === 'system');
      default:
        return all;
    }
  }, [notifications, contactMessages, filter, searchQuery]);

  const filtered = getFilteredNotifications();

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
    const route = resolveNotificationRoute(notification, 'farmer');
    if (route) {
      router.push(route);
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

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'buy_request', label: 'Buy Requests' },
    { value: 'order_status', label: 'Order Updates' },
    { value: 'system', label: 'System' },
    { value: 'contact_message', label: 'Messages' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
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
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all read
                </button>
              )}
              <button
                onClick={handleRefresh}
                disabled={isFetching}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${isFetching ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {filterOptions.find((f) => f.value === filter)?.label}
                </span>
              </button>
              {showFilterMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[160px]">
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilter(opt.value);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                        filter === opt.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card list */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {isFetching && filtered.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainGreen" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Bell className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm text-gray-400 mt-2">
              {searchQuery
                ? 'Try adjusting your search'
                : filter !== 'all'
                ? 'Try changing the filter'
                : "You're all caught up!"}
            </p>
          </div>
        ) : (
          filtered.map((n) => (
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
    </div>
  );
}
