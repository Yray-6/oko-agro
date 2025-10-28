/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/requests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/app/types';

const baseUrl = process.env.BASE_URL || 'https://oko-agro-nestjs.onrender.com';

// Configure axios instance
const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 [Buy Requests API] Outgoing Request:', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      headers: {
        ...config.headers,
        Authorization: config.headers?.Authorization ? '[PRESENT]' : '[MISSING]'
      },
      dataSize: config.data ? JSON.stringify(config.data).length : 0
    });
    return config;
  },
  (error) => {
    console.error('❌ [Buy Requests API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ [Buy Requests API] Response Success:', {
      status: response.status,
      statusText: response.statusText,
      dataType: typeof response.data,
      dataSize: response.data ? JSON.stringify(response.data).length : 0
    });
    return response;
  },
  (error) => {
    console.error('❌ [Buy Requests API] Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Extract auth token from request
const extractAuthToken = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('authorization');
  console.log('🔐 [Buy Requests API] Auth Token Check:', {
    hasAuthHeader: !!authHeader,
    tokenLength: authHeader?.length || 0
  });
  return authHeader || null;
};

// Define action types
type BuyRequestAction = 'create';

interface BuyRequestApiRequest {
  action: BuyRequestAction;
  [key: string]: any;
}

// POST - Create buy request
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Buy Requests API] POST Request Started - ID: ${requestId}`);
  
  try {
    console.log(`📥 [Buy Requests API ${requestId}] Parsing request body...`);
    const body: BuyRequestApiRequest = await request.json();
    const { action, ...data } = body;
    
    console.log(`📊 [Buy Requests API ${requestId}] Request Details:`, {
      action,
      bodyKeys: Object.keys(data)
    });

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Buy Requests API ${requestId}] Missing authorization header`);
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Authorization header is required',
          error: 'Unauthorized'
        } as ApiResponse,
        { status: 401 }
      );
    }

    if (action !== 'create') {
      console.warn(`⚠️ [Buy Requests API ${requestId}] Invalid action for POST: ${action}`);
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'POST method only supports create action',
          error: 'Bad Request'
        } as ApiResponse,
        { status: 400 }
      );
    }

    const endpoint = '/buy-requests/create';
    console.log(`🌐 [Buy Requests API ${requestId}] Creating buy request...`);

    const response = await apiClient.post(endpoint, data, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Buy Requests API ${requestId}] Create successful:`, {
      status: response.status,
      hasData: !!response.data,
      requestId: response.data?.data?.id || 'N/A'
    });

    return NextResponse.json(response.data as ApiResponse, {
      status: response.status,
    });
  } catch (error) {
    console.error(`❌ [Buy Requests API ${requestId}] POST Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Request failed';
      
      console.error(`🔥 [Buy Requests API ${requestId}] Axios Error Details:`, {
        status: statusCode,
        message: errorMessage,
        responseData: error.response?.data,
        requestData: error.config?.data
      });
      
      return NextResponse.json(
        {
          statusCode,
          message: errorMessage,
          error: error.response?.data?.error || 'Internal Server Error'
        } as ApiResponse,
        { status: statusCode }
      );
    }

    console.error(`💥 [Buy Requests API ${requestId}] Unexpected Error:`);

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

// PUT - Update buy request or update status
export async function PUT(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Buy Requests API] PUT Request Started - ID: ${requestId}`);
  
  try {
    console.log(`📥 [Buy Requests API ${requestId}] Parsing request body...`);
    const body: { action: 'update' | 'update-status'; [key: string]: any } = await request.json();
    const { action, ...data } = body;
    
    console.log(`📊 [Buy Requests API ${requestId}] Request Details:`, {
      action,
      buyRequestId: data.buyRequestId,
      bodyKeys: Object.keys(data)
    });

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Buy Requests API ${requestId}] Missing authorization header`);
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Authorization header is required',
          error: 'Unauthorized'
        } as ApiResponse,
        { status: 401 }
      );
    }

    let endpoint = '';

    switch (action) {
      case 'update':
        endpoint = '/buy-requests/update';
        console.log(`🌐 [Buy Requests API ${requestId}] Updating buy request (processors only)`);
        break;
        
      case 'update-status':
        endpoint = '/buy-requests/update-status';
        console.log(`🌐 [Buy Requests API ${requestId}] Updating buy request status (farmers only)`);
        break;
        
      default:
        console.warn(`⚠️ [Buy Requests API ${requestId}] Invalid action for PUT: ${action}`);
        return NextResponse.json(
          {
            statusCode: 400,
            message: 'PUT method only supports update and update-status actions',
            error: 'Bad Request'
          } as ApiResponse,
          { status: 400 }
        );
    }

    const response = await apiClient.put(endpoint, data, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Buy Requests API ${requestId}] Update successful:`, {
      status: response.status,
      hasData: !!response.data
    });

    return NextResponse.json(response.data as ApiResponse, {
      status: response.status,
    });
  } catch (error) {
    console.error(`❌ [Buy Requests API ${requestId}] PUT Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Update failed';
      
      console.error(`🔥 [Buy Requests API ${requestId}] Axios Error Details:`, {
        status: statusCode,
        message: errorMessage,
        responseData: error.response?.data,
        requestData: error.config?.data
      });
      
      return NextResponse.json(
        {
          statusCode,
          message: errorMessage,
          error: error.response?.data?.error || 'Internal Server Error'
        } as ApiResponse,
        { status: statusCode }
      );
    }

    console.error(`💥 [Buy Requests API ${requestId}] Unexpected Error:`);

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

