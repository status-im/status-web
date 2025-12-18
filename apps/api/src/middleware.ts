// CORS middleware for Next.js API routes
// @see https://blog.logrocket.com/using-cors-next-js-handle-cross-origin-requests/
// This middleware runs before requests are completed and adds CORS headers
// This is Layer 1 of our multi-layer CORS protection strategy:
// 1. Middleware (this file) - First line of defense
// 2. next.config.mjs headers() - Framework-level headers
// 3. Route handler explicit headers - Application-level headers
// 4. crossOrigin config - Next.js resource loading config

import { NextResponse } from 'next/server'

import { getCorsHeaders } from './config/cors'

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

  // Get CORS headers based on origin
  const corsHeaders = getCorsHeaders(origin)

  console.log('[CORS Middleware] CORS headers determined:', {
    origin,
    allowedOrigin: corsHeaders['Access-Control-Allow-Origin'],
  })

  // Handle preflight OPTIONS requests
  // This is critical for CORS - browsers send OPTIONS before actual requests
  // @see https://www.geeksforgeeks.org/reactjs/how-to-use-cors-in-next-js-to-handle-cross-origin-requests/
  // Some legacy browsers (IE11, various SmartTVs) choke on 204, but 204 is the standard
  // If you need to support legacy browsers, you can use status 200 instead
  if (method === 'OPTIONS') {
    console.log('[CORS Middleware] Handling OPTIONS preflight request')

    return new NextResponse(null, {
      status: 204, // No Content - standard for OPTIONS responses
      // Use status: 200 if you need to support legacy browsers that choke on 204
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
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  console.log('[CORS Middleware] Added CORS headers to response:', {
    origin,
    allowedOrigin: corsHeaders['Access-Control-Allow-Origin'],
    pathname,
    method,
  })

  return response
}

// Apply middleware only to API routes
// @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// The matcher uses a regex pattern to match API routes including dynamic routes
// This pattern matches all routes starting with /api/
export const config = {
  matcher: '/api/:path*',
}
