// stores/useDataStore.ts
import { create } from 'zustand';
import  { AxiosError } from 'axios';
import { CropResponse, QualityResponse, CertificationResponse, ApiResponse } from '@/app/types';
import apiClient from '../utils/apiClient';



interface DataState {
  // Data
  crops: CropResponse[];
  qualityStandards: QualityResponse[];
  certifications: CertificationResponse[];
  
  // Loading states
  isLoading: boolean;
  cropsLoading: boolean;
  qualityStandardsLoading: boolean;
  certificationsLoading: boolean;
  
  // Error states
  error: string | null;
  cropsError: string | null;
  qualityStandardsError: string | null;
  certificationsError: string | null;
}

interface DataActions {
  // Individual fetch methods
  fetchCrops: () => Promise<void>;
  fetchQualityStandards: () => Promise<void>;
  fetchCertifications: () => Promise<void>;
  
  // Combined fetch method
  fetchAllData: () => Promise<void>;
  
  // Loading state management
  setLoading: (loading: boolean) => void;
  setCropsLoading: (loading: boolean) => void;
  setQualityStandardsLoading: (loading: boolean) => void;
  setCertificationsLoading: (loading: boolean) => void;
  
  // Error state management
  setError: (error: string | null) => void;
  setCropsError: (error: string | null) => void;
  setQualityStandardsError: (error: string | null) => void;
  setCertificationsError: (error: string | null) => void;
  
  // Clear methods
  clearError: () => void;
  clearCropsError: () => void;
  clearQualityStandardsError: () => void;
  clearCertificationsError: () => void;
  clearAllErrors: () => void;
  
  // Reset methods
  resetCrops: () => void;
  resetQualityStandards: () => void;
  resetCertifications: () => void;
  resetAllData: () => void;
}

type DataStore = DataState & DataActions;

export const useDataStore = create<DataStore>((set, get) => ({
  // Initial state
  crops: [],
  qualityStandards: [],
  certifications: [],
  
  // Loading states
  isLoading: false,
  cropsLoading: false,
  qualityStandardsLoading: false,
  certificationsLoading: false,
  
  // Error states
  error: null,
  cropsError: null,
  qualityStandardsError: null,
  certificationsError: null,

  // Loading state management
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setCropsLoading: (loading: boolean) => set({ cropsLoading: loading }),
  setQualityStandardsLoading: (loading: boolean) => set({ qualityStandardsLoading: loading }),
  setCertificationsLoading: (loading: boolean) => set({ certificationsLoading: loading }),
  
  // Error state management
  setError: (error: string | null) => set({ error }),
  setCropsError: (error: string | null) => set({ cropsError: error }),
  setQualityStandardsError: (error: string | null) => set({ qualityStandardsError: error }),
  setCertificationsError: (error: string | null) => set({ certificationsError: error }),
  
  // Clear error methods
  clearError: () => set({ error: null }),
  clearCropsError: () => set({ cropsError: null }),
  clearQualityStandardsError: () => set({ qualityStandardsError: null }),
  clearCertificationsError: () => set({ certificationsError: null }),
  clearAllErrors: () => set({ 
    error: null, 
    cropsError: null, 
    qualityStandardsError: null, 
    certificationsError: null 
  }),

  // Reset data methods
  resetCrops: () => set({ crops: [], cropsError: null }),
  resetQualityStandards: () => set({ qualityStandards: [], qualityStandardsError: null }),
  resetCertifications: () => set({ certifications: [], certificationsError: null }),
  resetAllData: () => set({ 
    crops: [], 
    qualityStandards: [], 
    certifications: [],
    cropsError: null,
    qualityStandardsError: null,
    certificationsError: null,
    error: null
  }),

  // Individual API actions
  fetchCrops: async () => {
    const { setCropsLoading, setCropsError } = get();
    setCropsLoading(true);
    setCropsError(null);
    
    try {
      const response = await apiClient.get<ApiResponse<CropResponse[]>>('/auth?action=crops');

      if (response.data.statusCode === 200 && response.data.data) {
        set({
          crops: response.data.data,
          cropsLoading: false,
          cropsError: null
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
        cropsError: errorMessage,
        cropsLoading: false,
        crops: []
      });
      throw error;
    }
  },

  fetchQualityStandards: async () => {
    const { setQualityStandardsLoading, setQualityStandardsError } = get();
    setQualityStandardsLoading(true);
    setQualityStandardsError(null);
    
    try {
      const response = await apiClient.get<ApiResponse<QualityResponse[]>>('/auth?action=quality-standards');

      if (response.data.statusCode === 200 && response.data.data) {
        set({
          qualityStandards: response.data.data,
          qualityStandardsLoading: false,
          qualityStandardsError: null
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch quality standards');
      }
    } catch (error) {
      console.error('Fetch quality standards error:', error);
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message 
        : 'Failed to fetch quality standards';
      
      set({
        qualityStandardsError: errorMessage,
        qualityStandardsLoading: false,
        qualityStandards: []
      });
      throw error;
    }
  },

  fetchCertifications: async () => {
    const { setCertificationsLoading, setCertificationsError } = get();
    setCertificationsLoading(true);
    setCertificationsError(null);
    
    try {
      const response = await apiClient.get<ApiResponse<CertificationResponse[]>>('/auth?action=certifications');

      if (response.data.statusCode === 200 && response.data.data) {
        set({
          certifications: response.data.data,
          certificationsLoading: false,
          certificationsError: null
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch certifications');
      }
    } catch (error) {
      console.error('Fetch certifications error:', error);
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message 
        : 'Failed to fetch certifications';
      
      set({
        certificationsError: errorMessage,
        certificationsLoading: false,
        certifications: []
      });
      throw error;
    }
  },

  // Combined fetch method
  fetchAllData: async () => {
    const { setLoading, setError, fetchCrops, fetchQualityStandards, fetchCertifications } = get();
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all data concurrently
      await Promise.allSettled([
        fetchCrops(),
        fetchQualityStandards(),
        fetchCertifications()
      ]);
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Fetch all data error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
      
      set({
        error: errorMessage,
        isLoading: false
      });
      throw error;
    }
  },
}));