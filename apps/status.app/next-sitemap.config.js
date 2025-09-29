/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://status.app',
  generateRobotsTxt: true,
  exclude: ['/u', '/c', '/cc'],
  // We don't want to generate a index sitemap since we don't have a lot of pages for now
  generateIndexSitemap: false,
  // Frequency of how often sitemap.xml is updated
  changefreq: 'monthly',
}
