/* eslint-env node */
/* eslint-disable no-undef */

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://hub.status.network',
  generateRobotsTxt: false, // Using Next.js App Router robots.ts instead
  generateIndexSitemap: false,
  changefreq: 'monthly',
  exclude: ['/api/*', '*/404', '*/404/*', '/icon2.png', '/robots.txt'],
}
