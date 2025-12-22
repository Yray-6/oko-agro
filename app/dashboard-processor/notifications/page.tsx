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
  ArrowLeft,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/app/store/useNotificationStore';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useBuyRequestStore } from '@/app/store/useRequestStore';
import { showToast } from '@/app/hooks/useToast';
import ActivityItemComponent, { notificationToActivityItem } from '@/app/components/dashboard/ActivityItems';
import DirectOrderModal from '@/app/components/dashboad-processor/DirectOrderModal';
import { Notification, NotificationType, BuyRequest } from '@/app/types';
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
  
  const { fetchBuyRequest, currentRequest, myRequests, fetchMyRequests } = useBuyRequestStore();

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [directModal, setDirectModal] = useState<{
    isOpen: boolean;
    notification: Notification | null;
    buyRequest: BuyRequest | null;
  }>({
    isOpen: false,
    notification: null,
    buyRequest: null,
  });

  // Fetch notifications and buy requests on mount
  useEffect(() => {
    if (user?.id) {
      fetchAllNotifications().catch(console.error);
      fetchMyRequests().catch(console.error);
    }
  }, [user?.id, fetchAllNotifications, fetchMyRequests]);

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

  const handleContactMessageClick = async (notification: Notification) => {
    console.log('🔵 [Notifications Page] handleContactMessageClick called', {
      notificationId: notification.id,
      type: notification.type,
      relatedEntityId: notification.relatedEntityId,
      relatedEntityType: notification.relatedEntityType,
      senderId: notification.senderId,
      senderName: notification.senderName,
      message: notification.message,
    });

    if (!notification.isRead) {
      try {
        await markAsRead(notification.id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // For contact messages, find the buy request and open direct order modal
    if (notification.type === 'contact_message') {
      let buyRequestId = notification.relatedEntityId;
      let buyRequest: BuyRequest | null = null;
      
      // If relatedEntityId is missing, try to find it from user's buy requests
      if (!buyRequestId) {
        console.log('⚠️ [Notifications Page] relatedEntityId missing, searching in myRequests...', {
          myRequestsCount: myRequests.length,
          senderId: notification.senderId,
        });
        
        // Find a general request (seller is null) that matches
        // Or find a request that has been directed to this seller but PO not uploaded
        const matchingRequest = myRequests.find(req => {
          // Check if it's a general request (no seller) or already directed to this seller
          const isGeneralRequest = req.seller === null && req.isGeneral === true && (req.status === 'pending' || req.status === 'accepted');
          const isDirectedToThisSeller = req.seller?.id === notification.senderId && !req.purchaseOrderDoc;
          
          return isGeneralRequest || isDirectedToThisSeller;
        });
        
        if (matchingRequest) {
          buyRequestId = matchingRequest.id;
          buyRequest = matchingRequest;
          console.log('✅ [Notifications Page] Found matching buy request:', {
            buyRequestId,
            hasSeller: !!matchingRequest.seller,
            hasPurchaseOrder: !!matchingRequest.purchaseOrderDoc,
          });
        } else {
          console.warn('⚠️ [Notifications Page] No matching buy request found', {
            myRequests: myRequests.map(r => ({
              id: r.id,
              sellerId: r.seller?.id,
              isGeneral: r.isGeneral,
              status: r.status,
              hasPO: !!r.purchaseOrderDoc,
            })),
          });
        }
      } else {
        // If we have relatedEntityId, try to find the request in myRequests first
        const existingRequest = myRequests.find(req => req.id === buyRequestId);
        if (existingRequest) {
          buyRequest = existingRequest;
          console.log('✅ [Notifications Page] Found existing request in myRequests');
        }
      }

      if (buyRequestId) {
        console.log('✅ [Notifications Page] Opening direct order modal for contact message', {
          buyRequestId,
          hasBuyRequest: !!buyRequest,
        });
        try {
          // Open modal with notification and buy request if available
          setDirectModal({
            isOpen: true,
            notification: {
              ...notification,
              relatedEntityId: buyRequestId, // Set it so modal can use it
            },
            buyRequest: buyRequest, // Pass it if we found it, otherwise modal will fetch
          });
          console.log('✅ [Notifications Page] Modal state updated');
        } catch (error) {
          console.error('❌ [Notifications Page] Failed to open direct order modal:', error);
        }
      } else {
        console.error('❌ [Notifications Page] Cannot open modal - no buy request ID found', {
          hasRelatedEntityId: !!notification.relatedEntityId,
          myRequestsCount: myRequests.length,
        });
        // Show error to user
        showToast('Unable to find the associated buy request. Please try refreshing the page.', 'error');
      }
    } else {
      console.warn('⚠️ [Notifications Page] Not a contact message', {
        type: notification.type,
      });
    }
  };

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
        router.push(`/dashboard-processor/orders`);
      } else if (notification.relatedEntityType === 'order') {
        router.push(`/dashboard-processor/orders`);
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

  const handleDirectModalClose = () => {
    setDirectModal({
      isOpen: false,
      notification: null,
      buyRequest: null,
    });
    // Refresh notifications and requests after directing order
    fetchAllNotifications().catch(console.error);
    fetchMyRequests().catch(console.error);
  };

  const filterOptions: { value: FilterType; label: string; icon?: React.ReactNode }[] = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread', icon: <Bell className="w-3 h-3" /> },
    { value: 'contact_message', label: 'Messages', icon: <Mail className="w-3 h-3" /> },
    { value: 'buy_request', label: 'Buy Requests' },
    { value: 'order_status', label: 'Order Updates' },
  ];

  // Get contact messages for this buy request
  const getContactMessagesForRequest = (buyRequestId: string) => {
    return contactMessages.filter(n => n.relatedEntityId === buyRequestId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard-processor">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your orders and contact messages
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
                <p className="text-sm text-amber-600">Contact Messages</p>
                <p className="text-2xl font-bold text-amber-700 mt-1">
                  {contactMessages.length}
                </p>
              </div>
              <User className="w-8 h-8 text-amber-400" />
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
                const isContactMessage = notification?.type === 'contact_message';
                
                return (
                  <div
                    key={activity.id}
                    onClick={() => {
                      console.log('🟡 [Notifications Page] Notification item clicked', {
                        activityId: activity.id,
                        isContactMessage,
                        hasNotification: !!notification,
                      });
                      if (isContactMessage && notification) {
                        console.log('🟡 [Notifications Page] Triggering contact message click');
                        handleContactMessageClick(notification);
                      } else if (notification) {
                        handleNotificationClick(notification);
                      }
                    }}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <ActivityItemComponent 
                      activity={activity}
                    />
                    {isContactMessage && notification && (
                      <div className="px-4 pb-3">
                        <button
                          onClick={(e) => {
                            console.log('🟢 [Notifications Page] Button clicked!', {
                              notificationId: notification.id,
                              event: e,
                            });
                            e.stopPropagation();
                            console.log('🟢 [Notifications Page] Calling handleContactMessageClick');
                            handleContactMessageClick(notification);
                          }}
                          className="text-sm text-mainGreen hover:text-green-800 font-medium"
                        >
                          View & Direct Order →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Direct Order Modal */}
      {directModal.notification && (
        <DirectOrderModal
          isOpen={directModal.isOpen}
          onClose={handleDirectModalClose}
          notification={directModal.notification}
          buyRequest={directModal.buyRequest}
          onSuccess={handleDirectModalClose}
        />
      )}
    </div>
  );
}

