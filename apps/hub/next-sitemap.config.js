/* eslint-env node */
/* eslint-disable no-undef */
const path = require('path')
const { buildLocalizedPaths, discoverPages } = require('./sitemap-utils')

// Discover pages from app directory
const APP_DIR = path.join(__dirname, 'src', 'app')
const LOCALES = ['en', 'ko']
const PAGES = discoverPages(APP_DIR)

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

    // Generate allowed paths dynamically from discovered pages
    const allowedPaths = buildLocalizedPaths(LOCALES, PAGES).map(p => p.loc)

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
    const changefreq = 'monthly'
    return buildLocalizedPaths(LOCALES, PAGES, changefreq)
  },
}
