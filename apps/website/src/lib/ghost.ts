import GhostContentAPI from '@tryghost/content-api'

import { clientEnv } from '@/config/env.client.mjs'

/** @see https://ghost.org/docs/content-api# */
const ghost = new GhostContentAPI({
  url: clientEnv.NEXT_PUBLIC_GHOST_API_URL,
  key: clientEnv.NEXT_PUBLIC_GHOST_API_KEY,
  version: 'v5.0',
})

type Params = { page?: number; limit?: number; tag?: string }

export const getPosts = async (params: Params = {}) => {
  const { page = 1, limit = 7, tag } = params

  const response = await ghost.posts.browse({
    include: ['tags', 'authors'],
    order: 'published_at DESC',
    limit,
    page,
    ...(tag
      ? { filter: `tag:${tag}+visibility:public` }
      : { filter: 'visibility:public' }),
  })

  return { posts: [...response], meta: response.meta }
}

export const getPostBySlug = async (slug: string) => {
  return await ghost.posts.read(
    { slug },
    {
      include: ['tags', 'authors'],
    }
  )
}

export const getPostsByTagSlug = async (slug: string, page = 1) => {
  const response = await ghost.posts.browse({
    filter: `tag:${slug}+visibility:public`,
    include: ['tags', 'authors'],
    limit: 6,
    order: 'published_at DESC',
    page,
  })

  return { posts: [...response], meta: response.meta }
}

export const getPostsByAuthorSlug = async (slug: string, page = 1) => {
  const response = await ghost.posts.browse({
    filter: `author:${slug}+visibility:public`,
    include: ['tags', 'authors'],
    limit: 6,
    order: 'published_at DESC',
    page,
  })

  return { posts: [...response], meta: response.meta }
}

export const getPostSlugs = async (): Promise<string[]> => {
  const posts = await ghost.posts.browse({
    limit: 7,
    fields: 'slug',
    filter: 'visibility:public',
  })

  return posts.map(post => post.slug)
}

export const getTags = async () => {
  return await ghost.tags.browse({
    limit: clientEnv.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'all' : 6,
    fields: 'name,slug',
    filter: 'visibility:public',
  })
}

export const getTagSlugs = async (): Promise<string[]> => {
  const tags = await ghost.tags.browse({
    limit: clientEnv.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'all' : 6,
    fields: 'slug',
    filter: 'visibility:public',
  })

  return tags.map(tag => tag.slug)
}

export const getAuthorSlugs = async (): Promise<string[]> => {
  const authors = await ghost.authors.browse({
    limit: clientEnv.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'all' : 6,
    fields: 'slug',
    filter: 'visibility:public',
  })

  return authors.map(author => author.slug)
}
