import { loadEnvConfig } from '@next/env'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'

import { createBlogSearchPayload } from '../src/app/(website)/blog/_utils/search'

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
  const outputPath = path.join(cwd(), 'public/blog-search-index.json')

  await writeFile(outputPath, JSON.stringify(payload))

  console.log(`Generated blog search index for ${posts.length} posts`)
}

void main()
