import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/app/types';
import { showToast } from '../hooks/useToast';

// Event interfaces
export interface EventDetails {
  id: string;
  name: string;
  description?: string;
  referenceType: string;
  referenceId?: string;
  eventDate: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Request interfaces for the store
export interface CreateEventRequest {
  name: string;
  description?: string;
  referenceType: 'custom' | 'product' | 'order';
  referenceId?: string;
  eventDate: string;
}

export interface UpdateEventRequest {
  eventId: string;
  name?: string;
  description?: string;
  eventDate?: string;
}

// Internal request interfaces with action field
interface CreateEventApiRequest extends CreateEventRequest {
  action: 'create';
}

interface UpdateEventApiRequest extends UpdateEventRequest {
  action: 'update';
}

// API Error Response Interface
interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

// User Events Response
interface UserEventsResponse extends ApiResponse {
  data: EventDetails[];
}

// Single Event Response
interface SingleEventResponse extends ApiResponse {
  data: EventDetails;
}

// Configure axios instance
const apiClient = axios.create({
  baseURL: '/api/events',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Helper function to get token
const getAuthToken = (): string | null => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;
    
    const authData = JSON.parse(authStorage);
    return authData?.state?.tokens?.accessToken || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper function to format error messages
const formatErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data) {
    const errorData = error.response.data as ApiErrorResponse;
    
    // Handle array of error messages (validation errors)
    if (Array.isArray(errorData.message)) {
      return errorData.message.join(', ');
    }
    
    // Handle single error message
    if (typeof errorData.message === 'string') {
      return errorData.message;
    }
    
    // Fallback to error field or status text
    return errorData.error || error.message;
  }
  
  return error instanceof Error ? error.message : 'An unexpected error occurred';
};

// Helper function to handle errors and show toasts
const handleApiError = (error: unknown, defaultMessage: string): string => {
  const errorMessage = formatErrorMessage(error);
  
  // Show toast for 400 errors and other client errors
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

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔐 [Event Store] Token attached');
  } else {
    console.warn('⚠️ [Event Store] No token found');
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ [Event Store] API Response:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase()
    });
    return response;
  },
  (error) => {
    console.error('❌ [Event Store] API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

interface EventState {
  events: EventDetails[];
  currentEvent: EventDetails | null;
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isFetching: boolean;
  isDeleting: boolean;
  
  // Error states
  error: string | null;
  createError: string | null;
  updateError: string | null;
  fetchError: string | null;
  deleteError: string | null;
}

interface EventActions {
  fetchUserEvents: (userId: string) => Promise<void>;
  fetchEvent: (eventId: string) => Promise<void>;
  createEvent: (data: CreateEventRequest) => Promise<EventDetails>;
  updateEvent: (data: UpdateEventRequest) => Promise<EventDetails>;
  deleteEvent: (eventId: string) => Promise<void>;
  
  setCurrentEvent: (event: EventDetails | null) => void;
  clearCurrentEvent: () => void;
  
  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setFetching: (fetching: boolean) => void;
  setDeleting: (deleting: boolean) => void;
  
  setError: (error: string | null) => void;
  setCreateError: (error: string | null) => void;
  setUpdateError: (error: string | null) => void;
  setFetchError: (error: string | null) => void;
  setDeleteError: (error: string | null) => void;
  clearErrors: () => void;
  
  reset: () => void;
}

type EventStore = EventState & EventActions;

export const useEventStore = create<EventStore>((set, get) => ({
  // Initial state
  events: [],
  currentEvent: null,
  
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isFetching: false,
  isDeleting: false,
  
  error: null,
  createError: null,
  updateError: null,
  fetchError: null,
  deleteError: null,

  // State setters
  setCurrentEvent: (event) => set({ currentEvent: event }),
  clearCurrentEvent: () => set({ currentEvent: null }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  setCreating: (creating) => set({ isCreating: creating }),
  setUpdating: (updating) => set({ isUpdating: updating }),
  setFetching: (fetching) => set({ isFetching: fetching }),
  setDeleting: (deleting) => set({ isDeleting: deleting }),
  
  setError: (error) => set({ error }),
  setCreateError: (error) => set({ createError: error }),
  setUpdateError: (error) => set({ updateError: error }),
  setFetchError: (error) => set({ fetchError: error }),
  setDeleteError: (error) => set({ deleteError: error }),
  
  clearErrors: () => set({
    error: null,
    createError: null,
    updateError: null,
    fetchError: null,
    deleteError: null,
  }),

  reset: () => set({
    events: [],
    currentEvent: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isFetching: false,
    isDeleting: false,
    error: null,
    createError: null,
    updateError: null,
    fetchError: null,
    deleteError: null,
  }),

  // Fetch user events
  fetchUserEvents: async (userId: string) => {
    const { setFetching, setFetchError } = get();
    setFetching(true);
    setFetchError(null);
    
    console.log('📥 [Event Store] Fetching events for user:', userId);
    
    try {
      const response = await apiClient.get<UserEventsResponse>(
        `?action=user-events&userId=${userId}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        const events = response.data.data;
        console.log('✅ [Event Store] Events fetched:', events.length);
        
        set({
          events: events,
          isFetching: false,
          fetchError: null,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('❌ [Event Store] Fetch error:', error);
      const errorMessage = handleApiError(error, 'Failed to fetch events');
      
      set({
        fetchError: errorMessage,
        isFetching: false,
        events: [],
      });
      throw error;
    }
  },

  // Fetch single event
  fetchEvent: async (eventId: string) => {
    const { setFetching, setFetchError } = get();
    setFetching(true);
    setFetchError(null);
    
    console.log('📥 [Event Store] Fetching event:', eventId);
    
    try {
      const response = await apiClient.get<SingleEventResponse>(
        `?action=single-event&eventId=${eventId}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        console.log('✅ [Event Store] Event fetched:', response.data.data.name);
        set({
          currentEvent: response.data.data,
          isFetching: false,
          fetchError: null,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch event');
      }
    } catch (error) {
      console.error('❌ [Event Store] Fetch event error:', error);
      const errorMessage = handleApiError(error, 'Failed to fetch event');
      
      set({
        fetchError: errorMessage,
        isFetching: false,
        currentEvent: null,
      });
      throw error;
    }
  },

  // Create event
  createEvent: async (data: CreateEventRequest) => {
    const { setCreating, setCreateError } = get();
    setCreating(true);
    setCreateError(null);
    
    console.log('📤 [Event Store] Creating event:', data.name);
    
    try {
      const requestData: CreateEventApiRequest = {
        action: 'create',
        ...data
      };

      const response = await apiClient.post<SingleEventResponse>('', requestData);
      
      if ((response.data.statusCode === 201 || response.data.statusCode === 200) && response.data.data) {
        const newEvent = response.data.data;
        console.log('✅ [Event Store] Event created:', newEvent.id);
        
        // Show success toast
        showToast('Event created successfully!', 'success');
        
        set((state) => ({
          events: [...state.events, newEvent],
          isCreating: false,
          createError: null,
        }));
        
        return newEvent;
      } else {
        throw new Error(response.data.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('❌ [Event Store] Create error:', error);
      const errorMessage = handleApiError(error, 'Failed to create event');
      
      set({
        createError: errorMessage,
        isCreating: false,
      });
      throw error;
    }
  },

  // Update event
  updateEvent: async (data: UpdateEventRequest) => {
    const { setUpdating, setUpdateError } = get();
    setUpdating(true);
    setUpdateError(null);
    
    console.log('📤 [Event Store] Updating event:', data.eventId);
    
    try {
      const requestData: UpdateEventApiRequest = {
        action: 'update',
        ...data
      };

      const response = await apiClient.patch<SingleEventResponse>('', requestData);
      
      if (response.data.statusCode === 200 && response.data.data) {
        const updatedEvent = response.data.data;
        console.log('✅ [Event Store] Event updated:', updatedEvent.id);
        
        // Show success toast
        showToast('Event updated successfully!', 'success');
        
        set((state) => ({
          events: state.events.map(e => 
            e.id === updatedEvent.id ? updatedEvent : e
          ),
          currentEvent: state.currentEvent?.id === updatedEvent.id 
            ? updatedEvent 
            : state.currentEvent,
          isUpdating: false,
          updateError: null,
        }));
        
        return updatedEvent;
      } else {
        throw new Error(response.data.message || 'Failed to update event');
      }
    } catch (error) {
      console.error('❌ [Event Store] Update error:', error);
      const errorMessage = handleApiError(error, 'Failed to update event');
      
      set({
        updateError: errorMessage,
        isUpdating: false,
      });
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (eventId: string) => {
    const { setDeleting, setDeleteError } = get();
    setDeleting(true);
    setDeleteError(null);
    
    console.log('🗑️ [Event Store] Deleting event:', eventId);
    
    try {
      const response = await apiClient.delete<ApiResponse>(`?eventId=${eventId}`);
      
      if (response.data.statusCode === 200) {
        console.log('✅ [Event Store] Event deleted:', eventId);
        
        // Show success toast
        showToast('Event deleted successfully!', 'success');
        
        set((state) => ({
          events: state.events.filter(e => e.id !== eventId),
          currentEvent: state.currentEvent?.id === eventId 
            ? null 
            : state.currentEvent,
          isDeleting: false,
          deleteError: null,
        }));
      } else {
        throw new Error(response.data.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('❌ [Event Store] Delete error:', error);
      const errorMessage = handleApiError(error, 'Failed to delete event');
      
      set({
        deleteError: errorMessage,
        isDeleting: false,
      });
      throw error;
    }
  },
}));