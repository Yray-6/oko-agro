// app/api/disputes/route.ts
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

// Extract authorization token from request
const extractAuthToken = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader;
  }
  return null;
};

// POST - Create a dispute
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Disputes API] POST Request Started - ID: ${requestId}`);
  
  try {
    const body = await request.json();
    const { buyRequestId, reason } = body;

    console.log(`📊 [Disputes API ${requestId}] Request Body:`, {
      buyRequestId,
      hasReason: !!reason,
    });

    // Validate required fields
    if (!buyRequestId) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'buyRequestId is required',
          error: 'Bad Request'
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'reason is required',
          error: 'Bad Request'
        } as ApiResponse,
        { status: 400 }
      );
    }

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Disputes API ${requestId}] Missing authorization header`);
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Authorization header is required',
          error: 'Unauthorized'
        } as ApiResponse,
        { status: 401 }
      );
    }

    const endpoint = '/disputes/create';
    console.log(`🌐 [Disputes API ${requestId}] Making POST request to: ${endpoint}`);

    const response = await apiClient.post(
      endpoint,
      {
        buyRequestId,
        reason: reason.trim(),
      },
      {
        headers: {
          'Authorization': authHeader
        }
      }
    );

    console.log(`✅ [Disputes API ${requestId}] Request successful:`, {
      status: response.status,
      hasData: !!response.data,
    });

    return NextResponse.json(response.data as ApiResponse, {
      status: 200
    });
  } catch (error) {
    console.error(`❌ [Disputes API ${requestId}] POST Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create dispute';
      
      return NextResponse.json(
        {
          statusCode,
          message: errorMessage,
          error: error.response?.data?.error || 'Internal Server Error'
        } as ApiResponse,
        { status: statusCode }
      );
    }

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

// GET - Fetch disputes
export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Disputes API] GET Request Started - ID: ${requestId}`);
  
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const disputeId = searchParams.get('disputeId');
    const pageNumber = searchParams.get('pageNumber') || '1';
    const pageSize = searchParams.get('pageSize') || '20';

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Disputes API ${requestId}] Missing authorization header`);
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
    if (action === 'single' && disputeId) {
      endpoint = `/disputes/${disputeId}`;
    } else {
      endpoint = `/disputes/all?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    }

    console.log(`🌐 [Disputes API ${requestId}] Making GET request to: ${endpoint}`);

    const response = await apiClient.get(endpoint, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Disputes API ${requestId}] Request successful:`, {
      status: response.status,
      hasData: !!response.data,
    });

    return NextResponse.json(response.data as ApiResponse, {
      status: 200
    });
  } catch (error) {
    console.error(`❌ [Disputes API ${requestId}] GET Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch disputes';
      
      return NextResponse.json(
        {
          statusCode,
          message: errorMessage,
          error: error.response?.data?.error || 'Internal Server Error'
        } as ApiResponse,
        { status: statusCode }
      );
    }

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

// PATCH - Resolve or reject a dispute
export async function PATCH(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Disputes API] PATCH Request Started - ID: ${requestId}`);
  
  try {
    const body = await request.json();
    const { disputeId, action } = body;

    console.log(`📊 [Disputes API ${requestId}] Request Body:`, {
      disputeId,
      action,
    });

    // Validate required fields
    if (!disputeId) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'disputeId is required',
          error: 'Bad Request'
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (!action || (action !== 'resolve' && action !== 'reject')) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'action must be either "resolve" or "reject"',
          error: 'Bad Request'
        } as ApiResponse,
        { status: 400 }
      );
    }

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Disputes API ${requestId}] Missing authorization header`);
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Authorization header is required',
          error: 'Unauthorized'
        } as ApiResponse,
        { status: 401 }
      );
    }

    const endpoint = `/disputes/${disputeId}/${action}`;
    console.log(`🌐 [Disputes API ${requestId}] Making PATCH request to: ${endpoint}`);

    const response = await apiClient.patch(
      endpoint,
      {},
      {
        headers: {
          'Authorization': authHeader
        }
      }
    );

    console.log(`✅ [Disputes API ${requestId}] Request successful:`, {
      status: response.status,
      hasData: !!response.data,
    });

    return NextResponse.json(response.data as ApiResponse, {
      status: 200
    });
  } catch (error) {
    console.error(`❌ [Disputes API ${requestId}] PATCH Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update dispute';
      
      return NextResponse.json(
        {
          statusCode,
          message: errorMessage,
          error: error.response?.data?.error || 'Internal Server Error'
        } as ApiResponse,
        { status: statusCode }
      );
    }

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
