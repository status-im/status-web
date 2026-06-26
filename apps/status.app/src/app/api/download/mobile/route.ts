import { NextResponse } from 'next/server'

import {
  STATUS_MOBILE_APP_STORE_URL,
  STATUS_MOBILE_GOOGLE_PLAY_URL,
} from '~/config/routes'

// This handler inspects the request's User-Agent, so it cannot be statically
// rendered — `force-static` would strip request headers and make the branching
// dead code (always falling through to the generic destination). It is a
// deep-link helper reached by scanning the in-app QR code from a phone, and is
// Disallow'd in robots.txt; it is never used as an ad/search landing page on
// the statically exported get.status.app. why:
// https://github.com/status-im/status-web/issues/1236
export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  const userAgent = request.headers.get('user-agent')

  if (userAgent) {
    if (/android/i.test(userAgent)) {
      return NextResponse.redirect(STATUS_MOBILE_GOOGLE_PLAY_URL)
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      return NextResponse.redirect(STATUS_MOBILE_APP_STORE_URL)
    }
  }

  return NextResponse.redirect('https://status.app/apps#mobile')
}
