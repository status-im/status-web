import { NextRequest, NextResponse } from 'next/server'

const REVALIDATE_SECONDS = 3600

export async function GET(request: NextRequest): Promise<NextResponse> {
  const sourceUrl = request.nextUrl.searchParams.get('url')

  if (!sourceUrl) {
    return NextResponse.json(
      { error: 'Missing url query parameter' },
      { status: 400 },
    )
  }

  const normalizedUrl = normalizeAndValidateSourceURL(sourceUrl)
  if (!normalizedUrl) {
    return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 })
  }

  try {
    const upstream = await fetch(normalizedUrl, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: {
        accept: 'image/*,*/*;q=0.8',
      },
    })

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream image request failed with ${upstream.status}` },
        { status: 502 },
      )
    }

    const contentType = upstream.headers.get('content-type') ?? ''
    if (!contentType.toLowerCase().startsWith('image/')) {
      return NextResponse.json(
        { error: 'Upstream resource is not an image' },
        { status: 502 },
      )
    }

    const body = await upstream.arrayBuffer()
    const headers = new Headers()
    headers.set('content-type', contentType)

    const cacheControl =
      upstream.headers.get('cache-control') ??
      `public, max-age=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS}`
    headers.set('cache-control', cacheControl)

    return new NextResponse(body, { status: 200, headers })
  } catch (error) {
    console.error('Failed to proxy Naver image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 502 },
    )
  }
}

function normalizeAndValidateSourceURL(sourceUrl: string): string | null {
  try {
    const url = new URL(sourceUrl)

    if (url.protocol === 'http:') {
      url.protocol = 'https:'
    }

    if (url.protocol !== 'https:') {
      return null
    }

    if (!isAllowedNaverImageHost(url.hostname)) {
      return null
    }

    return url.toString()
  } catch {
    return null
  }
}

function isAllowedNaverImageHost(hostname: string): boolean {
  return (
    hostname === 'pstatic.net' ||
    hostname.endsWith('.pstatic.net') ||
    hostname === 'phinf.naver.net' ||
    hostname.endsWith('.phinf.naver.net')
  )
}
