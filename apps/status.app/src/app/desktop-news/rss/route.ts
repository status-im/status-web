import { handleRssFeed } from '~app/_utils/rss-handler'

export const revalidate = 300

export async function GET() {
  return handleRssFeed('desktop-news')
}
