import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

let isRedirecting = false;
let refreshPromise: Promise<string> | null = null;

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

type RetryableRequest = AxiosRequestConfig & { _retry?: boolean };

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

const extractAccessToken = (payload: unknown): string | null => {
  if (!payload || typeof payload !== 'object') return null;
  const body = payload as {
    statusCode?: number;
    data?: { accessToken?: string; data?: { accessToken?: string } };
    accessToken?: string;
  };

  if (body.data?.accessToken) return body.data.accessToken;
  // Safety net for a nested double-wrapped shape
  if (body.data?.data?.accessToken) return body.data.data.accessToken;
  if (body.accessToken) return body.accessToken;
  return null;
};

const forceLogout = () => {
  if (typeof window === 'undefined' || isRedirecting) return;

  isRedirecting = true;
  console.warn('🔒 Token refresh failed. Logging out...');

  try {
    useAuthStore.getState().logout();
  } catch {
    localStorage.removeItem('auth-storage');
  }

  const currentPath = window.location.pathname;
  const loginPath = currentPath.startsWith('/admin') || currentPath.startsWith('/oko-admin')
    ? '/oko-admin'
    : '/login';

  window.location.assign(loginPath);
};

const refreshAccessToken = async (): Promise<string> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    console.log('🔄 Attempting to refresh token...');

    const refreshResponse = await axios.post(
      '/api/auth',
      {
        action: 'refresh',
        refreshToken,
      },
      {
        baseURL: typeof window !== 'undefined' ? window.location.origin : '',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const newAccessToken = extractAccessToken(refreshResponse.data);
    if (!newAccessToken || refreshResponse.data?.statusCode !== 200) {
      throw new Error(refreshResponse.data?.message || 'Token refresh failed');
    }

    const existingRefreshToken =
      useAuthStore.getState().tokens?.refreshToken || refreshToken;

    useAuthStore.getState().setTokens({
      accessToken: newAccessToken,
      refreshToken: existingRefreshToken,
    });

    console.log('✅ Token refreshed successfully');
    return newAccessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    const status = error.response?.status;

    if (!originalRequest || typeof window === 'undefined') {
      return Promise.reject(error);
    }

    const requestData = originalRequest.data
      ? typeof originalRequest.data === 'string'
        ? JSON.parse(originalRequest.data)
        : originalRequest.data
      : {};
    const isAuthAction = [
      'register',
      'login',
      'verify-otp',
      'resend-otp',
      'forgot-password',
      'reset-password',
      'refresh',
    ].includes(requestData.action);

    if (status !== 401 || isAuthAction) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      forceLogout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      console.error('❌ Token refresh failed:', refreshError);
      forceLogout();
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
