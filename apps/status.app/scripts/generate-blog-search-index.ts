import { loadEnvConfig } from '@next/env'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'

import { createBlogSearchPayload } from '../src/app/(website)/blog/_utils/search'
import {
  BLOG_SEARCH_INDEX_DIRECTORY,
  BLOG_SEARCH_INDEX_FILENAME,
} from '../src/app/(website)/blog/_utils/search-index-path'

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
  const outputDirectory = path.join(cwd(), BLOG_SEARCH_INDEX_DIRECTORY)
  const outputPath = path.join(outputDirectory, BLOG_SEARCH_INDEX_FILENAME)

  await mkdir(outputDirectory, { recursive: true })
  await writeFile(outputPath, JSON.stringify(payload))

  console.log(`Generated blog search index for ${posts.length} posts`)
}

void main()
