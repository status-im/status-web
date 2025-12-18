/* eslint-env node */
/* eslint-disable no-undef */
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://status.network',
  generateRobotsTxt: false, // Using Next.js App Router robots.ts instead
  exclude: ['/api/*'],
  generateIndexSitemap: false,
  changefreq: 'monthly',
  priority: 0.7,
  // Note: robots.txt is handled by src/app/robots.ts (Next.js App Router)
}
