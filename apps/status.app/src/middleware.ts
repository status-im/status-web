import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { isBlogInMaintenance } from '~/config/blog-maintenance'
import { blogMaintenanceResponse } from '~website/blog/_utils/maintenance-response'

import { routing } from './i18n/routing'

const localize = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const maintenance = isBlogInMaintenance()
  const blogPath = (maintenance ? pathname.toLowerCase() : pathname).match(
    /^\/(?:en\/)?blog\/(.+)$/
  )

  if (blogPath) {
    if (/^icon(?:-[a-z0-9]+)?\.png$/.test(blogPath[1])) {
      return NextResponse.next()
    }

    if (maintenance) return blogMaintenanceResponse()

    // Serve live articles and archives from their unprefixed routes.
    if (
      pathname.includes('.') ||
      pathname.startsWith('/blog/maintenance/') ||
      /^\/blog\/[^/]+\/?$/.test(pathname) ||
      /^\/blog\/(?:author|tag)\/[^/]+(?:\/page\/[^/]+)?\/?$/.test(pathname)
    ) {
      return NextResponse.next()
    }
  }

  return localize(request)
}

export const config = {
  matcher: [
    '/blog/:path*',
    '/en/blog/:path*',
    '/((?!api(?:/|$)|c(?:/|$)|cc(?:/|$)|m(?:/|$)|u(?:/|$)|blog/(?:maintenance/)?[^/]+/?$|rss(?:/|$)|mobile-news(?:/|$)|desktop-news(?:/|$)|_next|_static|.*\\..*).*)',
  ],
}
