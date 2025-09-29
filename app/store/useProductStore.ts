import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { 
  ApiResponse, 
  ProductDetails, 
  UserProducts, 
  UserProductsResponse 
} from '@/app/types';

// Request interfaces for the store (simplified DTOs)
export interface CreateProductRequest {
  name: string;
  cropId: string;
  quantity: string;
  quantityUnit: 'kilogram' | 'tonne';
  pricePerUnit: string;
  priceCurrency: string;
  harvestDate: string;
  locationAddress: string;
  photos: string[];
}

export interface UpdateProductRequest {
  productId: string;
  name: string;
  quantity: string;
  quantityUnit: string;
  pricePerUnit: string;
  priceCurrency: string;
  harvestDate: string;
  locationAddress: string;
}

// Internal request interfaces with action field
interface CreateProductApiRequest extends CreateProductRequest {
  action: 'create';
}

interface UpdateProductApiRequest extends UpdateProductRequest {
  action: 'update';
}

// Configure axios instance
const apiClient = axios.create({
  baseURL: '/api/products',
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

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔐 [Product Store] Token attached');
  } else {
    console.warn('⚠️ [Product Store] No token found');
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ [Product Store] API Response:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase()
    });
    return response;
  },
  (error) => {
    console.error('❌ [Product Store] API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

interface ProductState {
  // Use ProductDetails from types.ts - the source of truth
  products: ProductDetails[];
  currentProduct: ProductDetails | null;
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isFetching: boolean;
  
  // Error states
  error: string | null;
  createError: string | null;
  updateError: string | null;
  fetchError: string | null;
}

interface ProductActions {
  // CRUD operations - all return/use ProductDetails
  fetchUserProducts: (userId: string) => Promise<void>;
  fetchProduct: (productId: string) => Promise<void>;
  createProduct: (data: CreateProductRequest) => Promise<ProductDetails>;
  updateProduct: (data: UpdateProductRequest) => Promise<ProductDetails>;
  deleteProduct: (productId: string) => Promise<void>;
  
  // State management
  setCurrentProduct: (product: ProductDetails | null) => void;
  clearCurrentProduct: () => void;
  
  // Loading states
  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setFetching: (fetching: boolean) => void;
  
  // Error management
  setError: (error: string | null) => void;
  setCreateError: (error: string | null) => void;
  setUpdateError: (error: string | null) => void;
  setFetchError: (error: string | null) => void;
  clearErrors: () => void;
  
  // Reset
  reset: () => void;
}

type ProductStore = ProductState & ProductActions;

export const useProductStore = create<ProductStore>((set, get) => ({
  // Initial state
  products: [],
  currentProduct: null,
  
  // Loading states
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isFetching: false,
  
  // Error states
  error: null,
  createError: null,
  updateError: null,
  fetchError: null,

  // State setters
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
  
  clearErrors: () => set({
    error: null,
    createError: null,
    updateError: null,
    fetchError: null,
  }),

  reset: () => set({
    products: [],
    currentProduct: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isFetching: false,
    error: null,
    createError: null,
    updateError: null,
    fetchError: null,
  }),

  // Fetch user products
  fetchUserProducts: async (userId: string) => {
    const { setFetching, setFetchError } = get();
    setFetching(true);
    setFetchError(null);
    
    console.log('📥 [Product Store] Fetching products for user:', userId);
    
    try {
      // Your API route returns: ApiResponse<UserProducts>
      // UserProducts structure: { statusCode, message, data: ProductDetails[] }
      const response = await apiClient.get<ApiResponse<UserProducts>>(
        `?action=user-products&userId=${userId}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        // response.data = ApiResponse wrapper
        // response.data.data = UserProducts object
        // response.data.data.data = ProductDetails[]
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
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message 
        : 'Failed to fetch products';
      
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
      // Your API route returns: ApiResponse<ProductDetails>
      const response = await apiClient.get<ApiResponse<ProductDetails>>(
        `?action=single-product&productId=${productId}`
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
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message 
        : 'Failed to fetch product';
      
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

      // Backend returns single product wrapped in UserProductsResponse
      // UserProductsResponse: { statusCode, message, data: ProductDetails }
      const response = await apiClient.post<UserProductsResponse>('', requestData);
      
      if (response.data.statusCode === 201 && response.data.data) {
        const newProduct = response.data.data;
        console.log('✅ [Product Store] Product created:', newProduct.id);
        
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
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message 
        : 'Failed to create product';
      
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

      // Backend returns single product wrapped in UserProductsResponse
      // UserProductsResponse: { statusCode, message, data: ProductDetails }
      const response = await apiClient.patch<UserProductsResponse>('', requestData);
      
      if (response.data.statusCode === 200 && response.data.data) {
        const updatedProduct = response.data.data;
        console.log('✅ [Product Store] Product updated:', updatedProduct.id);
        
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
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message 
        : 'Failed to update product';
      
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
      const response = await apiClient.delete<ApiResponse>(`/${productId}`);
      
      if (response.data.statusCode === 200) {
        console.log('✅ [Product Store] Product deleted:', productId);
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
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || error.message 
        : 'Failed to delete product';
      
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },
}));