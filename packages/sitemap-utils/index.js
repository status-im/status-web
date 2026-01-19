/* eslint-env node */
const fs = require('fs')
const path = require('path')

function buildLocalizedPaths(locales, pages, changefreq = 'monthly') {
  const result = []
  const lastmod = new Date().toISOString()

  for (const locale of locales) {
    for (const page of pages) {
      let loc
      if (page === '') {
        loc = locale === 'en' ? '/' : `/${locale}`
      } else {
        loc = locale === 'en' ? `/${page}` : `/${locale}/${page}`
      }

      result.push({
        loc,
        changefreq,
        lastmod,
      })
    }
  }

  return result
}

function discoverPages(appDir) {
  const localeDir = path.join(appDir, '[locale]')

  if (!fs.existsSync(localeDir)) {
    console.warn(`[locale] directory not found at ${localeDir}`)
    return ['']
  }

  const pages = ['']

  try {
    const entries = fs.readdirSync(localeDir, { withFileTypes: true })

    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('_')) {
        continue
      }

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

function discoverLegalPages(appDir) {
  const legalDir = path.join(appDir, 'legal')

  if (!fs.existsSync(legalDir)) {
    return []
  }

  const legalPages = []

  try {
    const entries = fs.readdirSync(legalDir, { withFileTypes: true })

    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('_')) {
        continue
      }

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
