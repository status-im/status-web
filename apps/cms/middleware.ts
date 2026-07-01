import { NextResponse, type NextRequest } from 'next/server'

import { stripAdminNotFoundParam } from './src/lib/admin-url'

export const middleware = (request: NextRequest): NextResponse => {
  const cleanUrl = stripAdminNotFoundParam(request.nextUrl)
  if (cleanUrl) {
    return NextResponse.redirect(cleanUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
