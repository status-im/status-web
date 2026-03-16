import createMiddleware from 'next-intl/middleware'

import { nonLocalizedPaths, routing } from './i18n/routing'

export default createMiddleware(routing)

const nonLocalizedPathGroup = nonLocalizedPaths
  .map(path => `${path}(?:/|$)`)
  .join('|')

export const config = {
  matcher: `/((?!${nonLocalizedPathGroup}|_next|_static|.*\\..*).*)`,
}
