import { NextRequest, NextResponse } from 'next/server'
import {
  createNaverImageKey,
  extractNaverImageURLFromDescription,
  isNaverImageKey,
  NAVER_RSS_URL,
} from '../../_lib/naver-image'

const REVALIDATE_SECONDS = 3600

export async function GET(request: NextRequest): Promise<NextResponse> {
  const key = request.nextUrl.searchParams.get('key')

  if (!key) {
    return NextResponse.json(
      { error: 'Missing key query parameter' },
      { status: 400 },
    )
  }

  if (!isNaverImageKey(key)) {
    return NextResponse.json({ error: 'Invalid image key' }, { status: 400 })
  }

  const sourceUrl = await resolveImageUrlFromKey(key)
  if (!sourceUrl) {
    return NextResponse.json({ error: 'Image key not found' }, { status: 404 })
  }

  try {
    const upstream = await fetch(sourceUrl, {
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

async function resolveImageUrlFromKey(key: string): Promise<string | null> {
  try {
    const response = await fetch(NAVER_RSS_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!response.ok) {
      return null
    }

    const xml = await response.text()
    const itemRegex = /<item>([\s\S]*?)<\/item>/g

    let match: RegExpExecArray | null
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1]
      const description = extractCDATA(itemXml, 'description')
      const imageUrl = extractNaverImageURLFromDescription(description)

      if (!imageUrl) {
        continue
      }

      if (createNaverImageKey(imageUrl) === key) {
        return imageUrl
      }
    }
    return null
  } catch {
    return null
  }
}

function extractCDATA(xml: string, tag: string): string | null {
  const cdataRegex = new RegExp(
    `<${tag}>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`,
  )
  const plainRegex = new RegExp(`<${tag}>([^<]*)</${tag}>`)

  const cdataMatch = cdataRegex.exec(xml)
  if (cdataMatch) return cdataMatch[1].trim()

  const plainMatch = plainRegex.exec(xml)
  if (plainMatch) return plainMatch[1].trim()

  return null
}
