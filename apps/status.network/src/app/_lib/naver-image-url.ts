export function extractNaverImageURLFromDescription(
  description: string | null,
): string | null {
  if (!description) return null

  const match = /<img[^>]+src=(["'])(.*?)\1/i.exec(description)
  if (!match) return null

  return normalizeNaverImageURL(decodeURLAttributeAmpersand(match[2]))
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

    if (url.searchParams.get('type') === 's3') {
      url.searchParams.set('type', 'w2')
    }

    return url.toString()
  } catch {
    return null
  }
}

function decodeURLAttributeAmpersand(value: string): string {
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
