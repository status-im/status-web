/* eslint-env node */
/* eslint-disable no-undef */
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://status.app',
  generateRobotsTxt: false, // Using Next.js App Router robots.ts instead
  exclude: ['/u', '/c', '/cc', '/admin', '/admin/*', '/api/*'],
  // We don't want to generate a index sitemap since we don't have a lot of pages for now
  generateIndexSitemap: false,
  // Frequency of how often sitemap.xml is updated
  changefreq: 'monthly',
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
  // Additional paths configuration
  additionalPaths: async () => {
    const result = []

    // Add dynamic routes if needed
    // Example: blog posts, help articles, etc.
    // These would typically be generated from your content source

    return result
  },
  // Note: robots.txt is handled by src/app/robots.ts (Next.js App Router)
  // robotsTxtOptions is not needed when generateRobotsTxt is false
}
