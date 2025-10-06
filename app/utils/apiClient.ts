import axios, { AxiosError } from 'axios';
import Router from 'next/router'; // Since useRouter() is for components, use Router directly here.

let isRedirecting = false; // Avoid multiple redirects

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

// Set Authorization header on each request
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== 'undefined') {
      if (!isRedirecting) {
        isRedirecting = true;
        localStorage.clear();
        console.warn('🔒 Unauthorized. Redirecting to login...');

        try {
          await Router.push('/login'); // Or your login route
        } catch (e) {
          console.error('Error redirecting to login:', e);
        } finally {
          isRedirecting = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
