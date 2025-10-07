import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AxiosError } from 'axios';
import {
  ApiResponse,
  CreateProductApiRequest,
  CreateProductRequest,
  ProductDetails,
  SearchUsersParams,
  UpdateProductApiRequest,
  UpdateProductRequest,
  UserProducts,
  UserProductsResponse,
  UserProfile,
  UsersSearchResponse,
} from '@/app/types';
import { showToast } from '../hooks/useToast';
import apiClient from '../utils/apiClient';

// User interfaces for farmers and processors
export interface Crop {
  id: string;
  name: string;
}

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

// State and Actions
interface ProductState {
  products: ProductDetails[];
  currentProduct: ProductDetails | null;

  farmers: UserProfile[];
  processors: UserProfile[];
  farmersSearchMeta: {
    matchedRecord: number;
    totalRecord: number;
    pageNumber: number;
    pageSize: number;
  } | null;
  processorsSearchMeta: {
    matchedRecord: number;
    totalRecord: number;
    pageNumber: number;
    pageSize: number;
  } | null;

  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isFetching: boolean;
  isSearchingFarmers: boolean;
  isSearchingProcessors: boolean;

  error: string | null;
  createError: string | null;
  updateError: string | null;
  fetchError: string | null;
  farmersSearchError: string | null;
  processorsSearchError: string | null;
}

interface ProductActions {
  fetchUserProducts: (userId: string) => Promise<void>;
  fetchProduct: (productId: string) => Promise<void>;
  createProduct: (data: CreateProductRequest) => Promise<ProductDetails>;
  updateProduct: (data: UpdateProductRequest) => Promise<ProductDetails>;
  deleteProduct: (productId: string) => Promise<void>;

  searchFarmers: (params: SearchUsersParams) => Promise<UsersSearchResponse>;
  searchProcessors: (params: SearchUsersParams) => Promise<UsersSearchResponse>;
  clearFarmersSearch: () => void;
  clearProcessorsSearch: () => void;

  setCurrentProduct: (product: ProductDetails | null) => void;
  clearCurrentProduct: () => void;

  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setFetching: (fetching: boolean) => void;

  setError: (error: string | null) => void;
  setCreateError: (error: string | null) => void;
  setUpdateError: (error: string | null) => void;
  setFetchError: (error: string | null) => void;
  clearErrors: () => void;

  reset: () => void;
}

type ProductStore = ProductState & ProductActions;

