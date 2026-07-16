import { Text } from '@status-im/components'
import { getTranslations } from 'next-intl/server'

import { jsonLD, JSONLDScript } from '~/utils/json-ld'
import { buildLandingPageStructuredData } from '~/utils/structured-data'
import { Metadata } from '~app/_metadata'
import { Body } from '~components/body'
import { getPosts } from '~website/_lib/ghost'

import { BlogSearch } from './_components/blog-search'
import { isBlogCategory } from './_tags'
import { getBlogSearchResultIds, loadBlogSearchIndex } from './_utils/search'
import { readBlogSearchPayload } from './_utils/search.server'

import type { PostOrPage } from '@tryghost/content-api'
import type { Metadata as NextMetadata } from 'next'

export const revalidate = 3600 // 1 hour

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
    getPosts(),
    searchParams,
  ])
  const query = typeof params.q === 'string' ? params.q.slice(0, 200) : ''
  const categoryParam =
    typeof params.category === 'string' ? params.category : ''
  const category = isBlogCategory(categoryParam) ? categoryParam : undefined
  const isFiltering = query.trim().length > 0 || Boolean(category)
  let initialResultPosts: PostOrPage[] = []

  if (isFiltering) {
    const payload = await readBlogSearchPayload()
    const postsById = new Map(payload.posts.map(post => [post.id, post]))
    initialResultPosts = getBlogSearchResultIds(
      loadBlogSearchIndex(payload.searchIndex),
      payload.records,
      query,
      category
    ).flatMap(id => {
      const post = postsById.get(id)
      return post ? [post] : []
    })
  }

  const websiteSchema = jsonLD.website({
    name: 'Status Blog',
    url: 'https://status.app/blog',
    description: t('description'),
    searchUrl: 'https://status.app/blog?q={search_term_string}',
  })
  const webpageSchema = buildLandingPageStructuredData({
    name: t('title'),
    description: t('description'),
    path: '/blog',
  })

  return (
    <>
      <JSONLDScript schema={[websiteSchema, webpageSchema]} />
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
              initialResultPosts={initialResultPosts}
              initialQuery={query}
              initialCategory={category}
            />
          </div>
        </div>
      </Body>
    </>
  )
}
