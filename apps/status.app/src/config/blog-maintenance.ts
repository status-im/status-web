export function isBlogInMaintenance() {
  // eslint-disable-next-line no-restricted-globals -- Next.js inlines this build flag in middleware.
  return process.env['BLOG_MAINTENANCE_MODE'] !== '0'
}
