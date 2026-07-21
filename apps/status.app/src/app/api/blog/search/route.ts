import { NextResponse } from 'next/server'

import { isBlogCategory } from '~website/blog/_categories'
import { searchBlogPosts } from '~website/blog/_utils/search.server'
import {
  BLOG_SEARCH_MAX_RESULTS,
  BLOG_SEARCH_QUERY_MAX_LENGTH,
  BLOG_SEARCH_RESULTS_PER_PAGE,
} from '~website/blog/_utils/search-config'

import type { BlogSearchResults } from '~website/blog/_utils/search-config'

// The index is rebuilt on every deploy, so a given query is stable for the
// lifetime of the deployment and is safe to cache at the edge.
const CACHE_CONTROL = 'public, s-maxage=3600, stale-while-revalidate=86400'

function parseLimit(value: string | null): number {
  const parsed = Number.parseInt(value ?? '', 10)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return BLOG_SEARCH_RESULTS_PER_PAGE
  }

  return Math.min(parsed, BLOG_SEARCH_MAX_RESULTS)
}

export async function GET(request: Request): Promise<NextResponse> {
  const params = new URL(request.url).searchParams

  const query = (params.get('q') ?? '')
    .slice(0, BLOG_SEARCH_QUERY_MAX_LENGTH)
    .trim()
  const categoryParam = params.get('category') ?? ''
  const category = isBlogCategory(categoryParam) ? categoryParam : undefined
  const limit = parseLimit(params.get('limit'))

  if (!query && !category) {
    return NextResponse.json({
      posts: [],
      total: 0,
    } satisfies BlogSearchResults)
  }

  try {
    const results = await searchBlogPosts({ query, category, limit })

    return NextResponse.json(results, {
      headers: { 'Cache-Control': CACHE_CONTROL },
    })
  } catch (error) {
    console.error('Failed to search blog posts:', error)

    return NextResponse.json(
      { error: 'Blog search is unavailable' },
      { status: 503 }
    )
  }
}
