import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://status.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*', '/u', '/c', '/cc'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
