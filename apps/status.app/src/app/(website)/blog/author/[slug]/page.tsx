import { Avatar } from '@status-im/components'
import { notFound } from 'next/navigation'

import { Body } from '~components/body'
import { Breadcrumbs } from '~components/breadcrumbs'
import { getAuthorSlugs, getPostsByAuthorSlug } from '~website/_lib/ghost'

import { InfinitePostGrid } from '../../_components/infinite-post-grid'

export const revalidate = 3600 // 1 hour
export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const slugs = await getAuthorSlugs()
    return slugs.map(slug => ({ slug })) satisfies Array<
      Awaited<Props['params']>
    >
  } catch {
    return []
  }
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function BlogAuthorPage(props: Props) {
  const { params } = props

  const response = await getPostsByAuthorSlug((await params).slug)
  if (!response) {
    return notFound()
  }

  const { posts, author, meta } = response

  return (
    <Body>
      <Breadcrumbs
        items={[
          {
            label: 'Blog',
            href: '/blog',
          },
          {
            label: author.name ?? author.slug,
            href: `/blog/author/${posts[0].slug}`,
          },
        ]}
      />

      <div className="px-5">
        <div className="mx-auto max-w-[1184px] pb-24 pt-12 lg:pb-32 lg:pt-20">
          <div className="mb-4">
            <Avatar
              type="user"
              size="56"
              name={author.name ?? author.slug}
              src={author.profile_image ?? undefined}
            />
          </div>
          <div className="mb-12 grid gap-2">
            <h1 className="text-40 font-bold lg:text-64">{author.name}</h1>
            {author.meta_description && (
              <p className="text-40 font-bold text-neutral-50 lg:text-64">
                {author.meta_description}
              </p>
            )}
          </div>

          <InfinitePostGrid
            type="author"
            initialPosts={posts}
            meta={meta}
            queryKey={author.slug}
          />
        </div>
      </div>
    </Body>
  )
}
