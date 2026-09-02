import { Avatar } from '@status-im/components'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { Body } from '~components/body'
import { Breadcrumbs } from '~components/breadcrumbs'
import { getPostsByAuthorSlug } from '~website/_lib/ghost'

import { BlogPager } from './blog-pager'
import { InfinitePostGrid } from './infinite-post-grid'
import { PostGrid } from './post-grid'

type Props = {
  slug: string
  page: number
}

/**
 * An author archive, shared by `/blog/author/[slug]` and its `/page/[page]`
 * continuations. Page 1 keeps the infinite scroll; later pages are plain
 * server-rendered grids, which is what the pager links to.
 */
export async function AuthorArchive(props: Props) {
  const { slug, page } = props

  const t = await getTranslations('blog')
  const response = await getPostsByAuthorSlug(slug, page)

  if (!response) {
    notFound()
  }

  const { posts, author, meta } = response
  const name = author.name ?? author.slug
  const basePath = `/blog/author/${author.slug}`
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
            label: name,
            href: basePath,
          },
        ]}
      />

      <div className="px-5">
        <div className="mx-auto max-w-[1184px] pb-24 pt-12 lg:pb-32 lg:pt-20">
          <div className="mb-4">
            <Avatar
              type="user"
              size="56"
              name={name}
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

          {isFirstPage ? (
            <InfinitePostGrid
              type="author"
              initialPosts={posts}
              meta={meta}
              queryKey={author.slug}
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
