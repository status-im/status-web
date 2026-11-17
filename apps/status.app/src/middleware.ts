import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Keep article and maintenance requests on their unprefixed routes.
  matcher:
    '/((?!api(?:/|$)|c(?:/|$)|cc(?:/|$)|m(?:/|$)|u(?:/|$)|blog/(?:maintenance/)?[^/]+/?$|rss(?:/|$)|mobile-news(?:/|$)|desktop-news(?:/|$)|_next|_static|.*\\..*).*)',
}
