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
  CropResponse
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

export async function POST(request: NextRequest) {
  try {
    const body: AuthApiRequest = await request.json();
    const { action, ...data } = body;

    let endpoint = '';
    let requestData: RegisterUserRequest | LoginUserRequest | VerifyOtpRequest | ResendOtpRequest;

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
            
      default:
        return NextResponse.json(
          {
            statusCode: 400,
            message: 'Invalid action. Valid actions are: register, resend-otp, verify-otp, login',
            error: 'Bad Request'
          } as ApiResponse,
          { status: 400 }
        );
    }

    // Make the API call to the backend using axios
    const response = await apiClient.post(endpoint, requestData);

    // Return the response from the backend
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