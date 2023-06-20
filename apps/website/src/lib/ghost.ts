import GhostContentAPI from '@tryghost/content-api'

/** @see https://ghost.org/docs/content-api# */
const ghost = new GhostContentAPI({
  url: 'https://demo.ghost.io',
  key: '22444f78447824223cefc48062',
  version: 'v5.0',
})

type Params = { page?: number; tag?: string }

export const getPosts = async (params: Params = {}) => {
  const { page = 0, tag } = params

  const response = await ghost.posts.browse({
    limit: 7,
    include: ['tags', 'authors'],
    order: 'published_at DESC',
    page,
    ...(tag && { filter: `tag:${tag}` }),
    filter: 'visibility:public',
  })

  return { posts: [...response], meta: response.meta }
}

export const getPostBySlug = async (slug: string) => {
  return await ghost.posts.read(
    {
      slug,
    },
    {
      include: ['tags', 'authors'],
    }
  )
}

export const getPostsByTagSlug = async (slug: string, page = 0) => {
  const response = await ghost.posts.browse({
    filter: `tag:${slug}+visibility:public`,
    include: ['tags', 'authors'],
    limit: 6,
    order: 'published_at DESC',
    page,
  })

  return { posts: [...response], meta: response.meta }
}

export const getPostsByAuthorSlug = async (slug: string, page = 0) => {
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
    limit: 'all',
    fields: 'slug',
    filter: 'visibility:public',
  })

  return posts.map(post => post.slug)
}

export const getTags = async () => {
  return await ghost.tags.browse({
    limit: 'all',
    fields: 'name,slug',
    filter: 'visibility:public',
  })
}

export const getTagSlugs = async (): Promise<string[]> => {
  const tags = await ghost.tags.browse({
    limit: 'all',
    fields: 'slug',
    filter: 'visibility:public',
  })

  return tags.map(tag => tag.slug)
}

export const getAuthorSlugs = async (): Promise<string[]> => {
  const authors = await ghost.authors.browse({
    limit: 'all',
    fields: 'slug',
    filter: 'visibility:public',
  })

  return authors.map(author => author.slug)
}
