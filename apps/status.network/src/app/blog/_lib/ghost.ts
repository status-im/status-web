import 'server-only'

type GhostAuthor = {
  id: string
  name: string
  slug: string
  profile_image: string | null
  meta_description: string | null
}

export type GhostTag = {
  id: string
  name: string
  slug: string
}

export type GhostPost = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  html: string | null
  feature_image: string | null
  feature_image_alt: string | null
  published_at: string | null
  updated_at: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  codeinjection_head: string | null
  codeinjection_foot: string | null
  tags: GhostTag[]
  authors: GhostAuthor[]
  primary_tag: GhostTag | null
  primary_author: GhostAuthor | null
}

type Pagination = {
  page: number
  limit: number
  pages: number
  total: number
  next: number | null
  prev: number | null
}

type GhostPostsResponse = {
  posts: GhostPost[]
  meta: { pagination: Pagination }
}

type GhostTagsResponse = {
  tags: GhostTag[]
  meta: { pagination: Pagination }
}

const DEFAULT_GHOST_URL = 'https://our.status.im'
const GHOST_URL = (
  process.env.NEXT_PUBLIC_GHOST_API_URL ?? DEFAULT_GHOST_URL
).replace(/\/+$/, '')
const GHOST_API_KEY = process.env.NEXT_PUBLIC_GHOST_API_KEY
const REVALIDATE_SECONDS = 3600
const DISALLOWED_TAGS = ['desktop-news', 'mobile-news']
const DISALLOWED_TAGS_FILTER = DISALLOWED_TAGS.map(tag => `tag:-${tag}`).join(
  '+',
)

const EMPTY_PAGINATION: Pagination = {
  page: 1,
  limit: 0,
  pages: 0,
  total: 0,
  next: null,
  prev: null,
}

type GetPostsParams = {
  page?: number
  limit?: number | 'all'
  tag?: string
}

export async function getPosts(params: GetPostsParams = {}) {
  const { page = 1, limit = 12, tag } = params

  const filter = tag
    ? `tag:${tag}+visibility:public`
    : `visibility:public+${DISALLOWED_TAGS_FILTER}`

  const response = await fetchPosts({
    include: 'tags,authors',
    order: 'published_at DESC',
    page: String(page),
    limit: String(limit),
    filter,
  })

  return {
    posts: response.posts,
    meta: response.meta,
  }
}

export async function getPostBySlug(slug: string): Promise<GhostPost | null> {
  const response = await fetchPosts({
    include: 'tags,authors',
    limit: '1',
    filter: `slug:${slug}+visibility:public+${DISALLOWED_TAGS_FILTER}`,
  })

  return response.posts[0] ?? null
}

export async function getPostSlugs(): Promise<string[]> {
  const response = await fetchPosts({
    fields: 'slug',
    limit: 'all',
    filter: `visibility:public+${DISALLOWED_TAGS_FILTER}`,
  })

  return response.posts.map(post => post.slug)
}

export async function getPostsByTagSlug(
  slug: string,
  limit: number = 4,
): Promise<GhostPost[]> {
  const response = await fetchPosts({
    include: 'tags,authors',
    limit: String(limit),
    order: 'published_at DESC',
    filter: `tag:${slug}+visibility:public+${DISALLOWED_TAGS_FILTER}`,
  })

  return response.posts
}

export async function getTags(limit: number = 20): Promise<GhostTag[]> {
  const response = await fetchTags({
    fields: 'name,slug',
    limit: String(limit),
    filter: 'visibility:public',
    order: 'count.posts DESC',
  })

  return response.tags
}

async function fetchPosts(
  params: Record<string, string>,
): Promise<GhostPostsResponse> {
  if (!GHOST_API_KEY) {
    return {
      posts: [],
      meta: { pagination: EMPTY_PAGINATION },
    }
  }

  const url = new URL('/ghost/api/content/posts/', GHOST_URL)
  url.searchParams.set('key', GHOST_API_KEY)

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  try {
    const response = await fetch(url.toString(), {
      next: {
        revalidate: REVALIDATE_SECONDS,
      },
    })

    if (!response.ok) {
      throw new Error(`Ghost API request failed with ${response.status}`)
    }

    return (await response.json()) as GhostPostsResponse
  } catch (error) {
    console.error('Failed to fetch posts from Ghost API:', error)
    return {
      posts: [],
      meta: { pagination: EMPTY_PAGINATION },
    }
  }
}

async function fetchTags(
  params: Record<string, string>,
): Promise<GhostTagsResponse> {
  if (!GHOST_API_KEY) {
    return {
      tags: [],
      meta: { pagination: EMPTY_PAGINATION },
    }
  }

  const url = new URL('/ghost/api/content/tags/', GHOST_URL)
  url.searchParams.set('key', GHOST_API_KEY)

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  try {
    const response = await fetch(url.toString(), {
      next: {
        revalidate: REVALIDATE_SECONDS,
      },
    })

    if (!response.ok) {
      throw new Error(`Ghost API request failed with ${response.status}`)
    }

    return (await response.json()) as GhostTagsResponse
  } catch (error) {
    console.error('Failed to fetch tags from Ghost API:', error)
    return {
      tags: [],
      meta: { pagination: EMPTY_PAGINATION },
    }
  }
}
