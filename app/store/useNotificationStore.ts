// store/useNotificationStore.ts
import { create } from 'zustand';
import { AxiosError } from 'axios';
import {
  Notification,
  NotificationsListResponse,
  MarkNotificationReadResponse,
  MarkAllNotificationsReadResponse,
  SendContactMessageRequest,
  SendContactMessageResponse,
  FetchNotificationsParams,
  NotificationType,
} from '@/app/types';
import { showToast } from '../hooks/useToast';
import apiClient from '../utils/apiClient';

// API Error Response Interface
interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

// Helper function to format error messages
const formatErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data) {
    const errorData = error.response.data as ApiErrorResponse;
    
    if (Array.isArray(errorData.message)) {
      return errorData.message.join(', ');
    }
    
    if (typeof errorData.message === 'string') {
      return errorData.message;
    }
    
    return errorData.error || error.message;
  }
  
  return error instanceof Error ? error.message : 'An unexpected error occurred';
};

// Helper function to handle errors and show toasts
const handleApiError = (error: unknown, defaultMessage: string): string => {
  const errorMessage = formatErrorMessage(error);
  
  if (error instanceof AxiosError && error.response?.status) {
    const status = error.response.status;
    if (status >= 400 && status < 500) {
      showToast(errorMessage, 'error');
    } else if (status >= 500) {
      showToast('Server error. Please try again later.', 'error');
    }
  } else {
    showToast(errorMessage || defaultMessage, 'error');
  }
  
  return errorMessage;
};

interface NotificationState {
  // Notifications data
  notifications: Notification[];
  contactMessages: Notification[];
  unreadCount: number;
  totalRecord: number;
  pageNumber: number;
  pageSize: number;
  
  // Loading states
  isLoading: boolean;
  isFetching: boolean;
  isMarking: boolean;
  isSending: boolean;
  
  // Error states
  error: string | null;
  fetchError: string | null;
  markError: string | null;
  sendError: string | null;
}

interface NotificationActions {
  // Fetch operations
  fetchNotifications: (params?: FetchNotificationsParams) => Promise<void>;
  fetchContactMessages: (params?: Omit<FetchNotificationsParams, 'type'>) => Promise<void>;
  fetchAllNotifications: () => Promise<void>;
  
  // Mark operations
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  
  // Contact message
  sendContactMessage: (data: SendContactMessageRequest) => Promise<Notification>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setFetching: (fetching: boolean) => void;
  setMarking: (marking: boolean) => void;
  setSending: (sending: boolean) => void;
  
  // Error states
  setError: (error: string | null) => void;
  setFetchError: (error: string | null) => void;
  setMarkError: (error: string | null) => void;
  setSendError: (error: string | null) => void;
  clearErrors: () => void;
  
  // Utility
  getNotificationsByType: (type: NotificationType) => Notification[];
  getUnreadNotifications: () => Notification[];
  
  // Reset
  reset: () => void;
}

