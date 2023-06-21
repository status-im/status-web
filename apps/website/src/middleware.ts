import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization')

  if (process.env.VERCEL_ENV !== 'production') {
    return NextResponse.next()
  }

  if (basicAuth) {
    const auth = basicAuth.split(' ')[1]
    const [user, password] = Buffer.from(auth, 'base64').toString().split(':')

    if (user === 'status' && password === process.env.AUTH_PASSWORD) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Authentication Required', {
    status: 401,
    headers: { 'WWW-Authenticate': `Basic realm="website"` },
  })
}
