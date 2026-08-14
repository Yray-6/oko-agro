import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import https from 'https';
import { ApiResponse } from '@/app/types';
import { config } from '@/app/config';

const httpsAgent = new https.Agent({
  keepAlive: false,
  rejectUnauthorized: true,
});

const apiClient = axios.create({
  baseURL: config.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  httpsAgent,
});

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json(
      {
        statusCode: 401,
        message: 'Authorization header is required',
        error: 'Unauthorized',
      } as ApiResponse,
      { status: 401 },
    );
  }

  try {
    const response = await apiClient.get('/integrations/agrotrack/sso-handoff-token', {
      headers: { Authorization: authHeader },
    });

    return NextResponse.json(response.data as ApiResponse, {
      status: response.status,
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status || 500;
      const errorMessage =
        error.response?.data?.message || error.message || 'SSO handoff failed';

      return NextResponse.json(
        {
          statusCode,
          message: errorMessage,
          error: error.response?.data?.error || 'Internal Server Error',
        } as ApiResponse,
        { status: statusCode },
      );
    }

    return NextResponse.json(
      {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      } as ApiResponse,
      { status: 500 },
    );
  }
}
