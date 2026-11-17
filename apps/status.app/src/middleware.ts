import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Render article slugs with the unprefixed route's on-demand fallback.
  matcher:
    '/((?!api(?:/|$)|c(?:/|$)|cc(?:/|$)|m(?:/|$)|u(?:/|$)|blog/[^/]+/?$|rss(?:/|$)|mobile-news(?:/|$)|desktop-news(?:/|$)|_next|_static|.*\\..*).*)',
}
