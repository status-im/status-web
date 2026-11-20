import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { getArchivedPost } from '~website/_lib/blog-archive'
import { unavailableBlogPost } from '~website/blog/_utils/unavailable'

import { routing } from './i18n/routing'

const localize = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const article = pathname.match(/^\/(?:en\/)?blog\/([^/]+)\/?$/)

  // Return a complete response here so Next does not render the site layout.
  if (article) {
    let slug: string
    try {
      slug = decodeURIComponent(article[1])
    } catch {
      return unavailableBlogPost()
    }

    if (/^icon(?:-[a-z0-9]+)?\.png$/.test(slug)) return NextResponse.next()
    if (!getArchivedPost(slug)) return unavailableBlogPost()
    if (pathname.startsWith('/blog/')) return NextResponse.next()
  }

  return localize(request)
}

export const config = {
  matcher: [
    '/blog/:slug',
    '/en/blog/:slug',
    '/((?!api(?:/|$)|c(?:/|$)|cc(?:/|$)|m(?:/|$)|u(?:/|$)|blog/(?:maintenance/)?[^/]+/?$|rss(?:/|$)|mobile-news(?:/|$)|desktop-news(?:/|$)|_next|_static|.*\\..*).*)',
  ],
}