// GET - Fetch buy requests
export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Buy Requests API] GET Request Started - ID: ${requestId}`);
  
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const buyRequestId = searchParams.get('buyRequestId');
    const userId = searchParams.get('userId');
    
    console.log(`📊 [Buy Requests API ${requestId}] Query Parameters:`, {
      action,
      buyRequestId,
      userId,
      allParams: Object.fromEntries(searchParams.entries())
    });

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Buy Requests API ${requestId}] Missing authorization header`);
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Authorization header is required',
          error: 'Unauthorized'
        } as ApiResponse,
        { status: 401 }
      );
    }

    let endpoint = '';
    
    // Handle different GET actions
    switch (action) {
      case 'general':
        endpoint = '/buy-requests/general';
        console.log(`🌾 [Buy Requests API ${requestId}] Fetching general requests (farmers only - pending, <1 week old)`);
        break;
        
      case 'my-requests':
        endpoint = '/buy-requests/my-requests';
        console.log(`👤 [Buy Requests API ${requestId}] Fetching user's requests (farmer→seller / processor→buyer)`);
        break;
        
      case 'single-request':
        if (!buyRequestId) {
          console.warn(`⚠️ [Buy Requests API ${requestId}] Missing buyRequestId for single-request action`);
          return NextResponse.json(
            {
              statusCode: 400,
              message: 'buyRequestId is required for single-request action',
              error: 'Bad Request'
            } as ApiResponse,
            { status: 400 }
          );
        }
        endpoint = `/buy-requests/${buyRequestId}`;
        console.log(`🎯 [Buy Requests API ${requestId}] Fetching single buy request: ${buyRequestId}`);
        break;
        
      case 'user-requests':
        if (!userId) {
          console.warn(`⚠️ [Buy Requests API ${requestId}] Missing userId for user-requests action`);
          return NextResponse.json(
            {
              statusCode: 400,
              message: 'userId is required for user-requests action',
              error: 'Bad Request'
            } as ApiResponse,
            { status: 400 }
          );
        }
        endpoint = `/buy-requests/user/${userId}`;
        console.log(`👥 [Buy Requests API ${requestId}] Fetching buy requests for user: ${userId}`);
        break;
        
      default:
        console.warn(`⚠️ [Buy Requests API ${requestId}] Invalid or missing action: ${action}`);
        return NextResponse.json(
          {
            statusCode: 400,
            message: 'Invalid action. Valid actions are: general, my-requests, single-request, user-requests',
            error: 'Bad Request'
          } as ApiResponse,
          { status: 400 }
        );
    }

    console.log(`🌐 [Buy Requests API ${requestId}] Making GET request to: ${endpoint}`);

    const response = await apiClient.get(endpoint, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Buy Requests API ${requestId}] Request successful:`, {
      status: response.status,
      hasData: !!response.data,
      dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
      itemCount: Array.isArray(response.data) ? response.data.length : 'N/A'
    });

    return NextResponse.json(
      {
        statusCode: 200,
        message: action === 'single-request' 
          ? 'Buy request fetched successfully' 
          : action === 'user-requests'
          ? 'User buy requests fetched successfully'
          : 'Buy requests fetched successfully',
        data: response.data
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error(`❌ [Buy Requests API ${requestId}] GET Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch data';
      
      console.error(`🔥 [Buy Requests API ${requestId}] Axios Error Details:`, {
        status: statusCode,
        message: errorMessage,
        responseData: error.response?.data,
        url: error.config?.url
      });
      
      return NextResponse.json(
        {
          statusCode,
          message: errorMessage,
          error: error.response?.data?.error || 'Internal Server Error'
        } as ApiResponse,
        { status: statusCode }
      );
    }

    console.error(`💥 [Buy Requests API ${requestId}] Unexpected Error:`);

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

// DELETE - Delete buy request (processors only)
export async function DELETE(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Buy Requests API] DELETE Request Started - ID: ${requestId}`);
  
  try {
    const { searchParams } = new URL(request.url);
    const buyRequestId = searchParams.get('buyRequestId');
    
    console.log(`📊 [Buy Requests API ${requestId}] Query Parameters:`, {
      buyRequestId
    });

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Buy Requests API ${requestId}] Missing authorization header`);
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Authorization header is required',
          error: 'Unauthorized'
        } as ApiResponse,
        { status: 401 }
      );
    }

    if (!buyRequestId) {
      console.warn(`⚠️ [Buy Requests API ${requestId}] Missing buyRequestId`);
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'buyRequestId is required',
          error: 'Bad Request'
        } as ApiResponse,
        { status: 400 }
      );
    }

    const endpoint = `/buy-requests/${buyRequestId}`;
    console.log(`🗑️ [Buy Requests API ${requestId}] Deleting buy request: ${buyRequestId} (processors only)`);

    const response = await apiClient.delete(endpoint, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Buy Requests API ${requestId}] Delete successful:`, {
      status: response.status,
      hasData: !!response.data
    });

    return NextResponse.json(
      {
        statusCode: 200,
        message: 'Buy request deleted successfully',
        data: response.data
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error(`❌ [Buy Requests API ${requestId}] DELETE Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Delete failed';
      
      console.error(`🔥 [Buy Requests API ${requestId}] Axios Error Details:`, {
        status: statusCode,
        message: errorMessage,
        responseData: error.response?.data,
        url: error.config?.url
      });
      
      return NextResponse.json(
        {
          statusCode,
          message: errorMessage,
          error: error.response?.data?.error || 'Internal Server Error'
        } as ApiResponse,
        { status: statusCode }
      );
    }

    console.error(`💥 [Buy Requests API ${requestId}] Unexpected Error:`);

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