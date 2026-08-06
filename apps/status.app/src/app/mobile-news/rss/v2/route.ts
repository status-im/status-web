import { handleRssFeed } from '~app/_utils/rss-handler'

export const dynamic = 'force-dynamic'

export async function GET() {
  const response = await handleRssFeed('mobile-news', 'v2')
  response.headers.set(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=300'
  )
  return response
}
