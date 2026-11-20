import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Keep articles, archives and maintenance on their unprefixed routes.
  matcher:
    '/((?!api(?:/|$)|c(?:/|$)|cc(?:/|$)|m(?:/|$)|u(?:/|$)|blog/(?:maintenance/)?[^/]+/?$|blog/(?:author|tag)/[^/]+(?:/page/[^/]+)?/?$|rss(?:/|$)|mobile-news(?:/|$)|desktop-news(?:/|$)|_next|_static|.*\\..*).*)',
}
