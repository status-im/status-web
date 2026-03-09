import 'server-only'
import {
  createNaverImageKey,
  extractNaverImageURLFromDescription,
  NAVER_RSS_URL,
} from './naver-image'

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
  const normalizedImageUrl = extractNaverImageURLFromDescription(html)
  if (!normalizedImageUrl) return null

  const key = createNaverImageKey(normalizedImageUrl)
  return `${NAVER_IMAGE_PROXY_PATH}?key=${encodeURIComponent(key)}`
}

function normalizeCategory(category: string | null): string | null {
  if (!category) return null
  return category.replaceAll('\u00A0', ' ').trim()
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
