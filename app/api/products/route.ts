/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/products/route.ts
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
    console.log('🚀 [Products API] Outgoing Request:', {
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
    console.error('❌ [Products API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ [Products API] Response Success:', {
      status: response.status,
      statusText: response.statusText,
      dataType: typeof response.data,
      dataSize: response.data ? JSON.stringify(response.data).length : 0
    });
    return response;
  },
  (error) => {
    console.error('❌ [Products API] Response Error:', {
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
  console.log('🔐 [Products API] Auth Token Check:', {
    hasAuthHeader: !!authHeader,
    tokenLength: authHeader?.length || 0
  });
  return authHeader || null;
};

// Define action types
type ProductAction = 'create' | 'update';

interface ProductApiRequest {
  action: ProductAction;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Products API] POST Request Started - ID: ${requestId}`);
  
  try {
    console.log(`📥 [Products API ${requestId}] Parsing request body...`);
    const body: ProductApiRequest = await request.json();
    const { action, ...data } = body;
    
    console.log(`📊 [Products API ${requestId}] Request Details:`, {
      action,
      hasName: !!data.name,
      hasCropId: !!data.cropId,
      hasQuantity: !!data.quantity,
      hasPhotos: !!data.photos,
      photosCount: data.photos?.length || 0,
      bodyKeys: Object.keys(data)
    });

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Products API ${requestId}] Missing authorization header`);
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
      console.warn(`⚠️ [Products API ${requestId}] Invalid action for POST: ${action}`);
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'POST method only supports create action',
          error: 'Bad Request'
        } as ApiResponse,
        { status: 400 }
      );
    }

    const endpoint = '/products/create';
    console.log(`🌐 [Products API ${requestId}] Creating product...`);

    // Make the API call to the backend
    const response = await apiClient.post(endpoint, data, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Products API ${requestId}] Create successful:`, {
      status: response.status,
      hasData: !!response.data,
      productId: response.data?.data?.id || 'N/A'
    });

    // Return the response from the backend
    return NextResponse.json(response.data as ApiResponse, {
      status: response.status,
    });
  } catch (error) {
    console.error(`❌ [Products API ${requestId}] POST Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Request failed';
      
      console.error(`🔥 [Products API ${requestId}] Axios Error Details:`, {
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

    console.error(`💥 [Products API ${requestId}] Unexpected Error:`);

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
  console.log(`📝 [Products API] PATCH Request Started - ID: ${requestId}`);
  
  try {
    console.log(`📥 [Products API ${requestId}] Parsing request body...`);
    const body: ProductApiRequest = await request.json();
    const { action, ...data } = body;
    
    console.log(`📊 [Products API ${requestId}] Request Details:`, {
      action,
      productId: data.productId,
      hasName: !!data.name,
      hasQuantity: !!data.quantity,
      bodyKeys: Object.keys(data)
    });

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Products API ${requestId}] Missing authorization header`);
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
      console.warn(`⚠️ [Products API ${requestId}] Invalid action for PATCH: ${action}`);
      return NextResponse.json(
        {
          statusCode: 400,
          message: 'PATCH method only supports update action',
          error: 'Bad Request'
        } as ApiResponse,
        { status: 400 }
      );
    }

    const endpoint = '/products/update';
    console.log(`🌐 [Products API ${requestId}] Updating product: ${data.productId}`);

    // Make the API call to the backend using PATCH
    const response = await apiClient.patch(endpoint, data, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Products API ${requestId}] Update successful:`, {
      status: response.status,
      hasData: !!response.data,
      productId: response.data?.data?.id || data.productId
    });

    // Return the response from the backend
    return NextResponse.json(response.data as ApiResponse, {
      status: response.status,
    });
  } catch (error) {
    console.error(`❌ [Products API ${requestId}] PATCH Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Update failed';
      
      console.error(`🔥 [Products API ${requestId}] Axios Error Details:`, {
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

    console.error(`💥 [Products API ${requestId}] Unexpected Error:`);

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
  console.log(`📝 [Products API] GET Request Started - ID: ${requestId}`);
  
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');
    
    console.log(`📊 [Products API ${requestId}] Query Parameters:`, {
      action,
      userId,
      productId,
      allParams: Object.fromEntries(searchParams.entries())
    });

    const authHeader = extractAuthToken(request);

    if (!authHeader) {
      console.warn(`⚠️ [Products API ${requestId}] Missing authorization header`);
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
      case 'user-products':
        if (!userId) {
          console.warn(`⚠️ [Products API ${requestId}] Missing userId for user-products action`);
          return NextResponse.json(
            {
              statusCode: 400,
              message: 'userId is required for user-products action',
              error: 'Bad Request'
            } as ApiResponse,
            { status: 400 }
          );
        }
        endpoint = `/products/user/${userId}`;
        console.log(`👤 [Products API ${requestId}] Fetching products for user: ${userId}`);
        break;
        
      case 'single-product':
        if (!productId) {
          console.warn(`⚠️ [Products API ${requestId}] Missing productId for single-product action`);
          return NextResponse.json(
            {
              statusCode: 400,
              message: 'productId is required for single-product action',
              error: 'Bad Request'
            } as ApiResponse,
            { status: 400 }
          );
        }
        endpoint = `/products/${productId}`;
        console.log(`🎯 [Products API ${requestId}] Fetching single product: ${productId}`);
        break;
        
      default:
        console.warn(`⚠️ [Products API ${requestId}] Invalid or missing action: ${action}`);
        return NextResponse.json(
          {
            statusCode: 400,
            message: 'Invalid action. Valid actions are: user-products, single-product',
            error: 'Bad Request'
          } as ApiResponse,
          { status: 400 }
        );
    }

    console.log(`🌐 [Products API ${requestId}] Making GET request to: ${endpoint}`);

    const response = await apiClient.get(endpoint, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Products API ${requestId}] Products fetched successfully:`, {
      status: response.status,
      hasData: !!response.data,
      dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
      itemCount: Array.isArray(response.data) ? response.data.length : 'N/A'
    });

    return NextResponse.json(
      {
        statusCode: 200,
        message: action === 'single-product' ? 'Product fetched successfully' : 'Products fetched successfully',
        data: response.data
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error(`❌ [Products API ${requestId}] GET Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch products';
      
      console.error(`🔥 [Products API ${requestId}] Axios Error Details:`, {
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

    console.error(`💥 [Products API ${requestId}] Unexpected Error:`);

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