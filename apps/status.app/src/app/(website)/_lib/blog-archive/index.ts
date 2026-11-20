import archive from './posts.json'

import type { PostOrPage, PostsOrPages } from '@tryghost/content-api'

const BLOG_PAGE_SIZE = 7
const ARCHIVE_PAGE_SIZE = 6
const excludedListingTags = new Set([
  'desktop-news',
  'mobile-news',
  'status-insights',
  'status-network-blog',
])

export const archivedPosts: (PostOrPage & {
  slug: string
  title: string
  published_at: string
})[] = archive

const postsBySlug = new Map(archivedPosts.map(post => [post.slug, post]))

export function getArchivedPost(slug: string) {
  return postsBySlug.get(slug)
}

export const listedArchivePosts = archivedPosts.filter(
  post => !post.tags?.some(tag => tag.slug && excludedListingTags.has(tag.slug))
)

function paginate(posts: PostOrPage[], page: number, limit: number) {
  const start = (page - 1) * limit
  const pages = Math.ceil(posts.length / limit)
  const meta: PostsOrPages['meta'] = {
    pagination: {
      page,
      limit,
      pages,
      total: posts.length,
      next: page < pages ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
    },
  }

  return { posts: posts.slice(start, start + limit), meta }
}

export function getArchivePosts({ page = 1 } = {}) {
  return paginate(listedArchivePosts, page, BLOG_PAGE_SIZE)
}

export function getArchiveTagSlugs() {
  return Array.from(
    new Set(
      listedArchivePosts.flatMap(post =>
        (post.tags ?? []).flatMap(tag => (tag.slug ? [tag.slug] : []))
      )
    )
  )
}

export function getArchiveAuthorSlugs() {
  return Array.from(
    new Set(
      listedArchivePosts.flatMap(post =>
        post.primary_author?.slug ? [post.primary_author.slug] : []
      )
    )
  )
}

export function getArchivePostsByTag(slug: string, page = 1) {
  const matches = listedArchivePosts.filter(post =>
    post.tags?.some(tag => tag.slug === slug)
  )
  const result = paginate(matches, page, ARCHIVE_PAGE_SIZE)
  const tag = result.posts[0]?.tags?.find(tag => tag.slug === slug)

  if (tag) return { ...result, tag }
}

export function getArchivePostsByAuthor(slug: string, page = 1) {
  const matches = listedArchivePosts.filter(
    post => post.primary_author?.slug === slug
  )
  const result = paginate(matches, page, ARCHIVE_PAGE_SIZE)
  const author = result.posts[0]?.primary_author

  if (author) return { ...result, author }
}
