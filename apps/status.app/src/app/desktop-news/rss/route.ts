import { handleRssFeed } from '~app/_utils/rss-handler'

export const dynamic = 'force-dynamic'

export async function GET() {
  const response = await handleRssFeed('desktop-news')
  response.headers.set(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=300'
  )
  return response
}
