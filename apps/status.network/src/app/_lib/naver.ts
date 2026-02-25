import 'server-only'

const NAVER_RSS_URL = 'https://rss.blog.naver.com/status_korea.xml'
const REVALIDATE_SECONDS = 3600
const NAVER_IMAGE_PROXY_PATH = '/api/naver-image'

const ALLOWED_CATEGORIES = ['스테이터스 소식', '스테이터스 네트워크']

export type NaverPost = {
  title: string
  link: string
  category: string
  date: string
  image: string | null
}

export async function getNaverPosts(limit: number = 3): Promise<NaverPost[]> {
  try {
    const response = await fetch(NAVER_RSS_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
    })

    if (!response.ok) {
      throw new Error(`Naver RSS request failed with ${response.status}`)
    }

    const xml = await response.text()
    return parseNaverRSS(xml, limit)
  } catch (error) {
    console.error('Failed to fetch Naver blog RSS:', error)
    return []
  }
}

function parseNaverRSS(xml: string, limit: number): NaverPost[] {
  const items: NaverPost[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g

  let match
  while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
    const itemXml = match[1]

    const category = normalizeCategory(extractCDATA(itemXml, 'category'))
    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
      continue
    }

    const title = extractCDATA(itemXml, 'title')
    const link = extractCDATA(itemXml, 'link')
    const pubDate = extractTag(itemXml, 'pubDate')

    if (!title || !link) continue

    const description = extractCDATA(itemXml, 'description')
    const image = extractImageFromHTML(description)

    items.push({
      title,
      link: cleanNaverLink(link),
      category,
      date: pubDate
        ? new Date(pubDate).toISOString()
        : new Date().toISOString(),
      image,
    })
  }

  return items
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

function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}>([^<]*)</${tag}>`)
  const match = regex.exec(xml)
  return match ? match[1].trim() : null
}

function extractImageFromHTML(html: string | null): string | null {
  if (!html) return null
  const match = /<img[^>]+src=(["'])(.*?)\1/i.exec(html)
  if (!match) return null

  const normalizedImageUrl = normalizeNaverImageURL(
    decodeHTMLAttribute(match[2]),
  )
  if (!normalizedImageUrl) return null

  return `${NAVER_IMAGE_PROXY_PATH}?url=${encodeURIComponent(normalizedImageUrl)}`
}

function normalizeNaverImageURL(imageUrl: string): string | null {
  try {
    const url = new URL(imageUrl)

    if (url.protocol === 'http:') {
      url.protocol = 'https:'
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

function decodeHTMLAttribute(value: string): string {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
}

function normalizeCategory(category: string | null): string | null {
  if (!category) return null
  return category.replaceAll('\u00A0', ' ').trim()
}

function isAllowedNaverImageHost(hostname: string): boolean {
  return (
    hostname === 'pstatic.net' ||
    hostname.endsWith('.pstatic.net') ||
    hostname === 'phinf.naver.net' ||
    hostname.endsWith('.phinf.naver.net')
  )
}

function cleanNaverLink(link: string): string {
  try {
    const url = new URL(link)
    url.searchParams.delete('fromRss')
    url.searchParams.delete('trackingCode')
    return url.toString()
  } catch {
    return link
  }
}
