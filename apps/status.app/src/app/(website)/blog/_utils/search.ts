import MiniSearch from 'minisearch'

import type { BlogSearchPost } from './search-config'
import type { PostOrPage } from '@tryghost/content-api'

export type { BlogSearchPost, BlogSearchResults } from './search-config'
export {
  BLOG_SEARCH_MAX_RESULTS,
  BLOG_SEARCH_QUERY_MAX_LENGTH,
  BLOG_SEARCH_RESULTS_PER_PAGE,
} from './search-config'

export type BlogSearchDocument = {
  id: string
  title: string
  excerpt: string
  body: string
  categories: string
  categorySlugs: string[]
}

export type BlogSearchRecord = Pick<BlogSearchDocument, 'id' | 'categorySlugs'>

export type BlogSearchPayload = {
  posts: BlogSearchPost[]
  records: BlogSearchRecord[]
  searchIndex: object
}

/**
 * Dropped at both index and query time. Because `combineWith` is `AND`, every
 * query term has to match, so a natural-language question like
 * "how to backup my seed phrase" would otherwise only match posts containing
 * "how", "to" and "my" as well, which buries the relevant results.
 */
const STOP_WORDS = new Set(
  `a about above after again against all am an and any are as at be because been
   before being below between both but by could did do does doing down during
   each few for from further had has have having he her here hers herself him
   himself his how i if in into is it its itself me more most my myself no nor
   not of off on once only or other ought our ours ourselves out over own same
   she should so some such than that the their theirs them themselves then there
   these they this those through to too under until up very was we were what
   when where which while who whom why with would you your yours yourself
   yourselves`.split(/\s+/)
)

const SEARCH_OPTIONS = {
  fields: ['title', 'excerpt', 'body', 'categories'],
  processTerm: (term: string) => {
    const normalizedTerm = term.toLowerCase()
    return STOP_WORDS.has(normalizedTerm) ? null : normalizedTerm
  },
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
  // `loadJS` takes the already-parsed object; `loadJSON` would re-serialize and
  // re-parse a multi-megabyte index for nothing (measured ~125ms vs ~74ms).
  return MiniSearch.loadJS<BlogSearchDocument>(
    searchIndex as Parameters<typeof MiniSearch.loadJS>[0],
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
