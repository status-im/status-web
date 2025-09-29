import { NextResponse } from 'next/server'

import {
  STATUS_MOBILE_APP_STORE_URL,
  STATUS_MOBILE_GOOGLE_PLAY_URL,
} from '~/config/routes'

export const dynamic = 'force-static'
export const revalidate = 3600 // 1 hour

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
