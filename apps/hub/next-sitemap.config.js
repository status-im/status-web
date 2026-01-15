/* eslint-env node */
/* eslint-disable no-undef */
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://hub.status.network',
  generateRobotsTxt: false,
  exclude: [
    '/api/*',
    '/*.png',
    '/*.jpg',
    '/*.jpeg',
    '/*.gif',
    '/*.svg',
    '/*.ico',
    '/*.webp',
    '/*.txt',
    '/*.xml',
    '/robots.txt',
    '/sitemap.xml',
    '/dashboard',
    '/icon2.png',
    '/_next/*',
    '/static/*',
  ],
  generateIndexSitemap: false,
  changefreq: 'monthly',
  transform: async (config, path) => {
    if (path === '/dashboard') {
      return null
    }

    const allowedPaths = [
      '/',
      '/pre-deposits',
      '/discover',
      '/stake',
      '/karma',
      '/ko',
      '/ko/pre-deposits',
      '/ko/discover',
      '/ko/stake',
      '/ko/karma',
    ]

    if (!allowedPaths.includes(path)) {
      return null
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
  additionalPaths: async () => {
    const result = []
    const locales = ['en', 'ko']
    const pages = ['', 'pre-deposits', 'discover', 'stake', 'karma']
    const changefreq = 'monthly'

    for (const locale of locales) {
      for (const page of pages) {
        let path
        if (page === '') {
          path = locale === 'en' ? '/' : `/${locale}`
        } else {
          path = locale === 'en' ? `/${page}` : `/${locale}/${page}`
        }

        result.push({
          loc: path,
          changefreq,
          lastmod: new Date().toISOString(),
        })
      }
    }

    return result
  },
}
