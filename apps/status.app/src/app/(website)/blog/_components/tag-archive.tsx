import { cloneElement } from 'react'

import { Text } from '@status-im/components'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { Body } from '~components/body'
import { Breadcrumbs } from '~components/breadcrumbs'
import { getPostsByTagSlug } from '~website/_lib/ghost'
import { TAGS } from '~website/blog/_tags'

import { BlogPager } from './blog-pager'
import { InfinitePostGrid } from './infinite-post-grid'
import { PostGrid } from './post-grid'

import type { SLUGS } from '~website/blog/_tags'

type Props = {
  slug: string
  page: number
}

/**
 * A tag archive, shared by `/blog/tag/[slug]` and its `/page/[page]`
 * continuations. Page 1 keeps the infinite scroll; later pages are plain
 * server-rendered grids, which is what the pager links to.
 */
export async function TagArchive(props: Props) {
  const { slug, page } = props

  const t = await getTranslations('blog')
  const response = await getPostsByTagSlug(slug, page)

  if (!response) {
    notFound()
  }

  const { posts, tag, meta } = response
  const basePath = `/blog/tag/${tag.slug}`
  const isFirstPage = page === 1

  return (
    <Body>
      <Breadcrumbs
        items={[
          {
            label: t('breadcrumb'),
            href: '/blog',
          },
          {
            label: tag.name || tag.slug,
            href: basePath,
          },
        ]}
      />

      <div className="px-5">
        <div className="mx-auto max-w-[1184px] pb-24 pt-12 lg:pb-32 lg:pt-20">
          {TAGS[tag.slug as SLUGS] && (
            <div className="mb-4">
              {cloneElement(TAGS[tag.slug as SLUGS]!.icon, {
                size: 64,
              })}
            </div>
          )}

          <div className="mb-12 grid gap-2">
            <h1 className="text-40 font-bold tracking-[-.02em] lg:text-64">
              {tag.name}
            </h1>
            {tag.description && <Text size={19}>{tag.description}</Text>}
          </div>

          {isFirstPage ? (
            <InfinitePostGrid
              type="tag"
              initialPosts={posts}
              meta={meta}
              queryKey={tag.slug}
            />
          ) : (
            <PostGrid posts={posts} isLoading={false} />
          )}

          <BlogPager
            basePath={basePath}
            currentPage={page}
            totalPages={meta.pagination.pages}
            hideWhenInteractive={isFirstPage}
          />
        </div>
      </div>
    </Body>
  )
}
