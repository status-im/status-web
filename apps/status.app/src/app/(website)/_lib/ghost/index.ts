import { clientEnv } from '~/config/env.client.mjs'

import { GhostContentAPI } from './client'

import type { PostOrPage } from '@tryghost/content-api'

/** @see https://ghost.org/docs/content-api# */
const ghost = GhostContentAPI({
  url: clientEnv.NEXT_PUBLIC_GHOST_API_URL,
  key: clientEnv.NEXT_PUBLIC_GHOST_API_KEY,
  version: 'v5.0',
})

// Dedicated Ghost client for /learn fetches. Skips the Next.js data cache so
// editorial changes (new posts, retitles, unpublishes) surface immediately
// instead of waiting up to an hour for the default 1h fetch revalidation.
const ghostLive = GhostContentAPI({
  url: clientEnv.NEXT_PUBLIC_GHOST_API_URL,
  key: clientEnv.NEXT_PUBLIC_GHOST_API_KEY,
  version: 'v5.0',
  makeRequest: async ({
    url,
    method,
    params,
    headers,
  }: {
    url: string
    method: string
    params: Record<string, string>
    headers: Record<string, string>
  }) => {
    const queryString = new URLSearchParams(params).toString()
    const fullUrl = `${url}${queryString ? `?${queryString}` : ''}`
    const response = await fetch(fullUrl, {
      method: method.toUpperCase(),
      headers,
      cache: 'no-store',
    })
    if (!response.ok) {
      const error: Error & { statusCode?: number } = new Error(
        `HTTP error! status: ${response.status}`
      )
      error.statusCode = response.status
      throw error
    }
    return response.json()
  },
})

/**
 * Ghost answering "no such post" is a 404 the route should render.
 *
 * Anything else, a 429 under crawl load, a 5xx, a network blip, is a failed
 * call. Treating those as "not found" turns a momentary Ghost outage into a
 * `notFound()` that Next then caches for the route's whole revalidate window,
 * so a crawler that arrives during the blip sees a 404 for the next hour.
 */
function isGhostNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    (error as { statusCode?: number }).statusCode === 404
  )
}

type Params = { page?: number; limit?: number; tag?: string }

// Tags hidden from blog list but accessible by direct URL
export const HIDDEN_FROM_LIST_TAGS = ['desktop-news', 'mobile-news']

// Tags completely blocked (list + URL)
export const DISALLOWED_TAGS = ['status-network-blog']

// Tag for posts published exclusively under the /learn section.
// Excluded from /blog listings and default Ghost fetchers; surfaced via
// dedicated getLearnPosts* fetchers below. Direct /blog/[slug] URLs still
// resolve so canonical SEO URLs remain stable.
export const LEARN_TAG = 'status-insights'

const ALL_EXCLUDED_TAGS = [
  ...HIDDEN_FROM_LIST_TAGS,
  ...DISALLOWED_TAGS,
  LEARN_TAG,
]

const EXCLUDED_TAGS_FILTER = ALL_EXCLUDED_TAGS.map(tag => `tag:-${tag}`).join(
  '+'
)

// Exclusion filter for /learn fetches: keeps the global exclusions
// (hidden/disallowed tags) but allows LEARN_TAG itself.
const LEARN_FETCH_EXCLUDED_TAGS_FILTER = [
  ...HIDDEN_FROM_LIST_TAGS,
  ...DISALLOWED_TAGS,
]
  .map(tag => `tag:-${tag}`)
  .join('+')

function hasDisallowedTag(post: { tags?: Array<{ slug?: string | null }> }) {
  return post.tags?.some(
    tag => !!tag.slug && DISALLOWED_TAGS.includes(tag.slug)
  )
}

/**
 * Page size for /blog and its `/blog/page/[page]` continuations. Shared so the
 * crawlable pager splits the archive on exactly the boundaries Ghost does.
 */
export const BLOG_PAGE_SIZE = 7

/** Page size for the tag and author archives and their continuations. */
export const ARCHIVE_PAGE_SIZE = 6

export const getPosts = async (params: Params = {}) => {
  const { page = 1, limit = BLOG_PAGE_SIZE, tag } = params

  try {
    const response = await ghost.posts.browse({
      include: ['tags', 'authors'],
      order: 'published_at DESC',
      limit,
      page,
      ...(tag
        ? { filter: `tag:${tag}+visibility:public+${EXCLUDED_TAGS_FILTER}` }
        : { filter: `visibility:public+${EXCLUDED_TAGS_FILTER}` }),
    })

    return { posts: [...response], meta: response.meta }
  } catch (error) {
    console.error('Failed to fetch posts from Ghost API:', error)
    return {
      posts: [],
      meta: {
        pagination: {
          page: 1,
          limit,
          pages: 0,
          total: 0,
          next: null,
          prev: null,
        },
      },
    }
  }
}

export const getPostsForSearch = async () => {
  try {
    const response = await ghost.posts.browse({
      include: ['tags', 'authors'],
      formats: ['plaintext'],
      order: 'published_at DESC',
      limit: 'all',
      filter: `visibility:public+${EXCLUDED_TAGS_FILTER}`,
    })

    return [...response]
  } catch (error) {
    console.error('Failed to fetch posts for blog search:', error)
    return []
  }
}

const RELEASE_TITLE_PATTERN = /\bv\d+\.\d+/

export function findLatestReleasePost(posts: PostOrPage[]): PostOrPage | null {
  if (posts.length === 0) return null

  const releasePost = posts.find(
    post => post.title && RELEASE_TITLE_PATTERN.test(post.title)
  )

  return releasePost ?? null
}

