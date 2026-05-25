import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher:
    '/((?!api(?:/|$)|admin(?:/|$)|login(?:/|$)|c(?:/|$)|cc(?:/|$)|u(?:/|$)|rss(?:/|$)|mobile-news(?:/|$)|desktop-news(?:/|$)|_next|_static|.*\\..*).*)',
}
