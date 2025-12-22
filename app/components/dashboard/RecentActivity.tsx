'use client';
import { TrendingUp, Bell, RefreshCw, CheckCheck, Mail, Filter } from 'lucide-react';
import ActivityItemComponent, { ActivityItem, notificationToActivityItem } from './ActivityItems';
import { useState, useEffect, useCallback } from 'react';
import { useNotificationStore } from '@/app/store/useNotificationStore';
import { useAuthStore } from '@/app/store/useAuthStore';
import Link from 'next/link';

type FilterType = 'all' | 'unread' | 'contact_message' | 'buy_request' | 'order_status';


const RecentActivity: React.FC = () => {
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
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Fetch notifications on mount
  useEffect(() => {
    if (user?.id) {
      fetchAllNotifications().catch(console.error);
    }
  }, [user?.id, fetchAllNotifications]);

  // Convert notifications to activity items
  const getFilteredActivities = useCallback((): ActivityItem[] => {
    let allNotifications = [...notifications, ...contactMessages];
    
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
        allNotifications = allNotifications.filter(n => n.type === 'contact_message');
        break;
      case 'buy_request':
        allNotifications = allNotifications.filter(n => n.type === 'buy_request');
        break;
      case 'order_status':
        allNotifications = allNotifications.filter(n => n.type === 'order_status');
        break;
      default:
        // 'all' - show everything
        break;
    }

    return allNotifications.map(notificationToActivityItem);
  }, [notifications, contactMessages, filter]);

  const activities = getFilteredActivities();

  const handleActivityClick = async (activity: ActivityItem) => {
    if (!activity.isRead && typeof activity.id === 'string') {
      try {
        await markAsRead(activity.id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
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
    <div className="w-full bg-white h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">Recent Activity</h2>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Filter Button */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              title="Filter notifications"
            >
              <Filter className={`w-4 h-4 ${filter !== 'all' ? 'text-blue-600' : 'text-gray-600'}`} />
            </button>
            
            {/* Filter Dropdown */}
            {showFilterMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilter(option.value);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                      filter === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mark All Read Button */}
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              disabled={isMarking}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4 text-gray-600" />
            </button>
          )}

          {/* Refresh Button */}
          <button 
            onClick={handleRefresh}
            disabled={isFetching}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
            title="Refresh notifications"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${isFetching ? 'animate-spin' : ''}`} />
          </button>

          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <TrendingUp className="w-4 h-4 text-gray-600" />
        </button>
        </div>
      </div>

      {/* Filter Badge */}
      {filter !== 'all' && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-700">
              Showing: {filterOptions.find(f => f.value === filter)?.label}
            </span>
            <button
              onClick={() => setFilter('all')}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto">
        {isFetching && activities.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <Bell className="w-8 h-8 mb-2 text-gray-300" />
            <p className="text-sm">No notifications</p>
            <p className="text-xs text-gray-400 mt-1">
              {filter !== 'all' ? 'Try changing the filter' : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 p-2 space-y-1">
        {activities.map((activity) => (
              <ActivityItemComponent 
                key={activity.id} 
                activity={activity} 
                onClick={() => handleActivityClick(activity)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contact Messages Section (if any and filter is 'all') */}
      {filter === 'all' && contactMessages.length > 0 && (
        <div className="border-t border-gray-200">
          <div className="px-4 py-2 bg-amber-50 flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">
              {contactMessages.filter(m => !m.isRead).length} unread message{contactMessages.filter(m => !m.isRead).length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Link href={user?.role === 'processor' ? '/dashboard-processor/notifications' : '/dashboard/notifications'}>
          <button 
            className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View All Notifications
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RecentActivity;
