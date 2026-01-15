/* eslint-env node */
/* eslint-disable no-undef */
const { buildLocalizedPaths } = require('./sitemap-utils')

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://status.network',
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
    '/_next/*',
    '/static/*',
  ],
  generateIndexSitemap: false,
  changefreq: 'monthly',
  transform: async (config, path) => {
    if (
      path === '/robots.txt' ||
      path === '/sitemap.xml' ||
      /\.(png|jpg|jpeg|gif|svg|ico|webp|txt|xml|js|css|json)$/i.test(path)
    ) {
      return null
    }

    const allowedPaths = [
      '/',
      '/brand',
      '/ko',
      '/ko/brand',
      '/legal/privacy-policy',
      '/legal/terms-of-use',
      '/legal/status-network-pre-deposit-disclaimer',
      '/ko/legal/privacy-policy',
      '/ko/legal/terms-of-use',
      '/ko/legal/status-network-pre-deposit-disclaimer',
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
    const pages = ['', 'brand']
    const legalPages = [
      'privacy-policy',
      'terms-of-use',
      'status-network-pre-deposit-disclaimer',
    ]
    const changefreq = 'monthly'

    result.push(...buildLocalizedPaths(locales, pages, changefreq))

    const lastmod = new Date().toISOString()
    for (const locale of locales) {
      for (const legalPage of legalPages) {
        const path =
          locale === 'en'
            ? `/legal/${legalPage}`
            : `/${locale}/legal/${legalPage}`
        result.push({
          loc: path,
          changefreq,
          lastmod,
        })
      }
    }

    return result
  },
}
