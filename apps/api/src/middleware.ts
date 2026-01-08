// CORS middleware for Next.js API routes
// @see https://blog.logrocket.com/using-cors-next-js-handle-cross-origin-requests/
// This middleware runs before requests are completed and adds CORS headers
// This is Layer 1 of our multi-layer CORS protection strategy:
// 1. Middleware (this file) - First line of defense
// 2. next.config.mjs headers() - Framework-level headers
// 3. Route handler explicit headers - Application-level headers
// 4. crossOrigin config - Next.js resource loading config

import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  const pathname = request.nextUrl.pathname
  const method = request.method

  console.log('[CORS Middleware] Processing request:', {
    method,
    origin,
    pathname,
  })

  // Handle preflight OPTIONS requests
  // This is critical for CORS - browsers send OPTIONS before actual requests
  if (method === 'OPTIONS') {
    console.log('[CORS Middleware] Handling OPTIONS preflight request')

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
      'Access-Control-Max-Age': '86400', // 24 hours - cache preflight responses
      'Access-Control-Allow-Credentials': 'true',
    }

    return new NextResponse(null, {
      status: 204, // No Content - standard for OPTIONS responses
      headers: corsHeaders,
    })
  }

  // Clone the request headers to preserve them
  const requestHeaders = new Headers(request.headers)

  // Create response with CORS headers
  // NextResponse.next() continues the request chain
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Add CORS headers to all API responses
  // These headers will be present even if route handler doesn't set them
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version'
  )
  response.headers.set('Access-Control-Max-Age', '86400')
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  console.log('[CORS Middleware] Added CORS headers to response:', {
    origin,
    pathname,
    method,
  })

  return response
}

// Apply middleware only to API routes
// @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// The matcher uses a regex pattern to match API routes
export const config = {
  matcher: '/api/:path*',
}
