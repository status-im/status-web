export const blogMaintenanceHeaders = {
  'Cache-Control': 'no-store',
  'Content-Type': 'text/html; charset=utf-8',
  'Retry-After': '300',
}

export function isBlogInMaintenance() {
  // eslint-disable-next-line no-restricted-globals -- Read the same build flag in Next.js and Vercel.
  return process.env['BLOG_MAINTENANCE_MODE'] === '1'
}
