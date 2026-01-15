/* eslint-env node */
/* eslint-disable no-undef */
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

module.exports = { buildLocalizedPaths }
