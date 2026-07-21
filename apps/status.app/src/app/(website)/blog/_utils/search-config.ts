import type { PostOrPage } from '@tryghost/content-api'

/**
 * Values shared by the search UI, the search API route and the index builder.
 * Kept apart from `./search` so client components can read them without
 * pulling MiniSearch into the browser bundle.
 */

export const BLOG_SEARCH_QUERY_MAX_LENGTH = 200
export const BLOG_SEARCH_RESULTS_PER_PAGE = 24

/** Upper bound for `limit`, so a crafted URL cannot ask for the whole index. */
export const BLOG_SEARCH_MAX_RESULTS = 240

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

/** Response body of `GET /api/blog/search`. */
export type BlogSearchResults = {
  posts: BlogSearchPost[]
  /** Total matches, which is >= `posts.length` once results are paginated. */
  total: number
}
