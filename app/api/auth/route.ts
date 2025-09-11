// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import {
  AuthApiRequest,
  ApiResponse,
  RegisterUserRequest,
  LoginUserRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  CropResponse,
  User,
  Tokens,
  QualityResponse,
  CertificationResponse
} from '@/app/types';

const baseUrl = process.env.BASE_URL || 'https://oko-agro-nestjs.onrender.com'

// Configure axios instance
const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Define refresh token request interface
interface RefreshTokenRequest {
  refreshToken: string;
}

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

// Update AuthApiRequest to include forgot and reset password actions
type ExtendedAuthApiRequest = AuthApiRequest | {
  action: 'refresh';
  refreshToken: string;
} | {
  action: 'forgot-password';
  email: string;
} | {
  action: 'reset-password';
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: ExtendedAuthApiRequest = await request.json();
    const { action, ...data } = body;

    let endpoint = '';
    let requestData: RegisterUserRequest | LoginUserRequest | VerifyOtpRequest | ResendOtpRequest | RefreshTokenRequest | ForgotPasswordRequest | ResetPasswordRequest;

    // Switch between different auth actions
    switch (action) {
      case 'register':
        endpoint = '/auth/register-user';
        requestData = data as RegisterUserRequest;
        break;
            
      case 'resend-otp':
        endpoint = '/auth/resend-otp';
        requestData = data as ResendOtpRequest;
        break;
            
      case 'verify-otp':
        endpoint = '/auth/verify-otp';
        requestData = data as VerifyOtpRequest;
        break;
            
      case 'login':
        endpoint = '/auth/login-user';
        requestData = data as LoginUserRequest;
        break;

      case 'refresh':
        endpoint = '/auth/refresh';
        requestData = data as RefreshTokenRequest;
        break;

      case 'forgot-password':
        endpoint = '/auth/forgot-password';
        requestData = data as ForgotPasswordRequest;
        break;

      case 'reset-password':
        endpoint = '/auth/reset-password';
        requestData = data as ResetPasswordRequest;
        break;
            
      default:
        return NextResponse.json(
          {
            statusCode: 400,
            message: 'Invalid action. Valid actions are: register, resend-otp, verify-otp, login, refresh, forgot-password, reset-password',
            error: 'Bad Request'
          } as ApiResponse,
          { status: 400 }
        );
    }

    // Make the API call to the backend using axios
    const response = await apiClient.post(endpoint, requestData);

    // For refresh token response, ensure we return the correct format
    if (action === 'refresh') {
      return NextResponse.json(
        {
          statusCode: 200,
          message: 'Token refreshed successfully',
          data: response.data // This should contain the new tokens
        } as ApiResponse<Tokens>,
        { status: 200 }
      );
    }

    // For forgot password and reset password, return standardized response
    if (action === 'forgot-password' || action === 'reset-password') {
      return NextResponse.json(
        {
          statusCode: 200,
          message: response.data.message || `${action} successful`,
          data: response.data.data || null
        } as ApiResponse,
        { status: 200 }
      );
    }

    // Return the response from the backend for other actions
    return NextResponse.json(response.data as ApiResponse, {
      status: response.status,
    });
  } catch (error) {
    console.error('Auth API Error:', error);
        
    // Handle axios errors
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Request failed';
            
      return NextResponse.json(
        {
          statusCode,
          message: errorMessage,
          error: error.response?.data?.error || 'Internal Server Error'
        } as ApiResponse,
        { status: statusCode }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error'
      } as ApiResponse,
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Handle different GET actions
    switch (action) {
      case 'profile':
        try {
          // Extract authorization header from the request
          const authHeader = request.headers.get('authorization');
          
          if (!authHeader) {
            return NextResponse.json(
              {
                statusCode: 401,
                message: 'Authorization header is required',
                error: 'Unauthorized'
              } as ApiResponse,
              { status: 401 }
            );
          }

          // Fetch user profile from the backend with authorization header
          const response = await apiClient.get<User>('/auth/profile', {
            headers: {
              'Authorization': authHeader
            }
          });
          
          return NextResponse.json(
            {
              statusCode: 200,
              message: 'Profile fetched successfully',
              data: response.data
            } as ApiResponse<User>,
            { status: 200 }
          );
        } catch (error) {
          console.error('Profile API Error:', error);
          
          if (error instanceof AxiosError) {
            const statusCode = error.response?.status || 500;
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch profile';
            
            return NextResponse.json(
              {
                statusCode,
                message: errorMessage,
                error: error.response?.data?.error || 'Internal Server Error'
              } as ApiResponse,
              { status: statusCode }
            );
          }
          
          throw error;
        }

      case 'crops':
        try {
          // Fetch crops from the backend
          const response = await apiClient.get<CropResponse[]>('/crops');
          
          return NextResponse.json(
            {
              statusCode: 200,
              message: 'Crops fetched successfully',
              data: response.data
            } as ApiResponse<CropResponse[]>,
            { status: 200 }
          );
        } catch (error) {
          console.error('Crops API Error:', error);
          
          if (error instanceof AxiosError) {
            const statusCode = error.response?.status || 500;
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch crops';
            
            return NextResponse.json(
              {
                statusCode,
                message: errorMessage,
                error: error.response?.data?.error || 'Internal Server Error'
              } as ApiResponse,
              { status: statusCode }
            );
          }
          
          throw error;
        }

      case 'quality-standards':
        try {
          // Fetch quality standards from the backend
          const response = await apiClient.get<QualityResponse[]>('/quality-standards');
          
          return NextResponse.json(
            {
              statusCode: 200,
              message: 'Quality standards fetched successfully',
              data: response.data
            } as ApiResponse<QualityResponse[]>,
            { status: 200 }
          );
        } catch (error) {
          console.error('Quality Standards API Error:', error);
          
          if (error instanceof AxiosError) {
            const statusCode = error.response?.status || 500;
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch quality standards';
            
            return NextResponse.json(
              {
                statusCode,
                message: errorMessage,
                error: error.response?.data?.error || 'Internal Server Error'
              } as ApiResponse,
              { status: statusCode }
            );
          }
          
          throw error;
        }

      case 'certifications':
        try {
          // Fetch certifications from the backend
          const response = await apiClient.get<CertificationResponse[]>('/certifications');
          
          return NextResponse.json(
            {
              statusCode: 200,
              message: 'Certifications fetched successfully',
              data: response.data
            } as ApiResponse<CertificationResponse[]>,
            { status: 200 }
          );
        } catch (error) {
          console.error('Certifications API Error:', error);
          
          if (error instanceof AxiosError) {
            const statusCode = error.response?.status || 500;
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch certifications';
            
            return NextResponse.json(
              {
                statusCode,
                message: errorMessage,
                error: error.response?.data?.error || 'Internal Server Error'
              } as ApiResponse,
              { status: statusCode }
            );
          }
          
          throw error;
        }

      case 'health-check':
      default:
        // Health check or default GET behavior
        const healthResponse = await apiClient.get('/auth/health-check').catch(() => null);
        
        return NextResponse.json(
          {
            statusCode: 200,
            message: 'API route is working',
            backendStatus: healthResponse ? 'connected' : 'disconnected'
          } as ApiResponse,
          { status: 200 }
        );
    }
  } catch (error) {
    console.error('GET API Error:', error);
    
    return NextResponse.json(
      {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error'
      } as ApiResponse,
      { status: 500 }
    );
  }
}