type NotificationStore = NotificationState & NotificationActions;

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  // Initial state
  notifications: [],
  contactMessages: [],
  unreadCount: 0,
  totalRecord: 0,
  pageNumber: 1,
  pageSize: 20,
  
  isLoading: false,
  isFetching: false,
  isMarking: false,
  isSending: false,
  
  error: null,
  fetchError: null,
  markError: null,
  sendError: null,

  // State setters
  setLoading: (loading) => set({ isLoading: loading }),
  setFetching: (fetching) => set({ isFetching: fetching }),
  setMarking: (marking) => set({ isMarking: marking }),
  setSending: (sending) => set({ isSending: sending }),
  
  setError: (error) => set({ error }),
  setFetchError: (error) => set({ fetchError: error }),
  setMarkError: (error) => set({ markError: error }),
  setSendError: (error) => set({ sendError: error }),
  
  clearErrors: () => set({
    error: null,
    fetchError: null,
    markError: null,
    sendError: null,
  }),

  reset: () => set({
    notifications: [],
    contactMessages: [],
    unreadCount: 0,
    totalRecord: 0,
    pageNumber: 1,
    pageSize: 20,
    isLoading: false,
    isFetching: false,
    isMarking: false,
    isSending: false,
    error: null,
    fetchError: null,
    markError: null,
    sendError: null,
  }),

  // Fetch notifications with optional filters
  fetchNotifications: async (params?: FetchNotificationsParams) => {
    const { setFetching, setFetchError } = get();
    setFetching(true);
    setFetchError(null);
    
    console.log('📥 [Notification Store] Fetching notifications...', params);
    
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params?.type) queryParams.append('type', params.type);
      if (params?.isRead !== undefined) queryParams.append('isRead', params.isRead.toString());
      
      const queryString = queryParams.toString();
      const url = `/notifications${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get<NotificationsListResponse>(url);
      
      if (response.data.statusCode === 200 && response.data.data) {
        const { items, totalRecord, pageNumber, pageSize, unreadCount } = response.data.data;
        console.log('✅ [Notification Store] Notifications fetched:', items.length);
        
        // Separate contact messages from other notifications
        const contactMessages = items.filter(n => n.type === 'contact_message');
        const otherNotifications = items.filter(n => n.type !== 'contact_message');
        
        set({
          notifications: otherNotifications,
          contactMessages,
          totalRecord,
          pageNumber,
          pageSize,
          unreadCount,
          isFetching: false,
          fetchError: null,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      console.error('❌ [Notification Store] Fetch notifications error:', error);
      const errorMessage = handleApiError(error, 'Failed to fetch notifications');
      
      set({
        fetchError: errorMessage,
        isFetching: false,
      });
      throw error;
    }
  },

  // Fetch only contact messages
  fetchContactMessages: async (params?: Omit<FetchNotificationsParams, 'type'>) => {
    const { setFetching, setFetchError } = get();
    setFetching(true);
    setFetchError(null);
    
    console.log('📥 [Notification Store] Fetching contact messages...');
    
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('type', 'contact_message');
      
      if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params?.isRead !== undefined) queryParams.append('isRead', params.isRead.toString());
      
      const url = `/notifications?${queryParams.toString()}`;
      
      const response = await apiClient.get<NotificationsListResponse>(url);
      
      if (response.data.statusCode === 200 && response.data.data) {
        const { items } = response.data.data;
        console.log('✅ [Notification Store] Contact messages fetched:', items.length);
        
        set({
          contactMessages: items,
          isFetching: false,
          fetchError: null,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch contact messages');
      }
    } catch (error) {
      console.error('❌ [Notification Store] Fetch contact messages error:', error);
      const errorMessage = handleApiError(error, 'Failed to fetch contact messages');
      
      set({
        fetchError: errorMessage,
        isFetching: false,
      });
      throw error;
    }
  },

  // Fetch all notifications (for initial load)
  fetchAllNotifications: async () => {
    const { setFetching, setFetchError } = get();
    setFetching(true);
    setFetchError(null);
    
    console.log('📥 [Notification Store] Fetching all notifications...');
    
    try {
      const response = await apiClient.get<NotificationsListResponse>('/notifications');
      
      if (response.data.statusCode === 200 && response.data.data) {
        const { items, totalRecord, pageNumber, pageSize, unreadCount } = response.data.data;
        console.log('✅ [Notification Store] All notifications fetched:', items.length);
        
        // Separate contact messages from other notifications
        const contactMessages = items.filter(n => n.type === 'contact_message');
        const otherNotifications = items.filter(n => n.type !== 'contact_message');
        
        set({
          notifications: otherNotifications,
          contactMessages,
          totalRecord,
          pageNumber,
          pageSize,
          unreadCount,
          isFetching: false,
          fetchError: null,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      console.error('❌ [Notification Store] Fetch all notifications error:', error);
      const errorMessage = handleApiError(error, 'Failed to fetch notifications');
      
      set({
        fetchError: errorMessage,
        isFetching: false,
      });
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    const { setMarking, setMarkError } = get();
    setMarking(true);
    setMarkError(null);
    
    console.log('📤 [Notification Store] Marking notification as read:', notificationId);
    
    try {
      const response = await apiClient.put<MarkNotificationReadResponse>(
        `/notifications?action=mark-read&id=${notificationId}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        console.log('✅ [Notification Store] Notification marked as read');
        
        // Update local state
        set((state) => ({
          notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
          ),
          contactMessages: state.contactMessages.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
          isMarking: false,
          markError: null,
        }));
      } else {
        throw new Error(response.data.message || 'Failed to mark notification as read');
      }
    } catch (error) {
      console.error('❌ [Notification Store] Mark as read error:', error);
      const errorMessage = handleApiError(error, 'Failed to mark notification as read');
      
      set({
        markError: errorMessage,
        isMarking: false,
      });
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const { setMarking, setMarkError } = get();
    setMarking(true);
    setMarkError(null);
    
    console.log('📤 [Notification Store] Marking all notifications as read...');
    
    try {
      const response = await apiClient.put<MarkAllNotificationsReadResponse>(
        '/notifications?action=mark-all-read'
      );
      
      if (response.data.statusCode === 200) {
        console.log('✅ [Notification Store] All notifications marked as read:', response.data.data?.markedCount);
        
        showToast('All notifications marked as read', 'success');
        
        // Update local state
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true })),
          contactMessages: state.contactMessages.map(n => ({ ...n, isRead: true })),
          unreadCount: 0,
          isMarking: false,
          markError: null,
        }));
      } else {
        throw new Error(response.data.message || 'Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('❌ [Notification Store] Mark all as read error:', error);
      const errorMessage = handleApiError(error, 'Failed to mark all notifications as read');
      
      set({
        markError: errorMessage,
        isMarking: false,
      });
      throw error;
    }
  },

  // Send contact message
  sendContactMessage: async (data: SendContactMessageRequest) => {
    const { setSending, setSendError } = get();
    setSending(true);
    setSendError(null);
    
    console.log('📤 [Notification Store] Sending contact message...');
    
    try {
      const response = await apiClient.post<SendContactMessageResponse>(
        '/notifications',
        { action: 'send-contact-message', ...data }
      );
      
      if (response.data.statusCode === 201 && response.data.data) {
        console.log('✅ [Notification Store] Contact message sent:', response.data.data.id);
        
        showToast('Contact message sent successfully!', 'success');
        
        set({
          isSending: false,
          sendError: null,
        });
        
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to send contact message');
      }
    } catch (error) {
      console.error('❌ [Notification Store] Send contact message error:', error);
      const errorMessage = handleApiError(error, 'Failed to send contact message');
      
      set({
        sendError: errorMessage,
        isSending: false,
      });
      throw error;
    }
  },

  // Get notifications by type
  getNotificationsByType: (type: NotificationType) => {
    const { notifications, contactMessages } = get();
    if (type === 'contact_message') {
      return contactMessages;
    }
    return notifications.filter(n => n.type === type);
  },

  // Get unread notifications
  getUnreadNotifications: () => {
    const { notifications, contactMessages } = get();
    return [...notifications, ...contactMessages].filter(n => !n.isRead);
  },
}));