// ✅ Persisted Zustand store
export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      // --- initial state ---
      products: [],
      currentProduct: null,
      farmers: [],
      processors: [],
      farmersSearchMeta: null,
      processorsSearchMeta: null,

      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isFetching: false,
      isSearchingFarmers: false,
      isSearchingProcessors: false,

      error: null,
      createError: null,
      updateError: null,
      fetchError: null,
      farmersSearchError: null,
      processorsSearchError: null,

      // --- state setters ---
      setCurrentProduct: (product) => set({ currentProduct: product }),
      clearCurrentProduct: () => set({ currentProduct: null }),

      setLoading: (loading) => set({ isLoading: loading }),
      setCreating: (creating) => set({ isCreating: creating }),
      setUpdating: (updating) => set({ isUpdating: updating }),
      setFetching: (fetching) => set({ isFetching: fetching }),

      setError: (error) => set({ error }),
      setCreateError: (error) => set({ createError: error }),
      setUpdateError: (error) => set({ updateError: error }),
      setFetchError: (error) => set({ fetchError: error }),

      clearErrors: () =>
        set({
          error: null,
          createError: null,
          updateError: null,
          fetchError: null,
          farmersSearchError: null,
          processorsSearchError: null,
        }),

      clearFarmersSearch: () =>
        set({
          farmers: [],
          farmersSearchMeta: null,
          farmersSearchError: null,
        }),

      clearProcessorsSearch: () =>
        set({
          processors: [],
          processorsSearchMeta: null,
          processorsSearchError: null,
        }),

      reset: () =>
        set({
          products: [],
          currentProduct: null,
          farmers: [],
          processors: [],
          farmersSearchMeta: null,
          processorsSearchMeta: null,
          isLoading: false,
          isCreating: false,
          isUpdating: false,
          isFetching: false,
          isSearchingFarmers: false,
          isSearchingProcessors: false,
          error: null,
          createError: null,
          updateError: null,
          fetchError: null,
          farmersSearchError: null,
          processorsSearchError: null,
        }),

  // Search farmers
  searchFarmers: async (params: SearchUsersParams) => {
    set({ isSearchingFarmers: true, farmersSearchError: null });
    
    console.log('🔍 [Product Store] Searching farmers:', params);
    
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      
      const response = await apiClient.get<ApiResponse<UsersSearchResponse>>(
        `/products?action=search-farmers&${queryParams.toString()}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        const searchData = response.data.data;
        console.log('✅ [Product Store] Farmers found:', searchData.items.length);
        
        set({
          farmers: searchData.items,
          farmersSearchMeta: {
            matchedRecord: searchData.matchedRecord,
            totalRecord: searchData.totalRecord,
            pageNumber: searchData.pageNumber,
            pageSize: searchData.pageSize,
          },
          isSearchingFarmers: false,
          farmersSearchError: null,
        });
        
        return searchData;
      } else {
        throw new Error(response.data.message || 'Failed to search farmers');
      }
    } catch (error) {
      console.error('❌ [Product Store] Search farmers error:', error);
      const errorMessage = handleApiError(error, 'Failed to search farmers');
      
      set({
        farmersSearchError: errorMessage,
        isSearchingFarmers: false,
        farmers: [],
        farmersSearchMeta: null,
      });
      throw error;
    }
  },

  // Search processors
  searchProcessors: async (params: SearchUsersParams) => {
    set({ isSearchingProcessors: true, processorsSearchError: null });
    
    console.log('🔍 [Product Store] Searching processors:', params);
    
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      
      const response = await apiClient.get<ApiResponse<UsersSearchResponse>>(
        `/products?action=search-processors&${queryParams.toString()}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        const searchData = response.data.data;
        console.log('✅ [Product Store] Processors found:', searchData.items.length);
        
        set({
          processors: searchData.items,
          processorsSearchMeta: {
            matchedRecord: searchData.matchedRecord,
            totalRecord: searchData.totalRecord,
            pageNumber: searchData.pageNumber,
            pageSize: searchData.pageSize,
          },
          isSearchingProcessors: false,
          processorsSearchError: null,
        });
        
        return searchData;
      } else {
        throw new Error(response.data.message || 'Failed to search processors');
      }
    } catch (error) {
      console.error('❌ [Product Store] Search processors error:', error);
      const errorMessage = handleApiError(error, 'Failed to search processors');
      
      set({
        processorsSearchError: errorMessage,
        isSearchingProcessors: false,
        processors: [],
        processorsSearchMeta: null,
      });
      throw error;
    }
  },

  // Fetch user products
  fetchUserProducts: async (userId: string) => {
    const { setFetching, setFetchError } = get();
    setFetching(true);
    setFetchError(null);
    
    console.log('📥 [Product Store] Fetching products for user:', userId);
    
    try {
      const response = await apiClient.get<ApiResponse<UserProducts>>(
        `/products?action=user-products&userId=${userId}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        const products = response.data.data.data;
        console.log('✅ [Product Store] Products fetched:', products.length);
        
        set({
          products: products,
          isFetching: false,
          fetchError: null,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('❌ [Product Store] Fetch error:', error);
      const errorMessage = handleApiError(error, 'Failed to fetch products');
      
      set({
        fetchError: errorMessage,
        isFetching: false,
        products: [],
      });
      throw error;
    }
  },

  // Fetch single product
  fetchProduct: async (productId: string) => {
    const { setFetching, setFetchError } = get();
    setFetching(true);
    setFetchError(null);
    
    console.log('📥 [Product Store] Fetching product:', productId);
    
    try {
      const response = await apiClient.get<ApiResponse<ProductDetails>>(
        `/products?action=single-product&productId=${productId}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        console.log('✅ [Product Store] Product fetched:', response.data.data.name);
        set({
          currentProduct: response.data.data,
          isFetching: false,
          fetchError: null,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch product');
      }
    } catch (error) {
      console.error('❌ [Product Store] Fetch product error:', error);
      const errorMessage = handleApiError(error, 'Failed to fetch product');
      
      set({
        fetchError: errorMessage,
        isFetching: false,
        currentProduct: null,
      });
      throw error;
    }
  },

  // Create product
  createProduct: async (data: CreateProductRequest) => {
    const { setCreating, setCreateError } = get();
    setCreating(true);
    setCreateError(null);
    
    console.log('📤 [Product Store] Creating product:', data.name);
    
    try {
      const requestData: CreateProductApiRequest = {
        action: 'create',
        ...data
      };

      const response = await apiClient.post<UserProductsResponse>('/products', requestData);
      
      if (response.data.statusCode === 201 && response.data.data) {
        const newProduct = response.data.data;
        console.log('✅ [Product Store] Product created:', newProduct.id);
        
        showToast('Product created successfully!', 'success');
        
        set((state) => ({
          products: [...state.products, newProduct],
          isCreating: false,
          createError: null,
        }));
        
        return newProduct;
      } else {
        throw new Error(response.data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('❌ [Product Store] Create error:', error);
      const errorMessage = handleApiError(error, 'Failed to create product');
      
      set({
        createError: errorMessage,
        isCreating: false,
      });
      throw error;
    }
  },

  // Update product
  updateProduct: async (data: UpdateProductRequest) => {
    const { setUpdating, setUpdateError } = get();
    setUpdating(true);
    setUpdateError(null);
    
    console.log('📤 [Product Store] Updating product:', data.productId);
    
    try {
      const requestData: UpdateProductApiRequest = {
        action: 'update',
        ...data
      };

      const response = await apiClient.patch<UserProductsResponse>('/products', requestData);
      
      if (response.data.statusCode === 200 && response.data.data) {
        const updatedProduct = response.data.data;
        console.log('✅ [Product Store] Product updated:', updatedProduct.id);
        
        showToast('Product updated successfully!', 'success');
        
        set((state) => ({
          products: state.products.map(p => 
            p.id === updatedProduct.id ? updatedProduct : p
          ),
          currentProduct: state.currentProduct?.id === updatedProduct.id 
            ? updatedProduct 
            : state.currentProduct,
          isUpdating: false,
          updateError: null,
        }));
        
        return updatedProduct;
      } else {
        throw new Error(response.data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('❌ [Product Store] Update error:', error);
      const errorMessage = handleApiError(error, 'Failed to update product');
      
      set({
        updateError: errorMessage,
        isUpdating: false,
      });
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId: string) => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    
    console.log('🗑️ [Product Store] Deleting product:', productId);
    
    try {
      const response = await apiClient.delete<ApiResponse>(`/products/${productId}`);
      
      if (response.data.statusCode === 200) {
        console.log('✅ [Product Store] Product deleted:', productId);
        
        showToast('Product deleted successfully!', 'success');
        
        set((state) => ({
          products: state.products.filter(p => p.id !== productId),
          currentProduct: state.currentProduct?.id === productId 
            ? null 
            : state.currentProduct,
          isLoading: false,
          error: null,
        }));
      } else {
        throw new Error(response.data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('❌ [Product Store] Delete error:', error);
      const errorMessage = handleApiError(error, 'Failed to delete product');
      
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },
}), 
  {
      name: 'product-store', // localStorage key
      partialize: (state) => ({
        // choose which states to persist
        products: state.products,
        currentProduct: state.currentProduct,
        farmers: state.farmers,
        processors: state.processors,
      }),
    }
  )
);