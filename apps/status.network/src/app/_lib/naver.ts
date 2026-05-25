import 'server-only'
import { NAVER_RSS_URL, parseNaverRSS } from './naver-rss'

const REVALIDATE_SECONDS = 3600

export type { NaverPost } from './naver-rss'

export async function getNaverPosts(limit: number = 3) {
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
