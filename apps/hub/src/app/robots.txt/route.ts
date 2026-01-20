export const dynamic = 'force-static'

export function GET() {
  const baseUrl = 'https://hub.status.network'

  const content = `User-agent: *
Allow: /
Disallow: /api/*

Sitemap: ${baseUrl}/sitemap.xml
llms: ${baseUrl}/llms.txt
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
