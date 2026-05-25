/* eslint-env node */
/* eslint-disable no-undef */
const path = require('path')
const {
  buildLocalizedPaths,
  discoverPages,
  discoverLegalPages,
} = require('@status-im/sitemap-utils')

const APP_DIR = path.join(__dirname, 'src', 'app')
const LOCALES = ['en']
const PAGES = discoverPages(APP_DIR)
const LEGAL_PAGES = discoverLegalPages(APP_DIR)
const ALLOWED_PATHS = buildLocalizedPaths(LOCALES, PAGES).map(p => p.loc)

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://get.status.app',
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  changefreq: 'monthly',
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
  transform: async (config, path) => {
    if (
      path === '/robots.txt' ||
      path === '/sitemap.xml' ||
      /\.(png|jpg|jpeg|gif|svg|ico|webp|txt|xml|js|css|json)$/i.test(path)
    ) {
      return null
    }

    if (!ALLOWED_PATHS.includes(path)) {
      return null
    }

    return { loc: path }
  },
  additionalPaths: async () => {
    const result = [...buildLocalizedPaths(LOCALES, PAGES)]

    for (const legalPage of LEGAL_PAGES) {
      result.push({ loc: `/legal/${legalPage}` })
    }

    return result
  },
}
