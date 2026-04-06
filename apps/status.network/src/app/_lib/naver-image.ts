import 'server-only'
import { createHash } from 'node:crypto'

const NAVER_RSS_URL = 'https://rss.blog.naver.com/status_korea.xml'
const NAVER_IMAGE_KEY_PATTERN = /^[A-Za-z0-9_-]{43}$/

export { NAVER_RSS_URL }

export function isNaverImageKey(value: string): boolean {
  return NAVER_IMAGE_KEY_PATTERN.test(value)
}

export function extractNaverImageURLFromDescription(
  description: string | null,
): string | null {
  if (!description) return null

  const match = /<img[^>]+src=(["'])(.*?)\1/i.exec(description)
  if (!match) return null

  return normalizeNaverImageURL(decodeURLAttributeAmpersand(match[2]))
}

export function createNaverImageKey(imageUrl: string): string {
  return createHash('sha256').update(imageUrl).digest('base64url')
}

function normalizeNaverImageURL(imageUrl: string): string | null {
  try {
    const url = new URL(imageUrl)

    if (url.protocol === 'http:') {
      url.protocol = 'https:'
    }

    if (url.protocol !== 'https:') {
      return null
    }

    if (!isAllowedNaverImageHost(url.hostname)) {
      return null
    }

    // RSS thumbnails use ?type=s3 (365x365 square crop).
    // Replace with ?type=w2 for a wider image suitable for cards.
    if (url.searchParams.get('type') === 's3') {
      url.searchParams.set('type', 'w2')
    }

    return url.toString()
  } catch {
    return null
  }
}

function decodeURLAttributeAmpersand(value: string): string {
  // Decode '&amp;' once for URL query separators, without recursive decoding.
  return value.replaceAll('&amp;', '&')
}

function isAllowedNaverImageHost(hostname: string): boolean {
  return (
    hostname === 'pstatic.net' ||
    hostname.endsWith('.pstatic.net') ||
    hostname === 'phinf.naver.net' ||
    hostname.endsWith('.phinf.naver.net')
  )
}
