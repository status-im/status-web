import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnvFiles } from './load-env-files.mjs'

loadEnvFiles()

const GHOST_URL = (
  process.env.GHOST_API_URL ?? 'https://our.status.im'
).replace(/\/+$/, '')
const GHOST_API_KEY = process.env.GHOST_API_KEY
const NETWORK_BLOG_TAG = 'status-network-blog'
const DISALLOWED_TAGS_FILTER = ['desktop-news', 'mobile-news']
  .map(tag => `tag:-${tag}`)
  .join('+')
const OUTPUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../content/network-blog-slugs.json',
)

if (!GHOST_API_KEY) {
  console.error('❌ GHOST_API_KEY is required. Set it in .env.local first.')
  process.exit(1)
}

const url = new URL('/ghost/api/content/posts/', GHOST_URL)
url.searchParams.set('key', GHOST_API_KEY)
url.searchParams.set('fields', 'slug')
url.searchParams.set('limit', 'all')
url.searchParams.set(
  'filter',
  `tag:${NETWORK_BLOG_TAG}+visibility:public+${DISALLOWED_TAGS_FILTER}`,
)

const response = await fetch(url.toString())

if (!response.ok) {
  console.error(`❌ Ghost API request failed with ${response.status}`)
  process.exit(1)
}

const data = await response.json()
const slugs = data.posts.map(post => post.slug)

writeFileSync(OUTPUT, `${JSON.stringify(slugs, null, 2)}\n`, 'utf8')

console.info(
  `✅ Wrote ${slugs.length} slug(s) to content/network-blog-slugs.json`,
)
