// app/api/ratings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import https from 'https';
import { ApiResponse, CreateRatingRequest, CreateRatingResponse } from '@/app/types';

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

// GET - Get user rating statistics
export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Ratings API] GET Request Started - ID: ${requestId}`);
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'userId is required',
          error: 'Bad Request'
        } as ApiResponse,
        { status: 400 }
      );
    }

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Ratings API ${requestId}] Missing authorization header`);
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Authorization header is required',
          error: 'Unauthorized'
        } as ApiResponse,
        { status: 401 }
      );
    }

    const endpoint = `/ratings/users/${userId}/ratings`;
    console.log(`🌐 [Ratings API ${requestId}] Making GET request to: ${endpoint}`);

    const response = await apiClient.get(endpoint, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Ratings API ${requestId}] Request successful:`, {
      status: response.status,
      hasData: !!response.data,
    });

    return NextResponse.json(response.data as ApiResponse, {
      status: 200
    });
  } catch (error) {
    console.error(`❌ [Ratings API ${requestId}] GET Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch rating statistics';
      
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

// POST - Create a rating
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Ratings API] POST Request Started - ID: ${requestId}`);
  
  try {
    const body = await request.json();
    const { buyRequestId, score, comment } = body as CreateRatingRequest;

    console.log(`📊 [Ratings API ${requestId}] Request Body:`, {
      buyRequestId,
      score,
      hasComment: !!comment,
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

    if (!score || score < 1 || score > 5) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'score must be between 1 and 5',
          error: 'Bad Request'
        } as ApiResponse,
        { status: 400 }
      );
    }

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Ratings API ${requestId}] Missing authorization header`);
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Authorization header is required',
          error: 'Unauthorized'
        } as ApiResponse,
        { status: 401 }
      );
    }

    const endpoint = '/ratings/create';
    console.log(`🌐 [Ratings API ${requestId}] Making POST request to: ${endpoint}`);

    const response = await apiClient.post<CreateRatingResponse>(
      endpoint,
      {
        buyRequestId,
        score,
        comment: comment || undefined,
      },
      {
        headers: {
          'Authorization': authHeader
        }
      }
    );

    console.log(`✅ [Ratings API ${requestId}] Request successful:`, {
      status: response.status,
      hasData: !!response.data,
    });

    return NextResponse.json(response.data as ApiResponse, {
      status: 200
    });
  } catch (error) {
    console.error(`❌ [Ratings API ${requestId}] POST Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create rating';
      
      console.error(`🔥 [Ratings API ${requestId}] Axios Error Details:`, {
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

    console.error(`💥 [Ratings API ${requestId}] Unexpected Error:`);

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
