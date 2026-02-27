// stores/useAdminStore.ts
import { create } from 'zustand';
import { AxiosError } from 'axios';
import { AdminDashboardStats, UsersListResponse, UserListItem, ApiResponse, ProductDetails, BuyRequest, OngoingBuyRequestResponse, OrderState, CreateAdminRequest, CreateAdminResponse, UpdateUserStatusRequest, UpdateAdminPasswordRequest, InventoryItem, InventoriesListResponse, ProductInventoryLogsResponse, InventoryType } from '@/app/types';
import apiClient from '../utils/apiClient';

interface AdminState {
  // Dashboard stats
  dashboardStats: AdminDashboardStats | null;
  
  // Users data
  allUsers: UserListItem[];
  farmers: UserListItem[];
  processors: UserListItem[];
  admins: UserListItem[];
  
  // Pagination metadata
  usersMeta: {
    totalRecord: number;
    totalFarmerRecord: number;
    totalProcessorRecord: number;
    pageNumber: number;
    pageSize: number;
  } | null;
  
  adminsMeta: {
    totalRecord: number;
    pageNumber: number;
    pageSize: number;
  } | null;
  
  farmersMeta: {
    totalRecord: number;
    matchedRecord: number;
    pageNumber: number;
    pageSize: number;
  } | null;
  
  processorsMeta: {
    totalRecord: number;
    matchedRecord: number;
    pageNumber: number;
    pageSize: number;
  } | null;
  
  // Product listings
  productListings: ProductDetails[];
  productListingsMeta: {
    totalRecord: number;
    pageNumber: number;
    pageSize: number;
  } | null;
  
  // Ongoing buy requests
  ongoingBuyRequests: BuyRequest[];
  ongoingBuyRequestsMeta: {
    totalRecord: number;
    pageNumber: number;
    pageSize: number;
  } | null;
  
  // Inventories
  inventories: InventoryItem[];
  inventoriesMeta: {
    totalRecord: number;
    pageNumber: number;
    pageSize: number;
  } | null;
  productInventoryLogs: InventoryItem[];
  
  // Loading states
  isLoadingDashboard: boolean;
  isLoadingUsers: boolean;
  isLoadingFarmers: boolean;
  isLoadingProcessors: boolean;
  isLoadingAdmins: boolean;
  isLoadingProductListings: boolean;
  isApprovingProduct: boolean;
  isLoadingOngoingBuyRequests: boolean;
  isUpdatingOrderState: boolean;
  isLoadingInventories: boolean;
  isLoadingProductInventoryLogs: boolean;
  isCreatingAdmin: boolean;
  isUpdatingUserStatus: boolean;
  isUpdatingAdminPassword: boolean;
  isDeletingAdmin: boolean;
  
  // Error states
  dashboardError: string | null;
  usersError: string | null;
  farmersError: string | null;
  processorsError: string | null;
  adminsError: string | null;
  productListingsError: string | null;
  ongoingBuyRequestsError: string | null;
  inventoriesError: string | null;
  adminManagementError: string | null;
}

interface AdminActions {
  // Dashboard
  fetchDashboardStats: () => Promise<void>;
  
  // Users
  fetchAllUsers: (params?: { search?: string; pageNumber?: number; pageSize?: number }) => Promise<void>;
  fetchFarmers: (params?: { search?: string; pageNumber?: number; pageSize?: number }) => Promise<void>;
  fetchProcessors: (params?: { search?: string; pageNumber?: number; pageSize?: number }) => Promise<void>;
  fetchAdmins: (params?: { role?: string; pageNumber?: number; pageSize?: number }) => Promise<void>;
  
  // Product listings
  fetchProductListings: (params?: { search?: string; status?: string; pageNumber?: number; pageSize?: number }) => Promise<void>;
  approveOrRejectProduct: (productId: string, approvalStatus: 'approve' | 'reject') => Promise<void>;
  
  // Ongoing buy requests
  fetchOngoingBuyRequests: (params?: { search?: string; state?: string; pageNumber?: number; pageSize?: number }) => Promise<void>;
  updateOrderState: (buyRequestId: string, orderState: OrderState) => Promise<void>;
  
