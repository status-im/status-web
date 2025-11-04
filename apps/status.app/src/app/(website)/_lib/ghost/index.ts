import { clientEnv } from '~/config/env.client.mjs'

import { GhostContentAPI } from './client'

/** @see https://ghost.org/docs/content-api# */
const ghost = GhostContentAPI({
  url: clientEnv.NEXT_PUBLIC_GHOST_API_URL,
  key: clientEnv.NEXT_PUBLIC_GHOST_API_KEY,
  version: 'v5.0',
})

type Params = { page?: number; limit?: number; tag?: string }

export const DISALLOWED_TAGS = ['desktop-news', 'mobile-news']

const DISALLOWED_TAGS_FILTER = DISALLOWED_TAGS.map(tag => `tag:-${tag}`).join(
  '+'
)

export const getPosts = async (params: Params = {}) => {
  const { page = 1, limit = 7, tag } = params

  try {
    const response = await ghost.posts.browse({
      include: ['tags', 'authors'],
      order: 'published_at DESC',
      limit,
      page,
      ...(tag
        ? { filter: `tag:${tag}+visibility:public` }
        : { filter: `visibility:public+${DISALLOWED_TAGS_FILTER}` }),
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

export const getPostBySlug = async (slug: string) => {
  try {
    return await ghost.posts.read(
      { slug },
      {
        include: ['tags', 'authors'],
      }
    )
  } catch {
    return
  }
}

export const getPostsByTagSlug = async (slug: string, page = 1) => {
  try {
    const response = await ghost.posts.browse({
      filter: `tag:${slug}+visibility:public+${DISALLOWED_TAGS_FILTER}`,
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
      filter: `author:${slug}+visibility:public+${DISALLOWED_TAGS_FILTER}`,
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
  const posts = await ghost.posts.browse({
    limit: 7,
    fields: 'slug',
    filter: `visibility:public+${DISALLOWED_TAGS_FILTER}`,
  })

  return posts.map(post => post.slug)
}

export const getTagSlugs = async (): Promise<string[]> => {
  const tags = await ghost.tags.browse({
    limit: clientEnv.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'all' : 6,
    fields: 'slug',
    filter: `visibility:public`,
  })

  return tags.map(tag => tag.slug)
}

export const getAuthorSlugs = async (): Promise<string[]> => {
  const authors = await ghost.authors.browse({
    limit: clientEnv.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'all' : 6,
    fields: 'slug',
    filter: `visibility:public`,
  })

  return authors.map(author => author.slug)
}
