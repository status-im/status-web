import 'server-only'

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'

import { loadBlogSearchIndex } from './search'

import type { BlogSearchPayload } from './search'

const SEARCH_INDEX_PATHS = [
  path.join(cwd(), 'public/blog-search-index.json'),
  path.join(cwd(), 'apps/status.app/public/blog-search-index.json'),
]

let searchPayloadPromise: Promise<BlogSearchPayload> | undefined

async function loadBlogSearchPayload(): Promise<BlogSearchPayload> {
  for (const indexPath of SEARCH_INDEX_PATHS) {
    try {
      const payload = await readFile(indexPath, 'utf8')
      return JSON.parse(payload) as BlogSearchPayload
    } catch (error) {
      const isMissingFile =
        error instanceof Error && 'code' in error && error.code === 'ENOENT'

      if (!isMissingFile) throw error
    }
  }

  throw new Error('Blog search index was not generated')
}

export function readBlogSearchPayload(): Promise<BlogSearchPayload> {
  searchPayloadPromise ??= loadBlogSearchPayload()
  return searchPayloadPromise
}

async function loadBlogSearchData() {
  const payload = await readBlogSearchPayload()

  return {
    payload,
    index: loadBlogSearchIndex(payload.searchIndex),
    postsById: new Map(payload.posts.map(post => [post.id, post])),
  }
}

let searchDataPromise: ReturnType<typeof loadBlogSearchData> | undefined

export function readBlogSearchData() {
  searchDataPromise ??= loadBlogSearchData()
  return searchDataPromise
}
