import { loadEnvFiles } from './load-env-files.mjs'

loadEnvFiles()

const required = ['GHOST_API_KEY']
const missing = required.filter(key => !process.env[key]?.trim())

if (missing.length > 0) {
  console.error(
    '❌ Missing environment variables required for static export:',
    missing.join(', '),
  )
  console.info('')
  console.info('Local setup:')
  console.info('  1. cp .env.example .env.local')
  console.info('  2. Fill GHOST_API_* (Content API key from Ghost / Vercel)')
  console.info(
    '  3. Set NEXT_PUBLIC_GHOST_API_* to the same values for client refresh',
  )
  console.info(
    '  4. Or run: vercel env pull .env.local  (from apps/status.network)',
  )
  console.info('')
  process.exit(1)
}

if (!process.env.NEXT_PUBLIC_GHOST_API_KEY?.trim()) {
  console.warn(
    '⚠️  NEXT_PUBLIC_GHOST_API_KEY is not set. Build will succeed, but homepage and /blog/[slug] pages will not refresh from Ghost in the browser.',
  )
}

if (!process.env.NEXT_PUBLIC_GHOST_API_URL?.trim()) {
  console.warn(
    '⚠️  NEXT_PUBLIC_GHOST_API_URL is not set. Client refresh will default to https://our.status.im',
  )
}

console.info('✅ Ghost environment variables are set for static export.')
