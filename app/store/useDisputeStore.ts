// stores/useDisputeStore.ts
import { create } from 'zustand';
import { AxiosError } from 'axios';
import { ApiResponse, Dispute, CreateDisputeRequest, DisputesListResponse, DisputeResponse, ResolveDisputeResponse } from '@/app/types';
import apiClient from '../utils/apiClient';
import { showToast } from '../hooks/useToast';

interface DisputeState {
  disputes: Dispute[];
  currentDispute: Dispute | null;
  disputesMeta: {
    total: number;
    pageNumber: number;
    pageSize: number;
  } | null;
  
  isLoading: boolean;
  isCreating: boolean;
  isResolving: boolean;
  isRejecting: boolean;
  fetchError: string | null;
  createError: string | null;
  resolveError: string | null;
}

interface DisputeActions {
  fetchAllDisputes: (params?: { pageNumber?: number; pageSize?: number }) => Promise<void>;
  fetchDispute: (disputeId: string) => Promise<Dispute | null>;
  createDispute: (data: CreateDisputeRequest) => Promise<Dispute | null>;
  resolveDispute: (disputeId: string) => Promise<void>;
  rejectDispute: (disputeId: string) => Promise<void>;
  clearErrors: () => void;
  reset: () => void;
}

type DisputeStore = DisputeState & DisputeActions;

const handleApiError = (error: unknown, defaultMessage: string): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || defaultMessage;
  }
  return defaultMessage;
};

export const useDisputeStore = create<DisputeStore>((set, get) => ({
  // Initial state
  disputes: [],
  currentDispute: null,
  disputesMeta: null,
  
  isLoading: false,
  isCreating: false,
  isResolving: false,
  isRejecting: false,
  fetchError: null,
  createError: null,
  resolveError: null,

  // Fetch all disputes
  fetchAllDisputes: async (params = {}) => {
    set({ isLoading: true, fetchError: null });
    try {
      const { pageNumber = 1, pageSize = 20 } = params;
      const response = await apiClient.get<DisputesListResponse>(
        `/disputes?action=all&pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        set({
          disputes: response.data.data.items,
          disputesMeta: {
            total: response.data.data.total,
            pageNumber: response.data.data.pageNumber,
            pageSize: response.data.data.pageSize,
          },
          isLoading: false,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch disputes');
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to fetch disputes');
      set({
        fetchError: errorMessage,
        isLoading: false,
      });
      showToast(errorMessage, 'error');
      throw error;
    }
  },

  // Fetch single dispute
  fetchDispute: async (disputeId: string) => {
    set({ isLoading: true, fetchError: null });
    try {
      const response = await apiClient.get<DisputeResponse>(
        `/disputes?action=single&disputeId=${disputeId}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        set({
          currentDispute: response.data.data,
          isLoading: false,
        });
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch dispute');
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to fetch dispute');
      set({
        fetchError: errorMessage,
        isLoading: false,
        currentDispute: null,
      });
      showToast(errorMessage, 'error');
      throw error;
    }
  },

  // Create dispute
  createDispute: async (data: CreateDisputeRequest) => {
    set({ isCreating: true, createError: null });
    try {
      const response = await apiClient.post<ApiResponse<Dispute>>(
        '/disputes',
        data
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        set({ isCreating: false });
        showToast('Dispute created successfully', 'success');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create dispute');
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to create dispute');
      set({
        createError: errorMessage,
        isCreating: false,
      });
      showToast(errorMessage, 'error');
      throw error;
    }
  },

  // Resolve dispute
  resolveDispute: async (disputeId: string) => {
    set({ isResolving: true, resolveError: null });
    try {
      const response = await apiClient.patch<ResolveDisputeResponse>(
        '/disputes',
        {
          disputeId,
          action: 'resolve',
        }
      );
      
      if (response.data.statusCode === 200) {
        // Update the dispute in the list
        const disputes = get().disputes;
        const updatedDisputes = disputes.map(d =>
          d.id === disputeId
            ? { ...d, status: 'resolved' as const, resolvedAt: response.data.data.resolvedAt }
            : d
        );
        set({
          disputes: updatedDisputes,
          isResolving: false,
        });
        showToast('Dispute resolved successfully', 'success');
        // Refresh disputes list
        await get().fetchAllDisputes();
      } else {
        throw new Error(response.data.message || 'Failed to resolve dispute');
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to resolve dispute');
      set({
        resolveError: errorMessage,
        isResolving: false,
      });
      showToast(errorMessage, 'error');
      throw error;
    }
  },

  // Reject dispute
  rejectDispute: async (disputeId: string) => {
    set({ isRejecting: true, resolveError: null });
    try {
      const response = await apiClient.patch<ResolveDisputeResponse>(
        '/disputes',
        {
          disputeId,
          action: 'reject',
        }
      );
      
      if (response.data.statusCode === 200) {
        // Update the dispute in the list
        const disputes = get().disputes;
        const updatedDisputes = disputes.map(d =>
          d.id === disputeId
            ? { ...d, status: 'rejected' as const, resolvedAt: response.data.data.resolvedAt }
            : d
        );
        set({
          disputes: updatedDisputes,
          isRejecting: false,
        });
        showToast('Dispute rejected successfully', 'success');
        // Refresh disputes list
        await get().fetchAllDisputes();
      } else {
        throw new Error(response.data.message || 'Failed to reject dispute');
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to reject dispute');
      set({
        resolveError: errorMessage,
        isRejecting: false,
      });
      showToast(errorMessage, 'error');
      throw error;
    }
  },

  // Clear errors
  clearErrors: () => {
    set({
      fetchError: null,
      createError: null,
      resolveError: null,
    });
  },

  // Reset store
  reset: () => {
    set({
      disputes: [],
      currentDispute: null,
      disputesMeta: null,
      isLoading: false,
      isCreating: false,
      isResolving: false,
      isRejecting: false,
      fetchError: null,
      createError: null,
      resolveError: null,
    });
  },
}));
