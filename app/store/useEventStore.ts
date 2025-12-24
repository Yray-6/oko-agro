import { create } from 'zustand';
import  { AxiosError } from 'axios';
import { ApiResponse, EventDetails } from '@/app/types';
import { showToast } from '../hooks/useToast';
import apiClient from '../utils/apiClient';

// Extended Event interfaces with all properties from API






// Request interfaces for the store
export interface CreateEventRequest {
  name: string;
  description?: string;
  referenceType: 'custom' | 'product' | 'order';
  referenceId?: string | null;
  eventDate: string;
  isHarvestEvent?: boolean;
  cropId?: string;
  cropQuantity?: string;
  cropQuantityUnit?: string;
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
  data:{ data:EventDetails[];}

}

// All Events Response (Admin)
interface AllEventsResponse extends ApiResponse {
  data: {
    items: EventDetails[];
    totalRecord: number;
    pageNumber: number;
    pageSize: number;
  };
}

// Single Event Response
interface SingleEventResponse extends ApiResponse {
  data: EventDetails;
}

// Configure axios instance



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





interface EventState {
  events: EventDetails[];
  currentEvent: EventDetails | null;
  
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isFetching: boolean;
  isDeleting: boolean;
  
  error: string | null;
  createError: string | null;
  updateError: string | null;
  fetchError: string | null;
  deleteError: string | null;
}

interface EventActions {
  fetchUserEvents: (userId: string) => Promise<void>;
  fetchAllEvents: () => Promise<EventDetails[]>;
  fetchEvent: (eventId: string) => Promise<EventDetails>;
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

  fetchUserEvents: async (userId: string) => {
    const { setFetching, setFetchError } = get();
    setFetching(true);
    setFetchError(null);
    
    try {
      const response = await apiClient.get<UserEventsResponse>(
        `/events?action=user-events&userId=${userId}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        set({
          events: response.data.data.data,
          isFetching: false,
          fetchError: null,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch events');
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to fetch events');
      set({
        fetchError: errorMessage,
        isFetching: false,
        events: [],
      });
      throw error;
    }
  },

  fetchAllEvents: async () => {
    const { setFetching, setFetchError } = get();
    setFetching(true);
    setFetchError(null);
    
    try {
      const response = await apiClient.get<AllEventsResponse>(
        `/events?action=all`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        // Handle nested response structure: response.data.data.data.items
        let eventsData: EventDetails[] = [];
        
        if (response.data.data && typeof response.data.data === 'object') {
          // Check if it's the nested structure (data.data.items)
          if ('data' in response.data.data && 
              response.data.data.data && 
              typeof response.data.data.data === 'object' &&
              'items' in response.data.data.data) {
            eventsData = (response.data.data.data as { items: EventDetails[] }).items || [];
          } 
          // Check if it's direct structure (data.items)
          else if ('items' in response.data.data) {
            eventsData = (response.data.data as { items: EventDetails[] }).items || [];
          }
        }
        
        set({
          events: eventsData,
          isFetching: false,
          fetchError: null,
        });
        return eventsData;
      } else {
        throw new Error(response.data.message || 'Failed to fetch events');
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to fetch events');
      set({
        fetchError: errorMessage,
        isFetching: false,
        events: [],
      });
      throw error;
    }
  },

  fetchEvent: async (eventId: string) => {
    const { setFetching, setFetchError } = get();
    setFetching(true);
    setFetchError(null);
    
    try {
      const response = await apiClient.get<SingleEventResponse>(
        `/events?action=single-event&eventId=${eventId}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        // Handle nested response structure from API route
        let eventData: EventDetails | { data: EventDetails } | unknown = response.data.data;
        
        // If the data itself has a nested data structure (API route wraps it)
        if (eventData && typeof eventData === 'object' && 'data' in eventData && eventData.data) {
          console.log('📦 [Event Store] Unwrapping nested data structure');
          eventData = (eventData as { data: EventDetails }).data;
        }
        
        const event = eventData as EventDetails;
        
        set({
          currentEvent: event,
          isFetching: false,
          fetchError: null,
        });
        return event;
      } else {
        throw new Error(response.data.message || 'Failed to fetch event');
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to fetch event');
      set({
        fetchError: errorMessage,
        isFetching: false,
        currentEvent: null,
      });
      throw error;
    }
  },

  createEvent: async (data: CreateEventRequest) => {
    const { setCreating, setCreateError } = get();
    setCreating(true);
    setCreateError(null);
    
    try {
      const requestData: CreateEventApiRequest = {
        action: 'create',
        ...data
      };

      const response = await apiClient.post<SingleEventResponse>('/events', requestData);
      
      if ((response.data.statusCode === 201 || response.data.statusCode === 200) && response.data.data) {
        const newEvent = response.data.data;
        
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
      const errorMessage = handleApiError(error, 'Failed to create event');
      set({
        createError: errorMessage,
        isCreating: false,
      });
      throw error;
    }
  },

  updateEvent: async (data: UpdateEventRequest) => {
    const { setUpdating, setUpdateError } = get();
    setUpdating(true);
    setUpdateError(null);
    
    try {
      const requestData: UpdateEventApiRequest = {
        action: 'update',
        ...data
      };

      const response = await apiClient.patch<SingleEventResponse>('/events', requestData);
      
      if (response.data.statusCode === 200 && response.data.data) {
        const updatedEvent = response.data.data;
        
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
      const errorMessage = handleApiError(error, 'Failed to update event');
      set({
        updateError: errorMessage,
        isUpdating: false,
      });
      throw error;
    }
  },

  deleteEvent: async (eventId: string) => {
    const { setDeleting, setDeleteError } = get();
    setDeleting(true);
    setDeleteError(null);
    
    try {
      const response = await apiClient.delete<ApiResponse>(`/events?eventId=${eventId}`);
      
      if (response.data.statusCode === 200) {
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
      const errorMessage = handleApiError(error, 'Failed to delete event');
      set({
        deleteError: errorMessage,
        isDeleting: false,
      });
      throw error;
    }
  },
}));