import { Text } from '@status-im/components'
import { getTranslations } from 'next-intl/server'

import { JSONLDScript } from '~/utils/json-ld'
import { buildLandingPageStructuredData } from '~/utils/structured-data'
import { Metadata } from '~app/_metadata'
import { Body } from '~components/body'
import { BLOG_PAGE_SIZE, getPosts } from '~website/_lib/ghost'

import { isBlogCategory } from './_categories'
import { BlogPager } from './_components/blog-pager'
import { BlogSearch } from './_components/blog-search'
import { searchBlogPosts } from './_utils/search.server'
import {
  BLOG_SEARCH_QUERY_MAX_LENGTH,
  BLOG_SEARCH_RESULTS_PER_PAGE,
} from './_utils/search-config'

import type { BlogSearchResults } from './_utils/search-config'
import type { PostOrPage, PostsOrPages } from '@tryghost/content-api'
import type { Metadata as NextMetadata } from 'next'

export const revalidate = 3600 // 1 hour

/**
 * A Ghost blip should cost the listing rather than the whole page.
 *
 * The heading, the search box and the nav are all still useful without posts,
 * and unlike the `/blog/page/[page]` continuations this route never reads "no
 * posts" as "no such page", so an empty render cannot be cached as a 404.
 */
async function getBlogPosts(): Promise<{
  posts: PostOrPage[]
  meta: PostsOrPages['meta']
}> {
  try {
    return await getPosts()
  } catch (error) {
    console.error('Failed to fetch blog posts from Ghost API:', error)

    return {
      posts: [],
      meta: {
        pagination: {
          page: 1,
          limit: BLOG_PAGE_SIZE,
          pages: 0,
          total: 0,
          next: null,
          prev: null,
        },
      },
    }
  }
}

export async function generateMetadata(): Promise<NextMetadata> {
  const t = await getTranslations('blog')

  return Metadata({
    title: t('breadcrumb'),
    description: t('description'),
    alternates: {
      canonical: '/blog',
    },
  })
}

type Props = {
  searchParams: Promise<{
    q?: string | string[]
    category?: string | string[]
  }>
}

export default async function BlogPage({ searchParams }: Props) {
  const t = await getTranslations('blog')
  const [{ posts: initialPosts, meta }, params] = await Promise.all([
    getBlogPosts(),
    searchParams,
  ])
  const query =
    typeof params.q === 'string'
      ? params.q.slice(0, BLOG_SEARCH_QUERY_MAX_LENGTH)
      : ''
  const categoryParam =
    typeof params.category === 'string' ? params.category : ''
  const category = isBlogCategory(categoryParam) ? categoryParam : undefined
  const isFiltering = query.trim().length > 0 || Boolean(category)
  let initialResults: BlogSearchResults | null = null

  if (isFiltering) {
    try {
      initialResults = await searchBlogPosts({
        query,
        category,
        limit: BLOG_SEARCH_RESULTS_PER_PAGE,
      })
    } catch (error) {
      // A missing or unreadable index must not take the whole page down. The
      // client falls back to requesting /api/blog/search and surfaces its own
      // "search unavailable" state if that fails too.
      console.error('Failed to render initial blog search results:', error)
    }
  }

  // No second `WebSite` node here: a site declares one, at its root. The
  // `SearchAction` it used to carry fed the sitelinks search box, which Google
  // retired, and left Google crawling the literal
  // `/blog?q={search_term_string}` template URL.
  const webpageSchema = buildLandingPageStructuredData({
    name: t('title'),
    description: t('description'),
    path: '/blog',
  })

  return (
    <>
      <JSONLDScript schema={webpageSchema} />
      <Body>
        <div className="px-5">
          <div className="mx-auto max-w-[1184px] pb-24 pt-12 xl:pb-32 xl:pt-20">
            <div className="mb-10 grid gap-2">
              <h1 className="text-40 font-bold xl:text-64">{t('title')}</h1>
              <Text size={19}>{t('description')}</Text>
            </div>

            <BlogSearch
              initialPosts={initialPosts}
              meta={meta}
              initialResults={initialResults}
              initialQuery={query}
              initialCategory={category}
            />

            <BlogPager
              basePath="/blog"
              currentPage={1}
              totalPages={meta.pagination.pages}
              hideWhenInteractive
            />
          </div>
        </div>
      </Body>
    </>
  )
}
