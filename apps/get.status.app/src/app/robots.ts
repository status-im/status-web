import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://get.status.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    // Remove the sitemap line since it's empty and shouldn't be advertised
  }
}
