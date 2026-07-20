import MiniSearch from 'minisearch'

import type { PostOrPage } from '@tryghost/content-api'

export type BlogSearchDocument = {
  id: string
  title: string
  excerpt: string
  body: string
  categories: string
  categorySlugs: string[]
}

export type BlogSearchRecord = Pick<BlogSearchDocument, 'id' | 'categorySlugs'>

export type BlogSearchPost = Pick<
  PostOrPage,
  | 'id'
  | 'slug'
  | 'title'
  | 'custom_excerpt'
  | 'excerpt'
  | 'feature_image'
  | 'feature_image_alt'
  | 'published_at'
  | 'primary_tag'
  | 'primary_author'
>

export type BlogSearchPayload = {
  posts: BlogSearchPost[]
  records: BlogSearchRecord[]
  searchIndex: object
}

export const BLOG_SEARCH_QUERY_MAX_LENGTH = 200
export const BLOG_SEARCH_RESULTS_PER_PAGE = 24

const SEARCH_OPTIONS = {
  fields: ['title', 'excerpt', 'body', 'categories'],
  searchOptions: {
    boost: { title: 4, excerpt: 2, categories: 2 },
    combineWith: 'AND' as const,
    fuzzy: 0.2,
    prefix: true,
  },
}

export function createBlogSearchDocument(
  post: PostOrPage
): BlogSearchDocument | null {
  if (!post.id || !post.slug) return null

  const categorySlugs =
    post.tags?.flatMap(tag => (tag.slug ? [tag.slug] : [])) ?? []
  const categoryNames =
    post.tags?.flatMap(tag => (tag.name ? [tag.name] : [])) ?? []

  return {
    id: post.id,
    title: post.title ?? '',
    excerpt: post.custom_excerpt ?? post.excerpt ?? '',
    body: post.plaintext ?? '',
    categories: [...categoryNames, ...categorySlugs].join(' '),
    categorySlugs,
  }
}

export function createBlogSearchIndex(documents: BlogSearchDocument[]) {
  const index = new MiniSearch<BlogSearchDocument>(SEARCH_OPTIONS)
  index.addAll(documents)
  return index
}

export function serializeBlogSearchIndex(documents: BlogSearchDocument[]) {
  return createBlogSearchIndex(documents).toJSON()
}

export function loadBlogSearchIndex(searchIndex: object) {
  return MiniSearch.loadJSON<BlogSearchDocument>(
    JSON.stringify(searchIndex),
    SEARCH_OPTIONS
  )
}

export function getBlogSearchResultIds(
  index: MiniSearch<BlogSearchDocument>,
  records: BlogSearchRecord[],
  query: string,
  category?: string
) {
  const normalizedQuery = query.trim()
  const recordsById = new Map(records.map(record => [record.id, record]))
  const candidateIds = normalizedQuery
    ? index.search(normalizedQuery).map(result => String(result.id))
    : records.map(record => record.id)

  if (!category) return candidateIds

  return candidateIds.filter(id =>
    recordsById.get(id)?.categorySlugs.includes(category)
  )
}

export function createBlogSearchPayload(posts: PostOrPage[]) {
  const documents = posts.flatMap(post => {
    const document = createBlogSearchDocument(post)
    return document ? [document] : []
  })

  const postsWithoutBodies: BlogSearchPost[] = posts.map(post => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    custom_excerpt: post.custom_excerpt,
    excerpt: post.excerpt,
    feature_image: post.feature_image,
    feature_image_alt: post.feature_image_alt,
    published_at: post.published_at,
    primary_tag: post.primary_tag,
    primary_author: post.primary_author,
  }))

  return {
    posts: postsWithoutBodies,
    records: documents.map(({ id, categorySlugs }) => ({
      id,
      categorySlugs,
    })),
    searchIndex: serializeBlogSearchIndex(documents),
  } satisfies BlogSearchPayload
}
