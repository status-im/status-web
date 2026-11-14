import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher:
    '/((?!api(?:/|$)|c(?:/|$)|cc(?:/|$)|m(?:/|$)|u(?:/|$)|rss(?:/|$)|mobile-news(?:/|$)|desktop-news(?:/|$)|_next|_static|.*\\..*).*)',
}
