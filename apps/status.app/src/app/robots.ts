import { SITE_URL } from '~/config/site'

import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin$',
          '/admin/*',
          '/api/*',
          '/u$',
          '/u/*',
          '/c$',
          '/c/*',
          '/cc$',
          '/cc/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
