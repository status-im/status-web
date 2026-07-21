import { loadEnvConfig } from '@next/env'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'

import { createBlogSearchPayload } from '../src/app/(website)/blog/_utils/search'

// Duplicated as an inline literal rather than shared with search.server.ts on
// purpose: that module needs a statically analysable path for @vercel/nft.
// See the comment on SEARCH_INDEX_PATHS there before changing this.
const OUTPUT_PATH = 'public/blog-search-index.json'

async function main() {
  loadEnvConfig(cwd())

  const { getPostsForSearch } = await import(
    '../src/app/(website)/_lib/ghost/index'
  )
  const posts = await getPostsForSearch()

  if (posts.length === 0) {
    throw new Error('Cannot generate an empty blog search index')
  }

  const payload = createBlogSearchPayload(posts)

  await writeFile(path.join(cwd(), OUTPUT_PATH), JSON.stringify(payload))

  console.log(`Generated blog search index for ${posts.length} posts`)
}

void main()
