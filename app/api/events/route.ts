/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/events/route.ts
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

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 [Events API] Outgoing Request:', {
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
    console.error('❌ [Events API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ [Events API] Response Success:', {
      status: response.status,
      statusText: response.statusText,
      dataType: typeof response.data,
      dataSize: response.data ? JSON.stringify(response.data).length : 0
    });
    return response;
  },
  (error) => {
    console.error('❌ [Events API] Response Error:', {
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
  console.log('🔐 [Events API] Auth Token Check:', {
    hasAuthHeader: !!authHeader,
    tokenLength: authHeader?.length || 0
  });
  return authHeader || null;
};

// Define action types
type EventAction = 'create' | 'update';

interface EventApiRequest {
  action: EventAction;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Events API] POST Request Started - ID: ${requestId}`);
  
  try {
    console.log(`📥 [Events API ${requestId}] Parsing request body...`);
    const body: EventApiRequest = await request.json();
    const { action, ...data } = body;
    
    console.log(`📊 [Events API ${requestId}] Request Details:`, {
      action,
      hasName: !!data.name,
      hasEventDate: !!data.eventDate,
      hasReferenceType: !!data.referenceType,
      isHarvestEvent: data.isHarvestEvent,
      hasCropId: !!data.cropId,
      hasCropQuantity: !!data.cropQuantity,
      hasCropQuantityUnit: !!data.cropQuantityUnit,
      bodyKeys: Object.keys(data)
    });

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Events API ${requestId}] Missing authorization header`);
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
      console.warn(`⚠️ [Events API ${requestId}] Invalid action for POST: ${action}`);
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'POST method only supports create action',
          error: 'Bad Request'
        } as ApiResponse,
        { status: 400 }
      );
    }

    const endpoint = '/events/create';
    console.log(`🌐 [Events API ${requestId}] Creating event...`);

    // Make the API call to the backend
    const response = await apiClient.post(endpoint, data, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Events API ${requestId}] Create successful:`, {
      status: response.status,
      hasData: !!response.data,
      eventId: response.data?.data?.id || 'N/A'
    });

    // Return the response from the backend
    return NextResponse.json(response.data as ApiResponse, {
      status: response.status,
    });
  } catch (error) {
    console.error(`❌ [Events API ${requestId}] POST Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Request failed';
      
      console.error(`🔥 [Events API ${requestId}] Axios Error Details:`, {
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

    console.error(`💥 [Events API ${requestId}] Unexpected Error:`);

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

export async function PATCH(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Events API] PATCH Request Started - ID: ${requestId}`);
  
  try {
    console.log(`📥 [Events API ${requestId}] Parsing request body...`);
    const body: EventApiRequest = await request.json();
    const { action, ...data } = body;
    
    console.log(`📊 [Events API ${requestId}] Request Details:`, {
      action,
      eventId: data.eventId,
      hasName: !!data.name,
      bodyKeys: Object.keys(data)
    });

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Events API ${requestId}] Missing authorization header`);
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Authorization header is required',
          error: 'Unauthorized'
        } as ApiResponse,
        { status: 401 }
      );
    }

    if (action !== 'update') {
      console.warn(`⚠️ [Events API ${requestId}] Invalid action for PATCH: ${action}`);
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'PATCH method only supports update action',
          error: 'Bad Request'
        } as ApiResponse,
        { status: 400 }
      );
    }

    const endpoint = '/events/update';
    console.log(`🌐 [Events API ${requestId}] Updating event: ${data.eventId}`);

    // Make the API call to the backend using PATCH
    const response = await apiClient.patch(endpoint, data, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Events API ${requestId}] Update successful:`, {
      status: response.status,
      hasData: !!response.data,
      eventId: response.data?.data?.id || data.eventId
    });

    // Return the response from the backend
    return NextResponse.json(response.data as ApiResponse, {
      status: response.status,
    });
  } catch (error) {
    console.error(`❌ [Events API ${requestId}] PATCH Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Update failed';
      
      console.error(`🔥 [Events API ${requestId}] Axios Error Details:`, {
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

    console.error(`💥 [Events API ${requestId}] Unexpected Error:`);

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
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Events API] GET Request Started - ID: ${requestId}`);
  
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const eventId = searchParams.get('eventId');
    
    console.log(`📊 [Events API ${requestId}] Query Parameters:`, {
      action,
      userId,
      eventId,
      allParams: Object.fromEntries(searchParams.entries())
    });

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Events API ${requestId}] Missing authorization header`);
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
      case 'user-events':
        if (!userId) {
          console.warn(`⚠️ [Events API ${requestId}] Missing userId for user-events action`);
          return NextResponse.json(
            {
              statusCode: 400,
              message: 'userId is required for user-events action',
              error: 'Bad Request'
            } as ApiResponse,
            { status: 400 }
          );
        }
        endpoint = `/events/user/${userId}`;
        console.log(`👤 [Events API ${requestId}] Fetching events for user: ${userId}`);
        break;
        
      case 'single-event':
        if (!eventId) {
          console.warn(`⚠️ [Events API ${requestId}] Missing eventId for single-event action`);
          return NextResponse.json(
            {
              statusCode: 400,
              message: 'eventId is required for single-event action',
              error: 'Bad Request'
            } as ApiResponse,
            { status: 400 }
          );
        }
        endpoint = `/events/${eventId}`;
        console.log(`🎯 [Events API ${requestId}] Fetching single event: ${eventId}`);
        break;
        
      case 'all':
        endpoint = '/events/all';
        console.log(`👥 [Events API ${requestId}] Fetching all events (admin only)`);
        break;
        
      default:
        console.warn(`⚠️ [Events API ${requestId}] Invalid or missing action: ${action}`);
        return NextResponse.json(
          {
            statusCode: 400,
            message: 'Invalid action. Valid actions are: user-events, single-event, all',
            error: 'Bad Request'
          } as ApiResponse,
          { status: 400 }
        );
    }

    console.log(`🌐 [Events API ${requestId}] Making GET request to: ${endpoint}`);

    const response = await apiClient.get(endpoint, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Events API ${requestId}] Events fetched successfully:`, {
      status: response.status,
      hasData: !!response.data,
      dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
      itemCount: Array.isArray(response.data) ? response.data.length : 'N/A'
    });

    return NextResponse.json(
      {
        statusCode: 200,
        message: action === 'single-event' ? 'Event fetched successfully' : 'Events fetched successfully',
        data: response.data
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error(`❌ [Events API ${requestId}] GET Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch events';
      
      console.error(`🔥 [Events API ${requestId}] Axios Error Details:`, {
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

    console.error(`💥 [Events API ${requestId}] Unexpected Error:`);

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

export async function DELETE(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Events API] DELETE Request Started - ID: ${requestId}`);
  
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    
    console.log(`📊 [Events API ${requestId}] Query Parameters:`, {
      eventId
    });

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Events API ${requestId}] Missing authorization header`);
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Authorization header is required',
          error: 'Unauthorized'
        } as ApiResponse,
        { status: 401 }
      );
    }

    if (!eventId) {
      console.warn(`⚠️ [Events API ${requestId}] Missing eventId`);
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'eventId is required',
          error: 'Bad Request'
        } as ApiResponse,
        { status: 400 }
      );
    }

    const endpoint = `/events/${eventId}`;
    console.log(`🗑️ [Events API ${requestId}] Deleting event: ${eventId}`);

    const response = await apiClient.delete(endpoint, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Events API ${requestId}] Event deleted successfully:`, {
      status: response.status,
      eventId
    });

    return NextResponse.json(
      {
        statusCode: 200,
        message: 'Event deleted successfully',
        data: response.data
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error(`❌ [Events API ${requestId}] DELETE Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete event';
      
      console.error(`🔥 [Events API ${requestId}] Axios Error Details:`, {
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

    console.error(`💥 [Events API ${requestId}] Unexpected Error:`);

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