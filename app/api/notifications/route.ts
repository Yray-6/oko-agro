/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import https from 'https';
import { ApiResponse } from '@/app/types';

const baseUrl = process.env.BASE_URL || 'https://oko-agro-nestjs.onrender.com';

// Create HTTPS agent with proper SSL configuration
const httpsAgent = new https.Agent({
  keepAlive: false,
  maxSockets: Infinity,
  maxFreeSockets: 256,
  timeout: 30000,
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

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 [Notifications API] Outgoing Request:', {
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
    console.error('❌ [Notifications API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ [Notifications API] Response Success:', {
      status: response.status,
      statusText: response.statusText,
      dataType: typeof response.data,
      dataSize: response.data ? JSON.stringify(response.data).length : 0
    });
    return response;
  },
  (error) => {
    console.error('❌ [Notifications API] Response Error:', {
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
  console.log('🔐 [Notifications API] Auth Token Check:', {
    hasAuthHeader: !!authHeader,
    tokenLength: authHeader?.length || 0
  });
  return authHeader || null;
};

// GET - Fetch notifications
export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Notifications API] GET Request Started - ID: ${requestId}`);
  
  try {
    const { searchParams } = new URL(request.url);
    const pageNumber = searchParams.get('pageNumber') || '1';
    const pageSize = searchParams.get('pageSize') || '20';
    const type = searchParams.get('type');
    const isRead = searchParams.get('isRead');
    
    console.log(`📊 [Notifications API ${requestId}] Query Parameters:`, {
      pageNumber,
      pageSize,
      type,
      isRead,
      allParams: Object.fromEntries(searchParams.entries())
    });

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Notifications API ${requestId}] Missing authorization header`);
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Authorization header is required',
          error: 'Unauthorized'
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append('pageNumber', pageNumber);
    queryParams.append('pageSize', pageSize);
    if (type) queryParams.append('type', type);
    if (isRead !== null && isRead !== undefined) queryParams.append('isRead', isRead);

    const endpoint = `/notifications?${queryParams.toString()}`;
    console.log(`🌐 [Notifications API ${requestId}] Fetching notifications from: ${endpoint}`);

    const response = await apiClient.get(endpoint, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Notifications API ${requestId}] Request successful:`, {
      status: response.status,
      hasData: !!response.data,
      itemCount: response.data?.data?.items?.length || 0,
      unreadCount: response.data?.data?.unreadCount || 0
    });

    return NextResponse.json(response.data as ApiResponse, {
      status: 200
    });
  } catch (error) {
    console.error(`❌ [Notifications API ${requestId}] GET Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch notifications';
      
      console.error(`🔥 [Notifications API ${requestId}] Axios Error Details:`, {
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

    console.error(`💥 [Notifications API ${requestId}] Unexpected Error:`);

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

// PUT - Mark notification(s) as read
export async function PUT(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Notifications API] PUT Request Started - ID: ${requestId}`);
  
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const notificationId = searchParams.get('id');
    
    console.log(`📊 [Notifications API ${requestId}] Query Parameters:`, {
      action,
      notificationId
    });

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Notifications API ${requestId}] Missing authorization header`);
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
      case 'mark-read':
        if (!notificationId) {
          console.warn(`⚠️ [Notifications API ${requestId}] Missing notification ID for mark-read action`);
          return NextResponse.json(
            {
              statusCode: 400,
              message: 'Notification ID is required',
              error: 'Bad Request'
            } as ApiResponse,
            { status: 400 }
          );
        }
        endpoint = `/notifications/read/${notificationId}`;
        console.log(`🌐 [Notifications API ${requestId}] Marking notification as read: ${notificationId}`);
        break;

      case 'mark-all-read':
        endpoint = '/notifications/read-all';
        console.log(`🌐 [Notifications API ${requestId}] Marking all notifications as read`);
        break;

      default:
        console.warn(`⚠️ [Notifications API ${requestId}] Invalid action for PUT: ${action}`);
        return NextResponse.json(
          {
            statusCode: 400,
            message: 'PUT method only supports mark-read and mark-all-read actions',
            error: 'Bad Request'
          } as ApiResponse,
          { status: 400 }
        );
    }

    const response = await apiClient.put(endpoint, {}, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Notifications API ${requestId}] Mark as read successful:`, {
      status: response.status,
      hasData: !!response.data
    });

    return NextResponse.json(response.data as ApiResponse, {
      status: response.status,
    });
  } catch (error) {
    console.error(`❌ [Notifications API ${requestId}] PUT Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update notification';
      
      console.error(`🔥 [Notifications API ${requestId}] Axios Error Details:`, {
        status: statusCode,
        message: errorMessage,
        responseData: error.response?.data
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

    console.error(`💥 [Notifications API ${requestId}] Unexpected Error:`);

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

// POST - Send contact message
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Notifications API] POST Request Started - ID: ${requestId}`);
  
  try {
    console.log(`📥 [Notifications API ${requestId}] Parsing request body...`);
    const body: { action: string; buyRequestId?: string; processorId?: string; message?: string } = await request.json();
    const { action, ...data } = body;
    
    console.log(`📊 [Notifications API ${requestId}] Request Details:`, {
      action,
      buyRequestId: data.buyRequestId,
      processorId: data.processorId,
      hasMessage: !!data.message
    });

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Notifications API ${requestId}] Missing authorization header`);
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Authorization header is required',
          error: 'Unauthorized'
        } as ApiResponse,
        { status: 401 }
      );
    }

    if (action !== 'send-contact-message') {
      console.warn(`⚠️ [Notifications API ${requestId}] Invalid action for POST: ${action}`);
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'POST method only supports send-contact-message action',
          error: 'Bad Request'
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate required fields
    if (!data.buyRequestId || !data.processorId) {
      console.warn(`⚠️ [Notifications API ${requestId}] Missing required fields`);
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'buyRequestId and processorId are required',
          error: 'Bad Request'
        } as ApiResponse,
        { status: 400 }
      );
    }

    const endpoint = '/notifications/contact-seller';
    console.log(`🌐 [Notifications API ${requestId}] Sending contact message...`);

    const response = await apiClient.post(endpoint, data, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Notifications API ${requestId}] Contact message sent successfully:`, {
      status: response.status,
      hasData: !!response.data,
      notificationId: response.data?.data?.id || 'N/A'
    });

    return NextResponse.json(response.data as ApiResponse, {
      status: response.status,
    });
  } catch (error) {
    console.error(`❌ [Notifications API ${requestId}] POST Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send contact message';
      
      console.error(`🔥 [Notifications API ${requestId}] Axios Error Details:`, {
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

    console.error(`💥 [Notifications API ${requestId}] Unexpected Error:`);

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

