/* eslint-env node */

/* eslint-disable @typescript-eslint/no-require-imports -- This config uses CommonJS. */
const fs = require('node:fs')
const path = require('path')
const {
  buildLocalizedPaths,
  discoverPages,
  discoverLegalPages,
} = require('@status-im/sitemap-utils')
const { redirects } = require('./vercel.json')

// Discover pages from app directory
const APP_DIR = path.join(__dirname, 'src', 'app')
const LOCALES = ['en', 'ko']
const PAGES = discoverPages(APP_DIR)
const LEGAL_PAGES = discoverLegalPages(APP_DIR)
const ALLOWED_PATHS = buildLocalizedPaths(LOCALES, PAGES).map(p => p.loc)

function getExportedBlogPaths() {
  // next-sitemap runs before the default locale prefix is stripped.
  const directory = path.join(__dirname, 'out', 'en', 'blog')
  if (!fs.existsSync(directory)) return []

  const redirectedPaths = new Set(redirects.map(({ source }) => source))
  const paths = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue

    const loc = `/blog/${entry.name.slice(0, -5)}`
    if (redirectedPaths.has(loc)) continue

    const html = fs.readFileSync(path.join(directory, entry.name), 'utf8')
    if (!/<article[\s>]/.test(html)) continue

    const publishedTime = html.match(
      /<meta property="article:published_time" content="([^"]+)"/,
    )?.[1]
    paths.push(publishedTime ? { loc, lastmod: publishedTime } : { loc })
  }
  return paths
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://status.network',
  outDir: 'out',
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
    const result = []

    // Add regular pages
    result.push(...buildLocalizedPaths(LOCALES, PAGES))

    // Add legal pages
    for (const locale of LOCALES) {
      for (const legalPage of LEGAL_PAGES) {
        const loc =
          locale === 'en'
            ? `/legal/${legalPage}`
            : `/${locale}/legal/${legalPage}`
        result.push({ loc })
      }
    }

    result.push(...getExportedBlogPaths())

    return result
  },
}
