import type { HomepageBlogCard } from './ghost-client'
import { NAVER_RSS_URL, parseNaverRSS, type NaverPost } from './naver-rss'

const BLOG_FALLBACK_IMAGE = '/opengraph-image.png'

export async function fetchHomepageNaverBlogCards(
  limit: number = 3,
): Promise<HomepageBlogCard[]> {
  const response = await fetch(NAVER_RSS_URL, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`Naver RSS request failed with ${response.status}`)
  }

  const xml = await response.text()
  return parseNaverRSS(xml, limit).map(toHomepageCard)
}

function toHomepageCard(post: NaverPost): HomepageBlogCard {
  return {
    category: post.category,
    title: post.title,
    authorName: null,
    authorAvatar: null,
    date: post.date,
    image: post.image ?? BLOG_FALLBACK_IMAGE,
    link: post.link,
  }
}
