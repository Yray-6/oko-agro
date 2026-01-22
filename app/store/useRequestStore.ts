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
  ApiResponse,
  UserBuyRequestsListResponse,
  UpdateOrderStateRequest,
  DirectBuyRequestRequest,
  UploadPurchaseOrderRequest,
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
    userRequests: BuyRequest[];
  
  // Pagination for general requests
  generalRequestsPagination: {
    totalRecord: number;
    pageNumber: number;
    pageSize: number;
  };
  
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
  updateOrderState: (data: UpdateOrderStateRequest) => Promise<BuyRequest>;
  deleteBuyRequest: (buyRequestId: string) => Promise<void>;
  
  // Direct buy request and purchase order
  directBuyRequest: (data: DirectBuyRequestRequest) => Promise<BuyRequest>;
  uploadPurchaseOrder: (data: UploadPurchaseOrderRequest) => Promise<BuyRequest>;
  
  // Fetch operations
  fetchGeneralRequests: (pageNumber?: number, pageSize?: number) => Promise<void>;
  fetchMyRequests: () => Promise<void>;
  fetchBuyRequest: (buyRequestId: string) => Promise<void>;
  
  // State management
  setCurrentRequest: (request: BuyRequest | null) => void;
  clearCurrentRequest: () => void;
  fetchUserRequests: (userId: string) => Promise<void>;
  
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
  userRequests: [],
  
  generalRequestsPagination: {
    totalRecord: 0,
    pageNumber: 1,
    pageSize: 20,
  },
  
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
    userRequests: [],
    generalRequestsPagination: {
      totalRecord: 0,
      pageNumber: 1,
      pageSize: 20,
    },
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

  // Update order state (farmers and processors)
  updateOrderState: async (data: UpdateOrderStateRequest) => {
    const { setUpdating, setUpdateError } = get();
    setUpdating(true);
    setUpdateError(null);
    
    console.log('📤 [Buy Request Store] Updating order state:', data.buyRequestId, data.orderState);
    
    try {
      const requestData = {
        action: 'update-order-state',
        buyRequestId: data.buyRequestId,
        orderState: data.orderState,
      };

      const response = await apiClient.put<BuyRequestResponse>('/requests', requestData);
      
      if (response.data.statusCode === 200 && response.data.data) {
        const updatedRequest = response.data.data;
        console.log('✅ [Buy Request Store] Order state updated:', updatedRequest.orderState);
        
        showToast('Order state updated successfully!', 'success');
        
        set((state) => {
          // Helper function to merge updated request with existing one to preserve nested objects
          const mergeRequest = (existing: BuyRequest | undefined, updated: BuyRequest): BuyRequest => {
            if (!existing) return updated;
            // Merge to preserve nested objects that might not be in the update response
            return {
              ...existing,
              ...updated,
              // Preserve nested objects if they're missing in the update
              cropType: updated.cropType || existing.cropType,
              qualityStandardType: updated.qualityStandardType || existing.qualityStandardType,
              buyer: updated.buyer || existing.buyer,
              seller: updated.seller || existing.seller,
              product: updated.product || existing.product,
            };
          };
          
          return {
            buyRequests: state.buyRequests.map(r => 
              r.id === updatedRequest.id ? mergeRequest(r, updatedRequest) : r
            ),
            myRequests: state.myRequests.map(r => 
              r.id === updatedRequest.id ? mergeRequest(r, updatedRequest) : r
            ),
            generalRequests: state.generalRequests.map(r => 
              r.id === updatedRequest.id ? mergeRequest(r, updatedRequest) : r
            ),
            currentRequest: state.currentRequest?.id === updatedRequest.id 
              ? mergeRequest(state.currentRequest, updatedRequest)
              : state.currentRequest,
            isUpdating: false,
            updateError: null,
          };
        });
        
        return updatedRequest;
      } else {
        throw new Error(response.data.message || 'Failed to update order state');
      }
    } catch (error) {
      console.error('❌ [Buy Request Store] Update order state error:', error);
      const errorMessage = handleApiError(error, 'Failed to update order state');
      
      set({
        updateError: errorMessage,
        isUpdating: false,
      });
      throw error;
    }
  },

  // Fetch general requests (farmers only - pending, <1 week old) with pagination
  fetchGeneralRequests: async (pageNumber = 1, pageSize = 20) => {
    const { setFetching, setFetchError } = get();
    setFetching(true);
    setFetchError(null);
    
    console.log('📥 [Buy Request Store] Fetching general requests with pagination...', { pageNumber, pageSize });
    
    try {
      const response = await apiClient.get<ApiResponse<{
        items: BuyRequest[];
        totalRecord: number;
        pageNumber: number;
        pageSize: number;
      }>>(
        `/requests?action=general&pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        const { items, totalRecord, pageNumber: currentPage, pageSize: currentPageSize } = response.data.data;
        console.log('✅ [Buy Request Store] General requests fetched:', {
          count: items.length,
          totalRecord,
          pageNumber: currentPage,
          pageSize: currentPageSize,
        });
        
        set({
          generalRequests: items,
          generalRequestsPagination: {
            totalRecord,
            pageNumber: currentPage,
            pageSize: currentPageSize,
          },
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
        // Handle nested response structure from API route
        let requestData: BuyRequest | { data: BuyRequest } | unknown = response.data.data;
        
        // If the data itself has a nested data structure (API route wraps it)
        if (requestData && typeof requestData === 'object' && 'data' in requestData && requestData.data) {
          console.log('📦 [Buy Request Store] Unwrapping nested data structure');
          requestData = (requestData as { data: BuyRequest }).data;
        }
        
        const request = requestData as BuyRequest;
        
        console.log('✅ [Buy Request Store] Buy request fetched:', {
          requestId: request.id,
          requestNumber: request.requestNumber,
          description: request.description,
          hasCropType: !!request.cropType,
          hasQualityStandard: !!request.qualityStandardType,
          keys: Object.keys(request),
        });
        
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
   fetchUserRequests: async (userId: string) => {
    const { setFetching, setFetchError } = get();
    setFetching(true);
    setFetchError(null);
    
    console.log('📥 [Buy Request Store] Fetching buy requests for user:', userId);
    
    try {
      const response = await apiClient.get<ApiResponse<UserBuyRequestsListResponse>>(
        `/requests?action=user-requests&userId=${userId}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        const requests = response.data.data.data;
        console.log('✅ [Buy Request Store] User buy requests fetched:', requests.length);
        
        set({
          userRequests: requests,
          isFetching: false,
          fetchError: null,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch user buy requests');
      }
    } catch (error) {
      console.error('❌ [Buy Request Store] Fetch user buy requests error:', error);
      const errorMessage = handleApiError(error, 'Failed to fetch user buy requests');
      
      set({
        fetchError: errorMessage,
        isFetching: false,
        userRequests: [],
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

  // Direct buy request to a specific seller (processors only)
  directBuyRequest: async (data: DirectBuyRequestRequest) => {
    const { setUpdating, setUpdateError } = get();
    setUpdating(true);
    setUpdateError(null);
    
    console.log('📤 [Buy Request Store] Directing buy request to seller:', data.buyRequestId, data.sellerId);
    
    try {
      const response = await apiClient.put<BuyRequestResponse>(
        '/requests',
        {
          action: 'direct',
          buyRequestId: data.buyRequestId,
          sellerId: data.sellerId,
        }
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        const updatedRequest = response.data.data;
        console.log('✅ [Buy Request Store] Buy request directed to seller:', updatedRequest.seller?.id);
        
        showToast('Order directed to seller successfully! Go to my orders active orders to track.', 'success');
        
        set((state) => ({
          buyRequests: state.buyRequests.map(r => 
            r.id === updatedRequest.id ? updatedRequest : r
          ),
          myRequests: state.myRequests.map(r => 
            r.id === updatedRequest.id ? updatedRequest : r
          ),
          generalRequests: state.generalRequests.filter(r => r.id !== updatedRequest.id),
          currentRequest: state.currentRequest?.id === updatedRequest.id 
            ? updatedRequest 
            : state.currentRequest,
          isUpdating: false,
          updateError: null,
        }));
        
        return updatedRequest;
      } else {
        throw new Error(response.data.message || 'Failed to direct buy request');
      }
    } catch (error) {
      console.error('❌ [Buy Request Store] Direct buy request error:', error);
      const errorMessage = handleApiError(error, 'Failed to direct buy request');
      
      set({
        updateError: errorMessage,
        isUpdating: false,
      });
      throw error;
    }
  },

  // Upload purchase order document (processors only)
  uploadPurchaseOrder: async (data: UploadPurchaseOrderRequest) => {
    const { setUpdating, setUpdateError } = get();
    setUpdating(true);
    setUpdateError(null);
    
    console.log('📤 [Buy Request Store] Uploading purchase order for:', {
      buyRequestId: data.buyRequestId,
      hasPurchaseOrderDoc: !!data.purchaseOrderDoc,
      purchaseOrderDocLength: data.purchaseOrderDoc?.length || 0,
    });
    
    try {
      const response = await apiClient.post<BuyRequestResponse>(
        '/requests',
        {
          action: 'upload-purchase-order',
          buyRequestId: data.buyRequestId,
          purchaseOrderDoc: data.purchaseOrderDoc,
        }
      );
      
      if ((response.data.statusCode === 200 || response.data.statusCode === 201) && response.data.data) {
        const updatedRequest = response.data.data;
        console.log('✅ [Buy Request Store] Purchase order uploaded:', updatedRequest.id);
        
        showToast('Purchase order uploaded successfully!', 'success');
        
        set((state) => ({
          buyRequests: state.buyRequests.map(r => 
            r.id === updatedRequest.id ? updatedRequest : r
          ),
          myRequests: state.myRequests.map(r => 
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
        throw new Error(response.data.message || 'Failed to upload purchase order');
      }
    } catch (error) {
      console.error('❌ [Buy Request Store] Upload purchase order error:', error);
      const errorMessage = handleApiError(error, 'Failed to upload purchase order');
      
      set({
        updateError: errorMessage,
        isUpdating: false,
      });
      throw error;
    }
  },
}));