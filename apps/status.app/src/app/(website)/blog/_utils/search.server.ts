import 'server-only'

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'

import { getBlogSearchResultIds, loadBlogSearchIndex } from './search'

import type { BlogSearchPayload } from './search'
import type { BlogSearchResults } from './search-config'

/**
 * Written by `scripts/generate-blog-search-index.ts` before `next build`. The
 * two candidates cover the differing working directories of the Vercel and
 * standalone/Docker runtimes.
 *
 * Keep the paths inline at each read so the bundler traces the index file
 * instead of the working directory.
 *
 * Keep in sync with the output path in scripts/generate-blog-search-index.ts.
 */
let searchPayloadPromise: Promise<BlogSearchPayload> | undefined

/**
 * Memoizes `load()`, but drops the memo again when the promise rejects.
 * Without this a single transient failure (fs hiccup, etc.) would be cached for
 * the lifetime of the server instance and every later search would keep failing
 * even though a retry could succeed.
 */
function memoizeUntilFailure<T>(
  load: () => Promise<T>,
  getCached: () => Promise<T> | undefined,
  setCached: (value: Promise<T> | undefined) => void
): Promise<T> {
  const cached = getCached()
  if (cached) return cached

  const next = load().catch((error: unknown) => {
    setCached(undefined)
    throw error
  })
  setCached(next)
  return next
}

async function loadBlogSearchPayload(): Promise<BlogSearchPayload> {
  let payload: string
  try {
    payload = await readFile(
      path.join(cwd(), 'public/blog-search-index.json'),
      'utf8'
    )
  } catch (error) {
    const isMissingFile =
      error instanceof Error && 'code' in error && error.code === 'ENOENT'

    if (!isMissingFile) throw error

    payload = await readFile(
      path.join(cwd(), 'apps/status.app/public/blog-search-index.json'),
      'utf8'
    )
  }
  return JSON.parse(payload) as BlogSearchPayload
}

export function readBlogSearchPayload(): Promise<BlogSearchPayload> {
  return memoizeUntilFailure(
    loadBlogSearchPayload,
    () => searchPayloadPromise,
    value => {
      searchPayloadPromise = value
    }
  )
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
  // Memoized per server instance: parsing the payload and rebuilding the
  // MiniSearch index costs ~100ms, individual queries cost ~1ms.
  return memoizeUntilFailure(
    loadBlogSearchData,
    () => searchDataPromise,
    value => {
      searchDataPromise = value
    }
  )
}

type SearchBlogPostsParams = {
  query: string
  category?: string
  limit: number
}

/**
 * Single search entry point shared by the `/blog` server render and the
 * `/api/blog/search` route handler, so both stay in step.
 */
export async function searchBlogPosts({
  query,
  category,
  limit,
}: SearchBlogPostsParams): Promise<BlogSearchResults> {
  const { index, postsById, payload } = await readBlogSearchData()
  const resultIds = getBlogSearchResultIds(
    index,
    payload.records,
    query,
    category
  )

  return {
    posts: resultIds.slice(0, limit).flatMap(id => {
      const post = postsById.get(id)
      return post ? [post] : []
    }),
    total: resultIds.length,
  }
}

/** Blog browsing uses the deployment snapshot without contacting Ghost. */
export async function readBlogPostsPage(page: number, limit: number) {
  const { posts } = await readBlogSearchPayload()
  const pages = Math.ceil(posts.length / limit)
  return {
    posts: posts.slice((page - 1) * limit, page * limit),
    meta: {
      pagination: {
        page,
        limit,
        pages,
        total: posts.length,
        next: page < pages ? page + 1 : null,
        prev: page > 1 ? page - 1 : null,
      },
    },
  }
}
