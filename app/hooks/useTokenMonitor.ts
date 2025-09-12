// hooks/useTokenMonitor.ts
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  exp: number;
  iat: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const useTokenMonitor = () => {
  const { tokens, refreshToken, logout, isAuthenticated } = useAuthStore();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleTokenRefresh = (accessToken: string) => {
    try {
      const decoded = jwtDecode<JWTPayload>(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      const expiryTime = decoded.exp;
      
      // Schedule refresh 1 minute before expiry (or immediately if already expired)
      const refreshTime = Math.max(0, (expiryTime - currentTime - 60) * 1000);
      
      console.log(`Token expires in ${expiryTime - currentTime} seconds, scheduling refresh in ${refreshTime / 1000} seconds`);
      
      // Clear any existing timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      refreshTimeoutRef.current = setTimeout(async () => {
        console.log('Attempting scheduled token refresh...');
        const success = await refreshToken();
        
        if (!success) {
          console.log('Token refresh failed, logging out user');
          logout();
        }
      }, refreshTime);
      
    } catch (error) {
      console.error('Error decoding token for refresh scheduling:', error);
      // If we can't decode the token, it's probably invalid
      logout();
    }
  };

  useEffect(() => {
    if (isAuthenticated && tokens?.accessToken) {
      scheduleTokenRefresh(tokens.accessToken);
    }

    // Cleanup timeout on unmount or when tokens change
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens?.accessToken, isAuthenticated]);

  // Cleanup on logout
  useEffect(() => {
    if (!isAuthenticated && refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }, [isAuthenticated]);
};