  // Inventories
  fetchInventories: (params?: { search?: string; type?: InventoryType | ''; pageNumber?: number; pageSize?: number }) => Promise<void>;
  fetchProductInventoryLogs: (productId: string) => Promise<void>;
  
  // Admin management
  createAdmin: (data: CreateAdminRequest) => Promise<CreateAdminResponse>;
  updateUserStatus: (data: UpdateUserStatusRequest) => Promise<void>;
  updateAdminPassword: (data: UpdateAdminPasswordRequest) => Promise<void>;
  deleteAdmin: (userId: string) => Promise<void>;
  
  // Clear methods
  clearDashboardError: () => void;
  clearUsersError: () => void;
  clearFarmersError: () => void;
  clearProcessorsError: () => void;
  clearAdminsError: () => void;
  clearProductListingsError: () => void;
  clearOngoingBuyRequestsError: () => void;
  clearInventoriesError: () => void;
  clearAdminManagementError: () => void;
  clearAllErrors: () => void;
  
  // Reset methods
  resetDashboard: () => void;
  resetUsers: () => void;
  resetFarmers: () => void;
  resetProcessors: () => void;
  resetAdmins: () => void;
  resetProductListings: () => void;
  resetOngoingBuyRequests: () => void;
  resetInventories: () => void;
  resetAll: () => void;
}

type AdminStore = AdminState & AdminActions;

