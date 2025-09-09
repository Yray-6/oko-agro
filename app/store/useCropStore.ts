// stores/useCropsStore.ts
import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { CropResponse, ApiResponse } from '@/app/types';

// Configure axios instance for client-side requests
const apiClient = axios.create({
  baseURL: '/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

interface CropsState {
  crops: CropResponse[];
  isLoading: boolean;
  error: string | null;
}

interface CropsActions {
  fetchCrops: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type CropsStore = CropsState & CropsActions;

export const useCropsStore = create<CropsStore>((set) => ({
  // Initial state
  crops: [],
  isLoading: false,
  error: null,

  // State management actions
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  setError: (error: string | null) => set({ error }),
  
  clearError: () => set({ error: null }),

  // API actions
  fetchCrops: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.get<ApiResponse<CropResponse[]>>('?action=crops');

      if (response.data.statusCode === 200 && response.data.data) {
        set({ 
          crops: response.data.data,
          isLoading: false,
          error: null
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch crops');
      }
    } catch (error) {
      console.error('Fetch crops error:', error);
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message 
        : 'Failed to fetch crops';
      
      set({ 
        error: errorMessage,
        isLoading: false,
        crops: []
      });
      throw error;
    }
  },
}));