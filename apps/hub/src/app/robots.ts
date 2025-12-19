import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://hub.status.network'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  } satisfies MetadataRoute.Robots
}
