import { handleRssFeed } from '~app/_utils/rss-handler'

export const dynamic = 'force-dynamic'
export const revalidate = 300

export async function GET() {
  return handleRssFeed('mobile-news')
}
