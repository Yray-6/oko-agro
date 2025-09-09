// stores/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios, { AxiosError } from 'axios';
import {
  AuthState,
  AuthActions,
  RegisterUserRequest,
  LoginUserRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  ApiResponse,
  RegisterUserResponse,
  LoginUserResponse,
  User,
  Tokens
} from '@/app/types';

// Configure axios instance for client-side requests
const apiClient = axios.create({
  baseURL: '/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      registrationUserId: null,

      // State management actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      setError: (error: string | null) => set({ error }),
      
      clearError: () => set({ error: null }),

      // Token management
      setTokens: (tokens: Tokens) => {
        set({ 
          tokens,
          isAuthenticated: true 
        });
        
        // Set axios default authorization header
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
      },

      clearTokens: () => {
        set({ 
          tokens: null,
          isAuthenticated: false 
        });
        
        // Remove axios default authorization header
        delete apiClient.defaults.headers.common['Authorization'];
      },

      // User management
      setUser: (user: User) => set({ user }),
      
      clearUser: () => set({ user: null }),

      // API actions
      register: async (data: RegisterUserRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          // Remove sensitive information from the request that will be stored
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, confirmPassword, ...safeData } = data;
          
          const response = await apiClient.post<ApiResponse<RegisterUserResponse>>('', {
            action: 'register',
            ...data // Send complete data to API
          });

          if (response.data.statusCode === 200 && response.data.data?.id) {
            set({ 
              registrationUserId: response.data.data.id,
              isLoading: false,
              error: null
            });
          } else {
            throw new Error(response.data.message || 'Registration failed');
          }
        } catch (error) {
          console.error('Registration error:', error);
          const errorMessage = error instanceof AxiosError 
            ? error.response?.data?.message || error.message 
            : 'Registration failed';
          
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          throw error;
        }
      },

      login: async (data: LoginUserRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.post<ApiResponse<LoginUserResponse>>('', {
            action: 'login',
            ...data
          });

          if (response.data.statusCode === 200 && response.data.data) {
            const { user, tokens } = response.data.data;
            
            // Store user and tokens (excluding sensitive info)
            set({ 
              user,
              tokens,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              registrationUserId: null // Clear after successful login
            });

            // Set axios default authorization header
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
          } else {
            throw new Error(response.data.message || 'Login failed');
          }
        } catch (error) {
          console.error('Login error:', error);
          const errorMessage = error instanceof AxiosError 
            ? error.response?.data?.message || error.message 
            : 'Login failed';
          
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          throw error;
        }
      },

      verifyOtp: async (data: VerifyOtpRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.post<ApiResponse>('', {
            action: 'verify-otp',
            ...data
          });

          if (response.data.statusCode === 200) {
            set({ 
              isLoading: false,
              error: null
            });
            
            // Update user verification status if user exists in state
            const { user } = get();
            if (user && user.id === data.userId) {
              set({
                user: {
                  ...user,
                  userVerified: true,
                  userVerificationOtp: null,
                  userVerificationOtpExpiryTime: null
                }
              });
            }
          } else {
            throw new Error(response.data.message || 'OTP verification failed');
          }
        } catch (error) {
          console.error('OTP verification error:', error);
          const errorMessage = error instanceof AxiosError 
            ? error.response?.data?.message || error.message 
            : 'OTP verification failed';
          
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          throw error;
        }
      },

      resendOtp: async (data: ResendOtpRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.post<ApiResponse>('', {
            action: 'resend-otp',
            ...data
          });

          if (response.data.statusCode === 200) {
            set({ 
              isLoading: false,
              error: null 
            });
          } else {
            throw new Error(response.data.message || 'Failed to resend OTP');
          }
        } catch (error) {
          console.error('Resend OTP error:', error);
          const errorMessage = error instanceof AxiosError 
            ? error.response?.data?.message || error.message 
            : 'Failed to resend OTP';
          
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        // Clear all auth data
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          registrationUserId: null
        });
        
        // Remove axios default authorization header
        delete apiClient.defaults.headers.common['Authorization'];
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Only persist non-sensitive data
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        registrationUserId: state.registrationUserId,
        // Don't persist: isLoading, error (these should be reset on page load)
      }),
    }
  )
);

// Initialize axios auth header on store creation if tokens exist
const { tokens } = useAuthStore.getState();
if (tokens?.accessToken) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
}