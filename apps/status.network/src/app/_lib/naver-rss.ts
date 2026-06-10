import { extractNaverImageURLFromDescription } from './naver-image-url'

export const NAVER_RSS_URL = 'https://rss.blog.naver.com/status_korea.xml'

const ALLOWED_CATEGORIES = ['스테이터스 소식', '스테이터스 네트워크']

export type NaverPost = {
  title: string
  link: string
  category: string
  date: string
  image: string | null
}

export function parseNaverRSS(xml: string, limit: number): NaverPost[] {
  const items: NaverPost[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g

  let match: RegExpExecArray | null
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
    const image = extractNaverImageURLFromDescription(description)

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
