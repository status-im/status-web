/* eslint-env node */
/* eslint-disable no-undef */
const path = require('path')
const {
  buildLocalizedPaths,
  discoverPages,
} = require('@status-im/sitemap-utils')

// Discover pages from app directory
const APP_DIR = path.join(__dirname, 'src', 'app')
const LOCALES = ['en', 'ko']
const PAGES = discoverPages(APP_DIR)
const ALLOWED_PATHS = buildLocalizedPaths(LOCALES, PAGES).map(p => p.loc)

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://hub.status.network',
  generateRobotsTxt: false, // Using Next.js App Router robots.ts instead
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
    '/icon2.png',
    '/_next/*',
    '/static/*',
    '*/404',
    '*/404/*',
  ],
  transform: async (config, path) => {
    if (!ALLOWED_PATHS.includes(path)) {
      return null
    }

    return {
      loc: path,
      changefreq: config.changefreq,
    }
  },
  additionalPaths: async () => {
    const changefreq = 'monthly'
    return buildLocalizedPaths(LOCALES, PAGES, changefreq).map(
      ({ loc, changefreq: freq }) => ({
        loc,
        changefreq: freq,
      })
    )
  },
}
