/* eslint-env node */
/* eslint-disable no-undef */
const path = require('path')
const {
  buildLocalizedPaths,
  discoverPages,
  discoverLegalPages,
} = require('@status-im/sitemap-utils')

// Discover pages from app directory
const APP_DIR = path.join(__dirname, 'src', 'app')
const LOCALES = ['en', 'ko']
const PAGES = discoverPages(APP_DIR)
const LEGAL_PAGES = discoverLegalPages(APP_DIR)
const ALLOWED_PATHS = buildLocalizedPaths(LOCALES, PAGES).map(p => p.loc)

const GHOST_URL = (
  process.env.GHOST_API_URL || 'https://our.status.im'
).replace(/\/+$/, '')
const GHOST_API_KEY = process.env.GHOST_API_KEY
const NETWORK_BLOG_TAG = 'status-network-blog'

async function fetchAllBlogPosts() {
  if (!GHOST_API_KEY) return []

  const posts = []
  let page = 1

  while (true) {
    const url = new URL('/ghost/api/content/posts/', GHOST_URL)
    url.searchParams.set('key', GHOST_API_KEY)
    url.searchParams.set('fields', 'slug,published_at')
    url.searchParams.set('filter', `tag:${NETWORK_BLOG_TAG}+visibility:public`)
    url.searchParams.set('limit', '100')
    url.searchParams.set('page', String(page))

    try {
      const response = await fetch(url.toString())
      if (!response.ok) break

      const data = await response.json()
      posts.push(...data.posts)

      if (!data.meta.pagination.next) break
      page = data.meta.pagination.next
    } catch {
      break
    }
  }

  return posts
}

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

    // Add blog posts with actual publish dates
    const posts = await fetchAllBlogPosts()
    for (const post of posts) {
      for (const locale of LOCALES) {
        const loc =
          locale === 'en'
            ? `/blog/${post.slug}`
            : `/${locale}/blog/${post.slug}`
        result.push({
          loc,
          lastmod: post.published_at,
        })
      }
    }

    return result
  },
}
