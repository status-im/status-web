/* eslint-env node */
/* eslint-disable no-undef */
const path = require('path')
const {
  buildLocalizedPaths,
  discoverPages,
  discoverLegalPages,
} = require('./sitemap-utils')

// Discover pages from app directory
const APP_DIR = path.join(__dirname, 'src', 'app')
const LOCALES = ['en', 'ko']
const PAGES = discoverPages(APP_DIR)
const LEGAL_PAGES = discoverLegalPages(APP_DIR)

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

    // Generate allowed paths dynamically from discovered pages
    const allowedPaths = buildLocalizedPaths(LOCALES, PAGES).map(p => p.loc)

    // Add legal pages
    const lastmod = new Date().toISOString()
    for (const locale of LOCALES) {
      for (const legalPage of LEGAL_PAGES) {
        const legalPath =
          locale === 'en'
            ? `/legal/${legalPage}`
            : `/${locale}/legal/${legalPage}`
        allowedPaths.push(legalPath)
      }
    }

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
    const changefreq = 'monthly'

    // Add regular pages
    result.push(...buildLocalizedPaths(LOCALES, PAGES, changefreq))

    // Add legal pages
    const lastmod = new Date().toISOString()
    for (const locale of LOCALES) {
      for (const legalPage of LEGAL_PAGES) {
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
