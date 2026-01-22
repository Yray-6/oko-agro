import axios, { AxiosError } from 'axios';
import Router from 'next/router'; // Since useRouter() is for components, use Router directly here.

let isRedirecting = false; // Avoid multiple redirects
let isRefreshing = false; // Prevent multiple refresh attempts

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Get token from localStorage
const getAuthToken = (): string | null => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;
    const authData = JSON.parse(authStorage);
    return authData?.state?.tokens?.accessToken || null;
  } catch (error) {
    console.error('Error parsing auth token:', error);
    return null;
  }
};

// Get refresh token from localStorage
const getRefreshToken = (): string | null => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;
    const authData = JSON.parse(authStorage);
    return authData?.state?.tokens?.refreshToken || null;
  } catch (error) {
    console.error('Error parsing refresh token:', error);
    return null;
  }
};

// Set Authorization header on each request
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally - attempt token refresh before logout
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalRequest = error.config as any;
    const status = error.response?.status;

    // Skip token refresh for auth actions (register, login, etc.)
    const requestData = originalRequest?.data ? (typeof originalRequest.data === 'string' ? JSON.parse(originalRequest.data) : originalRequest.data) : {};
    const isAuthAction = ['register', 'login', 'verify-otp', 'resend-otp', 'forgot-password', 'reset-password', 'refresh'].includes(requestData.action);

    if (status === 401 && typeof window !== 'undefined' && !isAuthAction) {
      // Check if we've already tried to refresh for this request
      if (originalRequest._retry) {
        // Already tried refresh, now logout
        if (!isRedirecting) {
          isRedirecting = true;
          console.warn('🔒 Token refresh failed. Logging out...');
          
          // Clear auth storage
          localStorage.removeItem('auth-storage');
          
          // Redirect to appropriate login page based on current route
          const currentPath = window.location.pathname;
          const loginPath = currentPath.startsWith('/admin') ? '/oko-admin' : '/login';
          
          try {
            await Router.push(loginPath);
          } catch (e) {
            console.error('Error redirecting to login:', e);
          } finally {
            isRedirecting = false;
          }
        }
        return Promise.reject(error);
      }

      // Mark request as retried
      originalRequest._retry = true;

      // Attempt to refresh token
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = getRefreshToken();
        
        if (refreshToken) {
          try {
            console.log('🔄 Attempting to refresh token...');
            
            // Call refresh endpoint
            const refreshResponse = await axios.post('/api/auth', {
              action: 'refresh',
              refreshToken: refreshToken
            }, {
              baseURL: typeof window !== 'undefined' ? window.location.origin : '',
              headers: {
                'Content-Type': 'application/json',
              }
            });

            if (refreshResponse.data?.statusCode === 200 && refreshResponse.data?.data?.accessToken) {
              const newAccessToken = refreshResponse.data.data.accessToken;
              
              // Update token in localStorage
              try {
                const authStorage = localStorage.getItem('auth-storage');
                if (authStorage) {
                  const authData = JSON.parse(authStorage);
                  authData.state.tokens = {
                    ...authData.state.tokens,
                    accessToken: newAccessToken
                  };
                  localStorage.setItem('auth-storage', JSON.stringify(authData));
                }
              } catch (e) {
                console.error('Error updating token in storage:', e);
              }

              // Update axios header
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              
              console.log('✅ Token refreshed successfully');
              isRefreshing = false;
              
              // Retry the original request with new token
              return apiClient(originalRequest);
            } else {
              throw new Error('Token refresh failed');
            }
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError);
            isRefreshing = false;
            
            // Refresh failed, logout
            if (!isRedirecting) {
              isRedirecting = true;
              localStorage.removeItem('auth-storage');
              
              const currentPath = window.location.pathname;
              const loginPath = currentPath.startsWith('/admin') ? '/oko-admin' : '/login';
              
              try {
                await Router.push(loginPath);
              } catch (e) {
                console.error('Error redirecting to login:', e);
              } finally {
                isRedirecting = false;
              }
            }
          }
        } else {
          // No refresh token available, logout
          isRefreshing = false;
          if (!isRedirecting) {
            isRedirecting = true;
            localStorage.removeItem('auth-storage');
            
            const currentPath = window.location.pathname;
            const loginPath = currentPath.startsWith('/admin') ? '/oko-admin' : '/login';
            
            try {
              await Router.push(loginPath);
            } catch (e) {
              console.error('Error redirecting to login:', e);
            } finally {
              isRedirecting = false;
            }
          }
        }
      } else {
        // Already refreshing, wait a bit and retry
        await new Promise(resolve => setTimeout(resolve, 100));
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
