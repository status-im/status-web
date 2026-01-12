/* eslint-env node */
/* eslint-disable no-undef */
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://hub.status.network',
  generateRobotsTxt: false, // Using Next.js App Router robots.ts instead
  exclude: ['/api/*'],
  generateIndexSitemap: false,
  changefreq: 'monthly',
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
  // Note: robots.txt is handled by src/app/robots.ts (Next.js App Router)
}
