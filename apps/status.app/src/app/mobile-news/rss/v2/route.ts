import { handleRssFeed } from '~app/_utils/rss-handler'

export const dynamic = 'force-dynamic'

export async function GET() {
  return handleRssFeed('mobile-news', 'v2')
}
