import { NextResponse } from 'next/server'

export function createGoneResponse(
  pathname: string,
  locales: readonly string[] = [],
  paths: string[] = [],
): NextResponse | null {
  const pathsToCheck = [
    ...paths,
    ...locales.flatMap(locale => paths.map(path => `/${locale}${path}`)),
  ]

  if (pathsToCheck.includes(pathname)) {
    return new NextResponse(null, {
      status: 410,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
      },
    })
  }

  return null
}
