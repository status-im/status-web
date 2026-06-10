import { clientEnv } from '~/config/env.client.mjs'
import type { BlogPostDetail } from './blog-post-detail'
import {
  DEFAULT_GHOST_URL,
  DISALLOWED_TAGS_FILTER,
  HOMEPAGE_BLOG_LIMIT,
  HOMEPAGE_BLOG_TAG,
  NETWORK_BLOG_TAG,
} from './ghost-constants'

type GhostAuthor = {
  name: string
  profile_image: string | null
}

type GhostTag = {
  name: string
}

type GhostPostResponse = {
  posts: Array<{
    slug: string
    title: string
    published_at: string | null
    feature_image: string | null
    primary_tag: GhostTag | null
    primary_author: GhostAuthor | null
  }>
}

const STATUS_APP_BLOG_URL = 'https://status.app/blog'
const BLOG_FALLBACK_IMAGE = '/opengraph-image.png'

export type HomepageBlogCard = {
  category: string | null
  title: string
  authorName: string | null
  authorAvatar: string | null
  date: string
  image: string
  link: string
}

export function canRefreshBlogFromClient(): boolean {
  return Boolean(
    clientEnv.NEXT_PUBLIC_GHOST_API_KEY && clientEnv.NEXT_PUBLIC_GHOST_API_URL,
  )
}

/** @deprecated Use canRefreshBlogFromClient */
export const canRefreshHomepageBlogFromClient = canRefreshBlogFromClient

export async function fetchHomepageBlogCards(): Promise<HomepageBlogCard[]> {
  const apiKey = clientEnv.NEXT_PUBLIC_GHOST_API_KEY
  const apiUrl = (
    clientEnv.NEXT_PUBLIC_GHOST_API_URL ?? DEFAULT_GHOST_URL
  ).replace(/\/+$/, '')

  if (!apiKey) {
    return []
  }

  const url = new URL('/ghost/api/content/posts/', apiUrl)
  url.searchParams.set('key', apiKey)
  url.searchParams.set('include', 'tags,authors')
  url.searchParams.set('limit', String(HOMEPAGE_BLOG_LIMIT))
  url.searchParams.set('order', 'published_at DESC')
  url.searchParams.set(
    'filter',
    `tag:${HOMEPAGE_BLOG_TAG}+visibility:public+${DISALLOWED_TAGS_FILTER}`,
  )

  const response = await fetch(url.toString(), { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`Ghost API request failed with ${response.status}`)
  }

  const data = (await response.json()) as GhostPostResponse

  return data.posts.map(post => ({
    category: post.primary_tag?.name ?? null,
    title: post.title,
    authorName: post.primary_author?.name ?? null,
    authorAvatar: post.primary_author?.profile_image ?? null,
    date: post.published_at ?? new Date().toISOString(),
    image: post.feature_image ?? BLOG_FALLBACK_IMAGE,
    link: `${STATUS_APP_BLOG_URL}/${post.slug}`,
  }))
}

type NetworkBlogPostResponse = {
  posts: Array<{
    slug: string
    title: string
    html: string | null
    feature_image: string | null
    feature_image_alt: string | null
    published_at: string | null
    updated_at: string | null
    codeinjection_head: string | null
    codeinjection_foot: string | null
    primary_tag: { name: string; slug: string } | null
    primary_author: BlogPostDetail['primary_author']
  }>
}

export async function fetchNetworkBlogPostBySlug(
  slug: string,
): Promise<BlogPostDetail | null> {
  const apiKey = clientEnv.NEXT_PUBLIC_GHOST_API_KEY
  const apiUrl = (
    clientEnv.NEXT_PUBLIC_GHOST_API_URL ?? DEFAULT_GHOST_URL
  ).replace(/\/+$/, '')

  if (!apiKey) {
    return null
  }

  const url = new URL('/ghost/api/content/posts/', apiUrl)
  url.searchParams.set('key', apiKey)
  url.searchParams.set('include', 'tags,authors')
  url.searchParams.set('limit', '1')
  url.searchParams.set(
    'filter',
    `slug:${slug}+tag:${NETWORK_BLOG_TAG}+visibility:public+${DISALLOWED_TAGS_FILTER}`,
  )

  const response = await fetch(url.toString(), { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`Ghost API request failed with ${response.status}`)
  }

  const data = (await response.json()) as NetworkBlogPostResponse
  const post = data.posts[0]

  if (!post) {
    return null
  }

  return {
    slug: post.slug,
    title: post.title,
    html: post.html,
    feature_image: post.feature_image,
    feature_image_alt: post.feature_image_alt,
    published_at: post.published_at,
    updated_at: post.updated_at,
    codeinjection_head: post.codeinjection_head,
    codeinjection_foot: post.codeinjection_foot,
    primary_tag: post.primary_tag,
    primary_author: post.primary_author,
  }
}
