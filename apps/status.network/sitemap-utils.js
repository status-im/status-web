/* eslint-env node */
/* eslint-disable no-undef */
const fs = require('fs')
const path = require('path')

function buildLocalizedPaths(locales, pages, changefreq = 'monthly') {
  const result = []
  const lastmod = new Date().toISOString()

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
        lastmod,
      })
    }
  }

  return result
}

/**
 * Discover pages by scanning the app/[locale] directory
 * @param {string} appDir - Path to the app directory
 * @returns {string[]} Array of page slugs (e.g., ['', 'brand'])
 */
function discoverPages(appDir) {
  const localeDir = path.join(appDir, '[locale]')

  if (!fs.existsSync(localeDir)) {
    console.warn(`[locale] directory not found at ${localeDir}`)
    return ['']
  }

  const pages = [''] // Always include root page

  try {
    const entries = fs.readdirSync(localeDir, { withFileTypes: true })

    for (const entry of entries) {
      // Skip non-directories and special directories
      if (!entry.isDirectory() || entry.name.startsWith('_')) {
        continue
      }

      // Check if directory contains a page.tsx or page.js
      const pagePath = path.join(localeDir, entry.name, 'page.tsx')
      const pagePathJs = path.join(localeDir, entry.name, 'page.js')

      if (fs.existsSync(pagePath) || fs.existsSync(pagePathJs)) {
        pages.push(entry.name)
      }
    }
  } catch (error) {
    console.error('Error discovering pages:', error)
  }

  return pages
}

/**
 * Discover legal pages by scanning the app/legal directory
 * @param {string} appDir - Path to the app directory
 * @returns {string[]} Array of legal page slugs
 */
function discoverLegalPages(appDir) {
  const legalDir = path.join(appDir, 'legal')

  if (!fs.existsSync(legalDir)) {
    console.warn(`legal directory not found at ${legalDir}`)
    return []
  }

  const legalPages = []

  try {
    const entries = fs.readdirSync(legalDir, { withFileTypes: true })

    for (const entry of entries) {
      // Skip non-directories and special directories
      if (!entry.isDirectory() || entry.name.startsWith('_')) {
        continue
      }

      // Check if directory contains a page.tsx or page.js
      const pagePath = path.join(legalDir, entry.name, 'page.tsx')
      const pagePathJs = path.join(legalDir, entry.name, 'page.js')

      if (fs.existsSync(pagePath) || fs.existsSync(pagePathJs)) {
        legalPages.push(entry.name)
      }
    }
  } catch (error) {
    console.error('Error discovering legal pages:', error)
  }

  return legalPages
}

module.exports = { buildLocalizedPaths, discoverPages, discoverLegalPages }
