import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hub.status.network'
  const locales = ['en', 'ko']
  const pages = ['', 'pre-deposits', 'discover', 'stake', 'karma']

  const routes: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const page of pages) {
      let path
      if (page === '') {
        path = locale === 'en' ? '/' : `/${locale}`
      } else {
        path = locale === 'en' ? `/${page}` : `/${locale}/${page}`
      }

      routes.push({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
      })
    }
  }

  return routes
}
