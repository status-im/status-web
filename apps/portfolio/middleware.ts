import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('x-current-path', request.nextUrl.pathname)
  return response
}

export const config = {
  matcher: ['/:address/assets/:slug*', '/:address/collectibles/:rest*'],
}
