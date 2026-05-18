import { handleRssFeed } from '~app/_utils/rss-handler'

export const revalidate = 60

export async function GET() {
  const response = await handleRssFeed('main')

  const headers = new Headers(response.headers)
  headers.set('content-type', 'application/xml; charset=utf-8')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
