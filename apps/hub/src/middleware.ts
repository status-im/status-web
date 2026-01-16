import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

import type { NextRequest } from 'next/server'

const handleI18nRouting = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  // Get the hash fragment from the original URL
  const hash = request.url.split('#')[1]

  // Set the pathname in a custom header so it can be read in server components
  request.headers.set('x-pathname', request.nextUrl.pathname)

  // Run the next-intl middleware
  const response = handleI18nRouting(request)

  // If it's a redirect response and we have a hash, preserve it
  if ((response.status === 307 || response.status === 302) && hash) {
    const location = response.headers.get('location')
    if (location) {
      const newUrl = new URL(location, request.url)
      newUrl.hash = hash
      response.headers.set('location', newUrl.toString())
    }
  }

  return response
}

export const config = {
  // Match all pathnames except for
  // - API routes (/api/*)
  // - _next (Next.js internals)
  // - _static (inside /public)
  // - files with extensions (e.g. favicon.ico)
  matcher: '/((?!api|_next|_static|.*\\..*).*)',
}
