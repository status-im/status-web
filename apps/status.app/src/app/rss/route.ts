import { handleRssFeed } from '~app/_utils/rss-handler'

export const revalidate = 60

export async function GET() {
  return handleRssFeed('main')
}
