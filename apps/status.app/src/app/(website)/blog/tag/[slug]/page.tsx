import { cloneElement } from 'react'

import { Text } from '@status-im/components'
import { notFound } from 'next/navigation'

import { Body } from '~components/body'
import { Breadcrumbs } from '~components/breadcrumbs'
import { getPostsByTagSlug, getTagSlugs } from '~website/_lib/ghost'
import { TAGS } from '~website/blog/_tags'

import { InfinitePostGrid } from '../../_components/infinite-post-grid'

import type { SLUGS } from '~website/blog/_tags'

export const revalidate = 3600 // 1 hour
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getTagSlugs()

  return slugs.map(slug => ({ slug })) satisfies Array<Awaited<Props['params']>>
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function BlogTagPage(props: Props) {
  const { params } = props

  const response = await getPostsByTagSlug((await params).slug)

  if (!response) {
    return notFound()
  }

  const { posts, tag, meta } = response

  return (
    // layout 1 (showBreadcrumbs, showHighlightedPostCard, ?posts=renderPosts())
    <Body>
      {/* layout 2 */}
      {/* breadcumbs */}
      <Breadcrumbs
        items={[
          {
            label: 'Blog',
            href: '/blog',
          },
          {
            label: tag.name || tag.slug,
            href: `/blog/tag/${tag.slug}`,
          },
        ]}
      />

      <div className="px-5">
        <div className="mx-auto max-w-[1184px] pb-24 pt-12 lg:pb-32 lg:pt-20">
          {/* content */}
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

          <InfinitePostGrid
            type="tag"
            initialPosts={posts}
            meta={meta}
            queryKey={tag.slug}
          />
        </div>
      </div>
    </Body>
  )
}
