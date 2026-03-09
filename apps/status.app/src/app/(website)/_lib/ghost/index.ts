import { clientEnv } from '~/config/env.client.mjs'

import { GhostContentAPI } from './client'

import type { PostOrPage } from '@tryghost/content-api'

/** @see https://ghost.org/docs/content-api# */
const ghost = GhostContentAPI({
  url: clientEnv.NEXT_PUBLIC_GHOST_API_URL,
  key: clientEnv.NEXT_PUBLIC_GHOST_API_KEY,
  version: 'v5.0',
})

type Params = { page?: number; limit?: number; tag?: string }

// Tags hidden from blog list but accessible by direct URL
export const HIDDEN_FROM_LIST_TAGS = ['desktop-news', 'mobile-news']

// Tags completely blocked (list + URL)
export const DISALLOWED_TAGS = ['status-network-blog']

const ALL_EXCLUDED_TAGS = [...HIDDEN_FROM_LIST_TAGS, ...DISALLOWED_TAGS]

const EXCLUDED_TAGS_FILTER = ALL_EXCLUDED_TAGS.map(tag => `tag:-${tag}`).join(
  '+'
)

function hasDisallowedTag(post: { tags?: Array<{ slug?: string | null }> }) {
  return post.tags?.some(
    tag => !!tag.slug && DISALLOWED_TAGS.includes(tag.slug)
  )
}

export const getPosts = async (params: Params = {}) => {
  const { page = 1, limit = 7, tag } = params

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
  } catch {
    return
  }
}

export const getPostsByTagSlug = async (slug: string, page = 1) => {
  try {
    const response = await ghost.posts.browse({
      filter: `tag:${slug}+visibility:public+${EXCLUDED_TAGS_FILTER}`,
      include: ['tags', 'authors'],
      limit: 6,
      order: 'published_at DESC',
      page,
    })

    return {
      posts: [...response],
      tag: response[0].tags!.find(tag => tag.slug === slug)!,
      meta: response.meta,
    }
  } catch {
    return
  }
}

export const getPostsByAuthorSlug = async (slug: string, page = 1) => {
  try {
    const response = await ghost.posts.browse({
      filter: `author:${slug}+visibility:public+${EXCLUDED_TAGS_FILTER}`,
      include: ['tags', 'authors'],
      limit: 6,
      order: 'published_at DESC',
      page,
    })

    return {
      posts: [...response],
      author: response[0].authors!.find(author => author.slug === slug)!,
      meta: response.meta,
    }
  } catch {
    return
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

export const getTagSlugs = async (): Promise<string[]> => {
  try {
    const tags = await ghost.tags.browse({
      limit: clientEnv.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'all' : 6,
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

export const getAuthorSlugs = async (): Promise<string[]> => {
  try {
    const authors = await ghost.authors.browse({
      limit: clientEnv.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'all' : 6,
      fields: 'slug',
      filter: `visibility:public`,
    })

    return authors.map(author => author.slug)
  } catch (error) {
    console.error('Failed to fetch author slugs from Ghost API:', error)
    return []
  }
}
