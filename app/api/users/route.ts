// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import https from 'https';
import { ApiResponse } from '@/app/types';

const baseUrl = process.env.BASE_URL || 'https://oko-agro-nestjs.onrender.com';

// Create HTTPS agent with proper SSL configuration
// This fixes SSL/TLS "bad record mac" errors that can occur due to connection reuse issues
const httpsAgent = new https.Agent({
  keepAlive: false, // Disable keep-alive to avoid SSL session reuse issues
  maxSockets: Infinity,
  maxFreeSockets: 256,
  timeout: 30000,
  // Reject unauthorized certificates for security
  rejectUnauthorized: true,
});

// Configure axios instance
const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  httpsAgent: httpsAgent,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const search = searchParams.get('search') || '';
    const pageNumber = searchParams.get('pageNumber') || '1';
    const pageSize = searchParams.get('pageSize') || '20';

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

    // Handle single user fetch by ID
    if (userId) {
      const endpoint = `/users/${userId}`;
      const response = await apiClient.get(endpoint, {
        headers: {
          'Authorization': authHeader
        }
      });

      return NextResponse.json(response.data as ApiResponse, {
        status: response.status,
      });
    }

    let endpoint = '';
    const queryParams = new URLSearchParams();
    
    if (search) {
      queryParams.append('search', search);
    }
    queryParams.append('pageNumber', pageNumber);
    queryParams.append('pageSize', pageSize);

    switch (action) {
      case 'all-users':
        endpoint = `/users/all-users?${queryParams.toString()}`;
        break;

      case 'farmers':
        endpoint = `/users/farmers?${queryParams.toString()}`;
        break;

      case 'processors':
        endpoint = `/users/processors?${queryParams.toString()}`;
        break;

      default:
        return NextResponse.json(
          {
            statusCode: 400,
            message: 'Invalid action. Valid actions are: all-users, farmers, processors, or provide userId',
            error: 'Bad Request'
          } as ApiResponse,
          { status: 400 }
        );
    }

    // Make the API call to the backend
    const response = await apiClient.get(endpoint, {
      headers: {
        'Authorization': authHeader
      }
    });

    return NextResponse.json(response.data as ApiResponse, {
      status: response.status,
    });
  } catch (error) {
    console.error('Users API Error:', error);
        
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