export const getPostBySlug = async (slug: string) => {
  try {
    const post = await ghost.posts.read(
      { slug },
      {
        include: ['tags', 'authors'],
      }
    )

    if (hasDisallowedTag(post)) {
      return
    }

    return post
  } catch (error) {
    if (isGhostNotFoundError(error)) {
      return
    }

    throw error
  }
}

/**
 * An archive is "not found" when Ghost returns no posts for it.
 *
 * Ghost answers both an unknown tag and a page past the end with 200 and an
 * empty list, so emptiness is the only not-found signal a browse can give. A
 * thrown error means the call itself failed, and the previous blanket `catch`
 * turned those into `notFound()`, which Next then cached for the route's whole
 * revalidate window. Let them propagate instead: callers that can live without
 * the result, like the related-posts strip, catch it themselves.
 */
export const getPostsByTagSlug = async (slug: string, page = 1) => {
  const response = await ghost.posts.browse({
    filter: `tag:${slug}+visibility:public+${EXCLUDED_TAGS_FILTER}`,
    include: ['tags', 'authors'],
    limit: ARCHIVE_PAGE_SIZE,
    order: 'published_at DESC',
    page,
  })

  const tag = response[0]?.tags?.find(tag => tag.slug === slug)

  if (!tag) {
    return
  }

  return {
    posts: [...response],
    tag,
    meta: response.meta,
  }
}

/** @see getPostsByTagSlug for why this does not swallow errors. */
export const getPostsByAuthorSlug = async (slug: string, page = 1) => {
  const response = await ghost.posts.browse({
    filter: `author:${slug}+visibility:public+${EXCLUDED_TAGS_FILTER}`,
    include: ['tags', 'authors'],
    limit: ARCHIVE_PAGE_SIZE,
    order: 'published_at DESC',
    page,
  })

  const author = response[0]?.authors?.find(author => author.slug === slug)

  if (!author) {
    return
  }

  return {
    posts: [...response],
    author,
    meta: response.meta,
  }
}

export const getPostSlugs = async (): Promise<string[]> => {
  try {
    const posts = await ghost.posts.browse({
      limit: 7,
      fields: 'slug',
      filter: `visibility:public+${EXCLUDED_TAGS_FILTER}`,
    })

    return posts.map(post => post.slug)
  } catch (error) {
    console.error('Failed to fetch post slugs from Ghost API:', error)
    return []
  }
}

export type PostSitemapEntry = {
  slug: string
  updatedAt: string
}

/**
 * Every public post, unsampled.
 *
 * These fetchers used to cap the page size outside Vercel production, which
 * silently truncated the sitemap to the first 50 posts wherever
 * `NEXT_PUBLIC_VERCEL_ENV` was undefined. A sampled sitemap is worse than no
 * sitemap: the posts it omits lose their only discovery path, because /blog
 * pages through Ghost on the client and links no further than its first grid.
 */
export const getPostsForSitemap = async (): Promise<PostSitemapEntry[]> => {
  try {
    const posts = await ghost.posts.browse({
      limit: 'all',
      fields: 'slug,updated_at,published_at',
      filter: `visibility:public+${EXCLUDED_TAGS_FILTER}`,
    })

    return posts
      .filter(post => !!post.slug)
      .map(post => ({
        slug: post.slug,
        updatedAt: post.updated_at ?? post.published_at ?? '',
      }))
  } catch (error) {
    console.error('Failed to fetch posts for sitemap from Ghost API:', error)
    return []
  }
}

export const getTagSlugs = async (): Promise<string[]> => {
  try {
    const tags = await ghost.tags.browse({
      limit: 'all',
      fields: 'slug',
      filter: `visibility:public`,
    })

    return tags
      .map(tag => tag.slug)
      .filter(
        (slug): slug is string => !!slug && !ALL_EXCLUDED_TAGS.includes(slug)
      )
  } catch (error) {
    console.error('Failed to fetch tag slugs from Ghost API:', error)
    return []
  }
}

type LearnParams = { page?: number; limit?: number }

export const getLearnPosts = async (params: LearnParams = {}) => {
  const { page = 1, limit = 12 } = params

  try {
    const response = await ghostLive.posts.browse({
      include: ['tags', 'authors'],
      order: 'published_at DESC',
      limit,
      page,
      filter: `tag:${LEARN_TAG}+visibility:public+${LEARN_FETCH_EXCLUDED_TAGS_FILTER}`,
    })

    return { posts: [...response], meta: response.meta }
  } catch (error) {
    console.error('Failed to fetch /learn posts from Ghost API:', error)
    return {
      posts: [],
      meta: {
        pagination: {
          page: 1,
          limit,
          pages: 0,
          total: 0,
          next: null,
          prev: null,
        },
      },
    }
  }
}

export const getLearnPostsForSitemap = async (): Promise<
  PostSitemapEntry[]
> => {
  try {
    const posts = await ghostLive.posts.browse({
      limit: 'all',
      fields: 'slug,updated_at,published_at',
      filter: `tag:${LEARN_TAG}+visibility:public+${LEARN_FETCH_EXCLUDED_TAGS_FILTER}`,
    })

    return posts
      .filter(post => !!post.slug)
      .map(post => ({
        slug: post.slug,
        updatedAt: post.updated_at ?? post.published_at ?? '',
      }))
  } catch (error) {
    console.error(
      'Failed to fetch /learn posts for sitemap from Ghost API:',
      error
    )
    return []
  }
}

export const getAuthorSlugs = async (): Promise<string[]> => {
  try {
    const authors = await ghost.authors.browse({
      limit: 'all',
      fields: 'slug',
      filter: `visibility:public`,
    })

    return authors.map(author => author.slug)
  } catch (error) {
    console.error('Failed to fetch author slugs from Ghost API:', error)
    return []
  }
}
