// app/api/admin/route.ts
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

    let endpoint = '';

    switch (action) {
      case 'dashboard-overview':
        endpoint = '/admin/dashboard/overview';
        break;

      case 'all-admins':
        // Get query parameters for pagination
        const role = searchParams.get('role') || 'admin';
        const pageNumber = searchParams.get('pageNumber') || '1';
        const pageSize = searchParams.get('pageSize') || '20';
        endpoint = `/admin/all-admins?role=${role}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
        break;

      default:
        return NextResponse.json(
          {
            statusCode: 400,
            message: 'Invalid action. Valid actions are: dashboard-overview, all-admins',
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
    console.error('Admin API Error:', error);
        
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

// POST - Create admin user
export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Admin API] POST Request Started - ID: ${requestId}`);
  
  try {
    const body = await request.json();
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

    const endpoint = '/admin/create-admin';
    console.log(`🌐 [Admin API ${requestId}] Creating admin user...`);

    const response = await apiClient.post(endpoint, body, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Admin API ${requestId}] Create admin successful:`, {
      status: response.status,
      hasData: !!response.data
    });

    return NextResponse.json(response.data as ApiResponse, {
      status: response.status,
    });
  } catch (error) {
    console.error(`❌ [Admin API ${requestId}] POST Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create admin';
      
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

// PATCH - Update user status or admin password
export async function PATCH(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Admin API] PATCH Request Started - ID: ${requestId}`);
  
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
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

    let endpoint = '';

    switch (action) {
      case 'update-status':
        endpoint = '/admin/update-status';
        console.log(`🌐 [Admin API ${requestId}] Updating user status...`);
        break;
      case 'update-admin-password':
        endpoint = '/admin/update-admin-password';
        console.log(`🌐 [Admin API ${requestId}] Updating admin password...`);
        break;
      default:
        return NextResponse.json(
          {
            statusCode: 400,
            message: 'Invalid action. Valid actions are: update-status, update-admin-password',
            error: 'Bad Request'
          } as ApiResponse,
          { status: 400 }
        );
    }

    const response = await apiClient.patch(endpoint, body, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Admin API ${requestId}] PATCH successful:`, {
      status: response.status,
      hasData: !!response.data
    });

    return NextResponse.json(response.data as ApiResponse, {
      status: response.status,
    });
  } catch (error) {
    console.error(`❌ [Admin API ${requestId}] PATCH Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Update failed';
      
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

// DELETE - Delete admin user
export async function DELETE(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9);
  console.log(`📝 [Admin API] DELETE Request Started - ID: ${requestId}`);
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
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

    const endpoint = `/admin/${userId}`;
    console.log(`🗑️ [Admin API ${requestId}] Deleting admin user: ${userId}`);

    const response = await apiClient.delete(endpoint, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log(`✅ [Admin API ${requestId}] Delete successful:`, {
      status: response.status,
      hasData: !!response.data
    });

    return NextResponse.json(response.data as ApiResponse, {
      status: response.status,
    });
  } catch (error) {
    console.error(`❌ [Admin API ${requestId}] DELETE Error:`, error);
    
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message || 'Delete failed';
      
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

