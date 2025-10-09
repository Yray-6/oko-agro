// store/useBuyRequestStore.ts
import { create } from 'zustand';
import { AxiosError } from 'axios';
import {
  BuyRequest,
  BuyRequestResponse,
  BuyRequestsListResponse,
  CreateBuyRequestRequest,
  CreateBuyRequestApiRequest,
  UpdateBuyRequestRequest,
  UpdateBuyRequestApiRequest,
  UpdateBuyRequestStatusRequest,
  UpdateBuyRequestStatusApiRequest,
  DeleteBuyRequestResponse,
  GeneralBuyRequestsListResponse,
  ApiResponse
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

interface BuyRequestState {
  // Buy requests data
  buyRequests: BuyRequest[];
  myRequests: BuyRequest[];
  generalRequests: BuyRequest[];
  currentRequest: BuyRequest | null;
  
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

interface BuyRequestActions {
  // CRUD operations
  createBuyRequest: (data: CreateBuyRequestRequest) => Promise<BuyRequest>;
  updateBuyRequest: (data: UpdateBuyRequestRequest) => Promise<BuyRequest>;
  updateBuyRequestStatus: (data: UpdateBuyRequestStatusRequest) => Promise<BuyRequest>;
  deleteBuyRequest: (buyRequestId: string) => Promise<void>;
  
  // Fetch operations
  fetchGeneralRequests: () => Promise<void>;
  fetchMyRequests: () => Promise<void>;
  fetchBuyRequest: (buyRequestId: string) => Promise<void>;
  
  // State management
  setCurrentRequest: (request: BuyRequest | null) => void;
  clearCurrentRequest: () => void;
  
  // Loading states
  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setFetching: (fetching: boolean) => void;
  setDeleting: (deleting: boolean) => void;
  
  // Error states
  setError: (error: string | null) => void;
  setCreateError: (error: string | null) => void;
  setUpdateError: (error: string | null) => void;
  setFetchError: (error: string | null) => void;
  setDeleteError: (error: string | null) => void;
  clearErrors: () => void;
  
  // Reset
  reset: () => void;
}

type BuyRequestStore = BuyRequestState & BuyRequestActions;

export const useBuyRequestStore = create<BuyRequestStore>((set, get) => ({
  // Initial state
  buyRequests: [],
  myRequests: [],
  generalRequests: [],
  currentRequest: null,
  
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
  setCurrentRequest: (request) => set({ currentRequest: request }),
  clearCurrentRequest: () => set({ currentRequest: null }),
  
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
    buyRequests: [],
    myRequests: [],
    generalRequests: [],
    currentRequest: null,
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

  // Create buy request
  createBuyRequest: async (data: CreateBuyRequestRequest) => {
    const { setCreating, setCreateError } = get();
    setCreating(true);
    setCreateError(null);
    
    console.log('📤 [Buy Request Store] Creating buy request:', data.description);
    
    try {
      const requestData: CreateBuyRequestApiRequest = {
        action: 'create',
        ...data
      };

      const response = await apiClient.post<BuyRequestResponse>('/requests', requestData);
      
      if (response.data.statusCode === 201 && response.data.data) {
        const newRequest = response.data.data;
        console.log('✅ [Buy Request Store] Buy request created:', newRequest.id);
        
        showToast('Buy request created successfully!', 'success');
        
        set((state) => ({
          buyRequests: [...state.buyRequests, newRequest],
          myRequests: [...state.myRequests, newRequest],
          isCreating: false,
          createError: null,
        }));
        
        return newRequest;
      } else {
        throw new Error(response.data.message || 'Failed to create buy request');
      }
    } catch (error) {
      console.error('❌ [Buy Request Store] Create error:', error);
      const errorMessage = handleApiError(error, 'Failed to create buy request');
      
      set({
        createError: errorMessage,
        isCreating: false,
      });
      throw error;
    }
  },

  // Update buy request (processors only, their own requests)
  updateBuyRequest: async (data: UpdateBuyRequestRequest) => {
    const { setUpdating, setUpdateError } = get();
    setUpdating(true);
    setUpdateError(null);
    
    console.log('📤 [Buy Request Store] Updating buy request:', data.buyRequestId);
    
    try {
      const requestData: UpdateBuyRequestApiRequest = {
        action: 'update',
        ...data
      };

      const response = await apiClient.put<BuyRequestResponse>('/requests', requestData);
      
      if (response.data.statusCode === 200 && response.data.data) {
        const updatedRequest = response.data.data;
        console.log('✅ [Buy Request Store] Buy request updated:', updatedRequest.id);
        
        showToast('Buy request updated successfully!', 'success');
        
        set((state) => ({
          buyRequests: state.buyRequests.map(r => 
            r.id === updatedRequest.id ? updatedRequest : r
          ),
          myRequests: state.myRequests.map(r => 
            r.id === updatedRequest.id ? updatedRequest : r
          ),
          generalRequests: state.generalRequests.map(r => 
            r.id === updatedRequest.id ? updatedRequest : r
          ),
          currentRequest: state.currentRequest?.id === updatedRequest.id 
            ? updatedRequest 
            : state.currentRequest,
          isUpdating: false,
          updateError: null,
        }));
        
        return updatedRequest;
      } else {
        throw new Error(response.data.message || 'Failed to update buy request');
      }
    } catch (error) {
      console.error('❌ [Buy Request Store] Update error:', error);
      const errorMessage = handleApiError(error, 'Failed to update buy request');
      
      set({
        updateError: errorMessage,
        isUpdating: false,
      });
      throw error;
    }
  },

  // Update buy request status (farmers only)
  updateBuyRequestStatus: async (data: UpdateBuyRequestStatusRequest) => {
    const { setUpdating, setUpdateError } = get();
    setUpdating(true);
    setUpdateError(null);
    
    console.log('📤 [Buy Request Store] Updating buy request status:', data.buyRequestId, data.status);
    
    try {
      const requestData: UpdateBuyRequestStatusApiRequest = {
        action: 'update-status',
        ...data
      };

      const response = await apiClient.put<BuyRequestResponse>('/requests', requestData);
      
      if (response.data.statusCode === 200 && response.data.data) {
        const updatedRequest = response.data.data;
        console.log('✅ [Buy Request Store] Buy request status updated:', updatedRequest.status);
        
        showToast('Buy request status updated successfully!', 'success');
        
        set((state) => ({
          buyRequests: state.buyRequests.map(r => 
            r.id === updatedRequest.id ? updatedRequest : r
          ),
          myRequests: state.myRequests.map(r => 
            r.id === updatedRequest.id ? updatedRequest : r
          ),
          generalRequests: state.generalRequests.map(r => 
            r.id === updatedRequest.id ? updatedRequest : r
          ),
          currentRequest: state.currentRequest?.id === updatedRequest.id 
            ? updatedRequest 
            : state.currentRequest,
          isUpdating: false,
          updateError: null,
        }));
        
        return updatedRequest;
      } else {
        throw new Error(response.data.message || 'Failed to update buy request status');
      }
    } catch (error) {
      console.error('❌ [Buy Request Store] Update status error:', error);
      const errorMessage = handleApiError(error, 'Failed to update buy request status');
      
      set({
        updateError: errorMessage,
        isUpdating: false,
      });
      throw error;
    }
  },

  // Fetch general requests (farmers only - pending, <1 week old)
  fetchGeneralRequests: async () => {
    const { setFetching, setFetchError } = get();
    setFetching(true);
    setFetchError(null);
    
    console.log('📥 [Buy Request Store] Fetching general requests...');
    
    try {
      const response = await apiClient.get<GeneralBuyRequestsListResponse>(
        '/requests?action=general'
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        const requests = response.data.data;
        console.log('✅ [Buy Request Store] General requests fetched:', requests.length);
        
        set({
          generalRequests: requests,
          isFetching: false,
          fetchError: null,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch general requests');
      }
    } catch (error) {
      console.error('❌ [Buy Request Store] Fetch general requests error:', error);
      const errorMessage = handleApiError(error, 'Failed to fetch general requests');
      
      set({
        fetchError: errorMessage,
        isFetching: false,
      });
      throw error;
    }
  },

  // Fetch my requests (farmer → seller / processor → buyer)
  fetchMyRequests: async () => {
    const { setFetching, setFetchError } = get();
    setFetching(true);
    setFetchError(null);
    
    console.log('📥 [Buy Request Store] Fetching my requests...');
    
    try {
      const response = await apiClient.get<ApiResponse<BuyRequestsListResponse>>(
        '/requests?action=my-requests'
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        const requests = response.data.data.data.items;
        console.log('✅ [Buy Request Store] My requests fetched:', requests.length);
        
        set({
          myRequests: requests,
          isFetching: false,
          fetchError: null,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch my requests');
      }
    } catch (error) {
      console.error('❌ [Buy Request Store] Fetch my requests error:', error);
      const errorMessage = handleApiError(error, 'Failed to fetch my requests');
      
      set({
        fetchError: errorMessage,
        isFetching: false,
      });
      throw error;
    }
  },

  // Fetch single buy request
  fetchBuyRequest: async (buyRequestId: string) => {
    const { setFetching, setFetchError } = get();
    setFetching(true);
    setFetchError(null);
    
    console.log('📥 [Buy Request Store] Fetching buy request:', buyRequestId);
    
    try {
      const response = await apiClient.get<BuyRequestResponse>(
        `/requests?action=single-request&buyRequestId=${buyRequestId}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        const request = response.data.data;
        console.log('✅ [Buy Request Store] Buy request fetched:', request.requestNumber);
        
        set({
          currentRequest: request,
          isFetching: false,
          fetchError: null,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch buy request');
      }
    } catch (error) {
      console.error('❌ [Buy Request Store] Fetch buy request error:', error);
      const errorMessage = handleApiError(error, 'Failed to fetch buy request');
      
      set({
        fetchError: errorMessage,
        isFetching: false,
        currentRequest: null,
      });
      throw error;
    }
  },

  // Delete buy request (processors only)
  deleteBuyRequest: async (buyRequestId: string) => {
    const { setDeleting, setDeleteError } = get();
    setDeleting(true);
    setDeleteError(null);
    
    console.log('🗑️ [Buy Request Store] Deleting buy request:', buyRequestId);
    
    try {
      const response = await apiClient.delete<DeleteBuyRequestResponse>(
        `/requests?buyRequestId=${buyRequestId}`
      );
      
      if (response.data.statusCode === 200) {
        console.log('✅ [Buy Request Store] Buy request deleted:', buyRequestId);
        
        showToast('Buy request deleted successfully!', 'success');
        
        set((state) => ({
          buyRequests: state.buyRequests.filter(r => r.id !== buyRequestId),
          myRequests: state.myRequests.filter(r => r.id !== buyRequestId),
          generalRequests: state.generalRequests.filter(r => r.id !== buyRequestId),
          currentRequest: state.currentRequest?.id === buyRequestId 
            ? null 
            : state.currentRequest,
          isDeleting: false,
          deleteError: null,
        }));
      } else {
        throw new Error(response.data.message || 'Failed to delete buy request');
      }
    } catch (error) {
      console.error('❌ [Buy Request Store] Delete error:', error);
      const errorMessage = handleApiError(error, 'Failed to delete buy request');
      
      set({
        deleteError: errorMessage,
        isDeleting: false,
      });
      throw error;
    }
  },
}));