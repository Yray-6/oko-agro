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
  timeout: 180000, // 180 seconds (3 minutes) to match server timeout for large file uploads
});

// Define forgot password request interface
interface ForgotPasswordRequest {
  email: string;
}

// Define reset password request interface
interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

// Extend AuthActions to include forgot and reset password
interface ExtendedAuthActions extends AuthActions {
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
}

type AuthStore = AuthState & ExtendedAuthActions & {
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  refreshToken: () => Promise<boolean>;
};

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

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
      hasHydrated: false,

      // Hydration management
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

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

      // Refresh token function
      refreshToken: async () => {
        // Prevent multiple simultaneous refresh attempts
        if (isRefreshing && refreshPromise) {
          return await refreshPromise;
        }

        const { tokens } = get();
        
        if (!tokens?.refreshToken) {
          console.warn('No refresh token available');
          return false;
        }

        isRefreshing = true;
        refreshPromise = (async () => {
          try {
            console.log('Attempting to refresh token...');
            
            const response = await apiClient.post<ApiResponse<{ accessToken: string }>>('', {
              action: 'refresh',
              refreshToken: tokens.refreshToken
            });

            if (response.data.statusCode === 200 && response.data.data?.accessToken) {
              const newAccessToken = response.data.data.accessToken;
              
              // Update tokens in store - keep the existing refresh token, update access token
              const updatedTokens: Tokens = {
                accessToken: newAccessToken,
                refreshToken: tokens.refreshToken // Keep the existing refresh token
              };
              
              set({ 
                tokens: updatedTokens,
                isAuthenticated: true,
                error: null
              });

              // Update axios header
              apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              
              console.log('Token refreshed successfully');
              return true;
            } else {
              throw new Error(response.data.message || 'Token refresh failed');
            }
          } catch (error) {
            console.error('Token refresh failed:', error);
            
            // Clear auth state on refresh failure
            set({
              user: null,
              tokens: null,
              isAuthenticated: false,
              error: 'Session expired. Please login again.'
            });
            
            delete apiClient.defaults.headers.common['Authorization'];
            return false;
          } finally {
            isRefreshing = false;
            refreshPromise = null;
          }
        })();

        return await refreshPromise;
      },

      // API actions
      register: async (data: RegisterUserRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('📤 Starting registration request...');
          
          // Log the payload being sent (sanitize sensitive data)
          const sanitizedPayload = {
            action: 'register',
            ...data,
            password: '[HIDDEN]',
            confirmPassword: '[HIDDEN]',
            userPhoto: 'userPhoto' in data && data.userPhoto ? `[Base64 - ${data.userPhoto.length} chars]` : undefined,
            farmPhoto: 'farmPhoto' in data && data.farmPhoto ? `[Base64 - ${data.farmPhoto.length} chars]` : undefined,
          };
          console.log('📤 Register payload being sent to API route:', JSON.stringify(sanitizedPayload, null, 2));
          
          const response = await apiClient.post<ApiResponse<RegisterUserResponse>>('', {
            action: 'register',
            ...data
          });

          // Accept both 200 and 201 status codes (201 is standard for creation)
          if ((response.data.statusCode === 200 || response.data.statusCode === 201) && response.data.data?.id) {
            console.log('✅ Registration successful, user ID:', response.data.data.id);
            set({ 
              registrationUserId: response.data.data.id,
              isLoading: false,
              error: null
            });
          } else {
            throw new Error(response.data.message || 'Registration failed');
          }
        } catch (error) {
          console.error('❌ Registration error:', error);
          
          let errorMessage = 'Registration failed. Please try again.';
          
          if (error instanceof AxiosError) {
            // Use the error message from the server (which now has user-friendly messages)
            errorMessage = error.response?.data?.message || error.message;
            
            // Provide additional context for specific errors
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
              errorMessage = 'Registration timed out. This may happen with large file uploads. Please try again or reduce file sizes (max 10MB per file).';
            } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
              errorMessage = 'Network error. Please check your internet connection and try again.';
            } else if (error.response?.status === 413) {
              errorMessage = 'File size too large. Please reduce file sizes (max 10MB per file) and try again.';
            } else if (error.response?.status === 400) {
              errorMessage = error.response?.data?.message || 'Invalid registration data. Please check all fields and try again.';
            } else if (error.response?.status === 409) {
              errorMessage = 'An account with this email already exists. Please use a different email or try logging in.';
            } else if (error.response?.status === 500) {
              errorMessage = 'Server error during registration. Please try again later.';
            }
          }
          
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
            
            // Store tokens and minimal user data from login
            set({ 
              user, // Store whatever user data comes from login
              tokens,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              registrationUserId: null
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

      // Forgot password function
      forgotPassword: async (data: ForgotPasswordRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.post<ApiResponse>('', {
            action: 'forgot-password',
            ...data
          });

          if (response.data.statusCode === 200) {
            set({ 
              isLoading: false,
              error: null
            });
            
            // Return success - the email will contain the reset token
            console.log('Password reset email sent successfully');
          } else {
            throw new Error(response.data.message || 'Failed to send password reset email');
          }
        } catch (error) {
          console.error('Forgot password error:', error);
          const errorMessage = error instanceof AxiosError 
            ? error.response?.data?.message || error.message 
            : 'Failed to send password reset email';
          
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          throw error;
        }
      },

      // Reset password function
      resetPassword: async (data: ResetPasswordRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.post<ApiResponse>('', {
            action: 'reset-password',
            ...data
          });

          if (response.data.statusCode === 200) {
            set({ 
              isLoading: false,
              error: null
            });
            
            console.log('Password reset successful');
          } else {
            throw new Error(response.data.message || 'Password reset failed');
          }
        } catch (error) {
          console.error('Reset password error:', error);
          const errorMessage = error instanceof AxiosError 
            ? error.response?.data?.message || error.message 
            : 'Password reset failed';
          
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          throw error;
        }
      },

      // Profile fetch function - simplified logic
      fetchProfile: async () => {
        const { tokens, isLoading } = get();
        
        // Don't fetch if already loading or no token
        if (isLoading || !tokens?.accessToken) {
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.get<ApiResponse<User>>('?action=profile');

          if (response.data.statusCode === 200 && response.data.data) {
            set({ 
              user: response.data.data,
              isLoading: false,
              error: null
            });
            return response.data.data;
          } else {
            throw new Error(response.data.message || 'Failed to fetch profile');
          }
        } catch (error) {
          console.error('Profile fetch error:', error);
          const errorMessage = error instanceof AxiosError 
            ? error.response?.data?.message || error.message 
            : 'Failed to fetch profile';
          
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
        // Don't persist: isLoading, error, hasHydrated
      }),
      onRehydrateStorage: () => (state) => {
        // Set hydration flag and restore axios header
        if (state) {
          state.setHasHydrated(true);
          if (state.tokens?.accessToken) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${state.tokens.accessToken}`;
          }
        }
      },
    }
  )
);

// Note: Token refresh and 401 handling is now managed by the apiClient interceptor
// in app/utils/apiClient.ts to ensure consistent behavior across the app
// and proper logout on refresh failure