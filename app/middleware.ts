// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Don't block public paths like login or api auth routes
  const publicPaths = ['/login', '/register', '/api/auth', '/oko-admin']
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Read the auth token from cookies (adjust if you're using headers or session)
  const token = request.cookies.get('token')?.value

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname) // Optional: to redirect back after login
    return NextResponse.redirect(loginUrl)
  }

  // Token exists — allow request through
  return NextResponse.next()
}