export const useAdminStore = create<AdminStore>((set, get) => ({
  // Initial state
  dashboardStats: null,
  allUsers: [],
  farmers: [],
  processors: [],
  admins: [],
  usersMeta: null,
  farmersMeta: null,
  processorsMeta: null,
  adminsMeta: null,
  productListings: [],
  productListingsMeta: null,
  ongoingBuyRequests: [],
  ongoingBuyRequestsMeta: null,
  inventories: [],
  inventoriesMeta: null,
  productInventoryLogs: [],
  
  // Loading states
  isLoadingDashboard: false,
  isLoadingUsers: false,
  isLoadingFarmers: false,
  isLoadingProcessors: false,
  isLoadingAdmins: false,
  isLoadingProductListings: false,
  isApprovingProduct: false,
  isLoadingOngoingBuyRequests: false,
  isUpdatingOrderState: false,
  isLoadingInventories: false,
  isLoadingProductInventoryLogs: false,
  isCreatingAdmin: false,
  isUpdatingUserStatus: false,
  isUpdatingAdminPassword: false,
  isDeletingAdmin: false,
  
  // Error states
  dashboardError: null,
  usersError: null,
  farmersError: null,
  processorsError: null,
  adminsError: null,
  productListingsError: null,
  ongoingBuyRequestsError: null,
  inventoriesError: null,
  adminManagementError: null,

  // Fetch dashboard stats
  fetchDashboardStats: async () => {
    set({ isLoadingDashboard: true, dashboardError: null });
    try {
      const response = await apiClient.get<ApiResponse<AdminDashboardStats>>(
        '/admin?action=dashboard-overview'
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        set({ 
          dashboardStats: response.data.data as AdminDashboardStats,
          isLoadingDashboard: false 
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch dashboard stats');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : 'Failed to fetch dashboard stats';
      set({ 
        dashboardError: errorMessage,
        isLoadingDashboard: false 
      });
      console.error('Error fetching dashboard stats:', error);
    }
  },

  // Fetch all users
  fetchAllUsers: async (params = {}) => {
    set({ isLoadingUsers: true, usersError: null });
    try {
      const { search = '', pageNumber = 1, pageSize = 20 } = params;
      const queryParams = new URLSearchParams({
        action: 'all-users',
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) {
        queryParams.append('search', search);
      }
      
      const response = await apiClient.get<UsersListResponse>(
        `/users?${queryParams.toString()}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        set({ 
          allUsers: response.data.data.items,
          usersMeta: {
            totalRecord: response.data.data.totalRecord,
            totalFarmerRecord: response.data.data.totalFarmerRecord || 0,
            totalProcessorRecord: response.data.data.totalProcessorRecord || 0,
            pageNumber: response.data.data.pageNumber,
            pageSize: response.data.data.pageSize,
          },
          isLoadingUsers: false 
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : 'Failed to fetch users';
      set({ 
        usersError: errorMessage,
        isLoadingUsers: false 
      });
      console.error('Error fetching users:', error);
    }
  },

  // Fetch farmers
  fetchFarmers: async (params = {}) => {
    set({ isLoadingFarmers: true, farmersError: null });
    try {
      const { search = '', pageNumber = 1, pageSize = 20 } = params;
      const queryParams = new URLSearchParams({
        action: 'farmers',
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) {
        queryParams.append('search', search);
      }
      
      const response = await apiClient.get<UsersListResponse>(
        `/users?${queryParams.toString()}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        set({ 
          farmers: response.data.data.items,
          farmersMeta: {
            totalRecord: response.data.data.totalRecord,
            matchedRecord: response.data.data.matchedRecord || 0,
            pageNumber: response.data.data.pageNumber,
            pageSize: response.data.data.pageSize,
          },
          isLoadingFarmers: false 
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch farmers');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : 'Failed to fetch farmers';
      set({ 
        farmersError: errorMessage,
        isLoadingFarmers: false 
      });
      console.error('Error fetching farmers:', error);
    }
  },

  // Fetch processors
  fetchProcessors: async (params = {}) => {
    set({ isLoadingProcessors: true, processorsError: null });
    try {
      const { search = '', pageNumber = 1, pageSize = 20 } = params;
      const queryParams = new URLSearchParams({
        action: 'processors',
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) {
        queryParams.append('search', search);
      }
      
      const response = await apiClient.get<UsersListResponse>(
        `/users?${queryParams.toString()}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        set({ 
          processors: response.data.data.items,
          processorsMeta: {
            totalRecord: response.data.data.totalRecord,
            matchedRecord: response.data.data.matchedRecord || 0,
            pageNumber: response.data.data.pageNumber,
            pageSize: response.data.data.pageSize,
          },
          isLoadingProcessors: false 
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch processors');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : 'Failed to fetch processors';
      set({ 
        processorsError: errorMessage,
        isLoadingProcessors: false 
      });
      console.error('Error fetching processors:', error);
    }
  },

  // Fetch admins
  fetchAdmins: async (params = {}) => {
    set({ isLoadingAdmins: true, adminsError: null });
    try {
      const { role = 'admin', pageNumber = 1, pageSize = 20 } = params;
      const queryParams = new URLSearchParams({
        action: 'all-admins',
        role: role,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });
      
      const response = await apiClient.get<UsersListResponse>(
        `/admin?${queryParams.toString()}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        set({ 
          admins: response.data.data.items,
          adminsMeta: {
            totalRecord: response.data.data.totalRecord,
            pageNumber: response.data.data.pageNumber,
            pageSize: response.data.data.pageSize,
          },
          isLoadingAdmins: false 
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch admins');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : 'Failed to fetch admins';
      set({ 
        adminsError: errorMessage,
        isLoadingAdmins: false 
      });
      console.error('Error fetching admins:', error);
    }
  },

  // Fetch product listings
  fetchProductListings: async (params = {}) => {
    set({ isLoadingProductListings: true, productListingsError: null });
    try {
      const { search = '', status = '', pageNumber = 1, pageSize = 20 } = params;
      const queryParams = new URLSearchParams({
        action: 'listings',
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) {
        queryParams.append('search', search);
      }
      if (status) {
        queryParams.append('status', status);
      }
      
      const response = await apiClient.get<ApiResponse<{
        items: ProductDetails[];
        totalRecord: number;
        pageNumber: number;
        pageSize: number;
      }>>(`/products?${queryParams.toString()}`);
      
      if (response.data.statusCode === 200 && response.data.data) {
        set({ 
          productListings: response.data.data.items || [],
          productListingsMeta: {
            totalRecord: response.data.data.totalRecord || 0,
            pageNumber: response.data.data.pageNumber || 1,
            pageSize: response.data.data.pageSize || 20,
          },
          isLoadingProductListings: false 
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch product listings');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : 'Failed to fetch product listings';
      set({ 
        productListingsError: errorMessage,
        isLoadingProductListings: false 
      });
      console.error('Error fetching product listings:', error);
    }
  },

  // Approve or reject product
  approveOrRejectProduct: async (productId: string, approvalStatus: 'approve' | 'reject') => {
    set({ isApprovingProduct: true, productListingsError: null });
    try {
      console.log('🔐 [Admin Store] Approving/Rejecting product:', {
        productId,
        approvalStatus,
        timestamp: new Date().toISOString()
      });

      const response = await apiClient.patch<ApiResponse>(
        '/products',
        {
          action: 'approval',
          productId,
          approvalStatus,
        }
      );
      
      if (response.data.statusCode === 200) {
        console.log('✅ [Admin Store] Product approval/rejection successful');
        // Refresh product listings after approval/rejection
        const currentMeta = get().productListingsMeta;
        if (currentMeta) {
          await get().fetchProductListings({
            status: 'pending',
            pageNumber: currentMeta.pageNumber,
            pageSize: currentMeta.pageSize,
          });
        }
        set({ isApprovingProduct: false });
      } else {
        throw new Error(response.data.message || 'Failed to approve/reject product');
      }
    } catch (error) {
      console.error('❌ [Admin Store] Approve/Reject Error:', error);
      
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.message || error.message;
        
        // Provide more specific error messages
        if (statusCode === 403) {
          console.error('🚫 [Admin Store] Permission denied. User may not have admin role.');
          set({ 
            productListingsError: 'You do not have permission to approve/reject products. Please ensure you are logged in as an admin user.',
            isApprovingProduct: false 
          });
        } else {
          set({ 
            productListingsError: errorMessage || 'Failed to approve/reject product',
            isApprovingProduct: false 
          });
        }
      } else {
        set({ 
          productListingsError: error instanceof Error ? error.message : 'Failed to approve/reject product',
          isApprovingProduct: false 
        });
      }
      console.error('Error approving/rejecting product:', error);
      throw error;
    }
  },

  // Fetch ongoing buy requests
  fetchOngoingBuyRequests: async (params = {}) => {
    set({ isLoadingOngoingBuyRequests: true, ongoingBuyRequestsError: null });
    try {
      const { search = '', state = '', pageNumber = 1, pageSize = 20 } = params;
      const queryParams = new URLSearchParams({
        action: 'ongoing-buyrequest',
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) {
        queryParams.append('search', search);
      }
      if (state) {
        queryParams.append('state', state);
      }
      
      const response = await apiClient.get<OngoingBuyRequestResponse>(
        `/requests?${queryParams.toString()}`
      );
      
      if (response.data.statusCode === 200 && response.data.data) {
        set({ 
          ongoingBuyRequests: response.data.data.items || [],
          ongoingBuyRequestsMeta: {
            totalRecord: response.data.data.totalRecord || 0,
            pageNumber: response.data.data.pageNumber || 1,
            pageSize: response.data.data.pageSize || 20,
          },
          isLoadingOngoingBuyRequests: false 
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch ongoing buy requests');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : 'Failed to fetch ongoing buy requests';
      set({ 
        ongoingBuyRequestsError: errorMessage,
        isLoadingOngoingBuyRequests: false 
      });
      console.error('Error fetching ongoing buy requests:', error);
    }
  },

  // Update order state
  updateOrderState: async (buyRequestId: string, orderState: OrderState) => {
    set({ isUpdatingOrderState: true, ongoingBuyRequestsError: null });
    try {
      const response = await apiClient.put<ApiResponse>(
        '/requests',
        {
          action: 'update-order-state',
          buyRequestId,
          orderState,
        }
      );
      
      if (response.data.statusCode === 200) {
        // Refresh ongoing buy requests after update
        const currentMeta = get().ongoingBuyRequestsMeta;
        if (currentMeta) {
          await get().fetchOngoingBuyRequests({
            pageNumber: currentMeta.pageNumber,
            pageSize: currentMeta.pageSize,
          });
        }
        set({ isUpdatingOrderState: false });
      } else {
        throw new Error(response.data.message || 'Failed to update order state');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : 'Failed to update order state';
      set({ 
        ongoingBuyRequestsError: errorMessage,
        isUpdatingOrderState: false 
      });
      console.error('Error updating order state:', error);
      throw error;
    }
  },

  // Fetch inventories
  fetchInventories: async (params = {}) => {
    set({ isLoadingInventories: true, inventoriesError: null });
    try {
      const { search = '', type = '', pageNumber = 1, pageSize = 20 } = params;
      const queryParams = new URLSearchParams({
        action: 'inventories',
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) queryParams.append('search', search);
      if (type) queryParams.append('type', type);

      const response = await apiClient.get<InventoriesListResponse>(
        `/admin?${queryParams.toString()}`
      );

      if (response.data.statusCode === 200 && response.data.data) {
        set({
          inventories: response.data.data.items || [],
          inventoriesMeta: {
            totalRecord: response.data.data.totalRecord || 0,
            pageNumber: response.data.data.pageNumber || 1,
            pageSize: response.data.data.pageSize || 20,
          },
          isLoadingInventories: false,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch inventories');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : 'Failed to fetch inventories';
      set({
        inventoriesError: errorMessage,
        isLoadingInventories: false,
      });
      console.error('Error fetching inventories:', error);
    }
  },

  // Fetch product inventory logs
  fetchProductInventoryLogs: async (productId: string) => {
    set({ isLoadingProductInventoryLogs: true, inventoriesError: null });
    try {
      const queryParams = new URLSearchParams({
        action: 'product-inventory-logs',
        productId,
      });

      const response = await apiClient.get<ProductInventoryLogsResponse>(
        `/admin?${queryParams.toString()}`
      );

      if (response.data.statusCode === 200 && response.data.data) {
        set({
          productInventoryLogs: response.data.data || [],
          isLoadingProductInventoryLogs: false,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch product inventory logs');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : 'Failed to fetch product inventory logs';
      set({
        inventoriesError: errorMessage,
        isLoadingProductInventoryLogs: false,
      });
      console.error('Error fetching product inventory logs:', error);
    }
  },

  // Create admin user
  createAdmin: async (data: CreateAdminRequest) => {
    set({ isCreatingAdmin: true, adminManagementError: null });
    try {
      const response = await apiClient.post<CreateAdminResponse>('/admin', data);
      
      if (response.data.statusCode === 201) {
        set({ isCreatingAdmin: false });
        // Refresh admins list after creating a new admin
        const currentMeta = get().adminsMeta;
        if (currentMeta) {
          await get().fetchAdmins({
            role: 'admin',
            pageNumber: currentMeta.pageNumber,
            pageSize: currentMeta.pageSize,
          });
        } else {
          await get().fetchAdmins({
            role: 'admin',
            pageNumber: 1,
            pageSize: 20,
          });
        }
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to create admin');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : 'Failed to create admin';
      set({ 
        adminManagementError: errorMessage,
        isCreatingAdmin: false 
      });
      console.error('Error creating admin:', error);
      throw error;
    }
  },

  // Update user status
  updateUserStatus: async (data: UpdateUserStatusRequest) => {
    set({ isUpdatingUserStatus: true, adminManagementError: null });
    try {
      const response = await apiClient.patch<ApiResponse>(
        '/admin?action=update-status',
        data
      );
      
      if (response.data.statusCode === 200) {
        set({ isUpdatingUserStatus: false });
      } else {
        throw new Error(response.data.message || 'Failed to update user status');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : 'Failed to update user status';
      set({ 
        adminManagementError: errorMessage,
        isUpdatingUserStatus: false 
      });
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  // Update admin password
  updateAdminPassword: async (data: UpdateAdminPasswordRequest) => {
    set({ isUpdatingAdminPassword: true, adminManagementError: null });
    try {
      const response = await apiClient.patch<ApiResponse>(
        '/admin?action=update-admin-password',
        data
      );
      
      if (response.data.statusCode === 200) {
        set({ isUpdatingAdminPassword: false });
      } else {
        throw new Error(response.data.message || 'Failed to update admin password');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : 'Failed to update admin password';
      set({ 
        adminManagementError: errorMessage,
        isUpdatingAdminPassword: false 
      });
      console.error('Error updating admin password:', error);
      throw error;
    }
  },

  // Delete admin user
  deleteAdmin: async (userId: string) => {
    set({ isDeletingAdmin: true, adminManagementError: null });
    try {
      const response = await apiClient.delete<ApiResponse>(
        `/admin?userId=${userId}`
      );
      
      if (response.data.statusCode === 200) {
        set({ isDeletingAdmin: false });
        // Refresh admins list after deleting
        const currentMeta = get().adminsMeta;
        if (currentMeta) {
          await get().fetchAdmins({
            role: 'admin',
            pageNumber: currentMeta.pageNumber,
            pageSize: currentMeta.pageSize,
          });
        } else {
          await get().fetchAdmins({
            role: 'admin',
            pageNumber: 1,
            pageSize: 20,
          });
        }
      } else {
        throw new Error(response.data.message || 'Failed to delete admin');
      }
    } catch (error) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : 'Failed to delete admin';
      set({ 
        adminManagementError: errorMessage,
        isDeletingAdmin: false 
      });
      console.error('Error deleting admin:', error);
      throw error;
    }
  },

  // Clear error methods
  clearDashboardError: () => set({ dashboardError: null }),
  clearUsersError: () => set({ usersError: null }),
  clearFarmersError: () => set({ farmersError: null }),
  clearProcessorsError: () => set({ processorsError: null }),
  clearAdminsError: () => set({ adminsError: null }),
  clearProductListingsError: () => set({ productListingsError: null }),
  clearOngoingBuyRequestsError: () => set({ ongoingBuyRequestsError: null }),
  clearInventoriesError: () => set({ inventoriesError: null }),
  clearAdminManagementError: () => set({ adminManagementError: null }),
  clearAllErrors: () => set({ 
    dashboardError: null,
    usersError: null,
    farmersError: null,
    processorsError: null,
    adminsError: null,
    productListingsError: null,
    ongoingBuyRequestsError: null,
    inventoriesError: null,
    adminManagementError: null,
  }),

  // Reset methods
  resetDashboard: () => set({ dashboardStats: null, dashboardError: null }),
  resetUsers: () => set({ allUsers: [], usersMeta: null, usersError: null }),
  resetFarmers: () => set({ farmers: [], farmersMeta: null, farmersError: null }),
  resetProcessors: () => set({ processors: [], processorsMeta: null, processorsError: null }),
  resetAdmins: () => set({ admins: [], adminsMeta: null, adminsError: null }),
  resetProductListings: () => set({ productListings: [], productListingsMeta: null, productListingsError: null }),
  resetOngoingBuyRequests: () => set({ ongoingBuyRequests: [], ongoingBuyRequestsMeta: null, ongoingBuyRequestsError: null }),
  resetInventories: () => set({ inventories: [], inventoriesMeta: null, productInventoryLogs: [], inventoriesError: null }),
  resetAll: () => set({
    dashboardStats: null,
    allUsers: [],
    farmers: [],
    processors: [],
    admins: [],
    usersMeta: null,
    farmersMeta: null,
    processorsMeta: null,
    adminsMeta: null,
    productListings: [],
    productListingsMeta: null,
    ongoingBuyRequests: [],
    ongoingBuyRequestsMeta: null,
    inventories: [],
    inventoriesMeta: null,
    productInventoryLogs: [],
    dashboardError: null,
    usersError: null,
    farmersError: null,
    processorsError: null,
    adminsError: null,
    productListingsError: null,
    ongoingBuyRequestsError: null,
    inventoriesError: null,
    adminManagementError: null,
  }),
}));

