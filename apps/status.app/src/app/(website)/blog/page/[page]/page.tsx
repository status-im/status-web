import { Text } from '@status-im/components'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { Metadata } from '~app/_metadata'
import { Body } from '~components/body'
import { getPosts } from '~website/_lib/ghost'
import { BlogPager } from '~website/blog/_components/blog-pager'
import { PostGrid } from '~website/blog/_components/post-grid'
import { parsePageParam } from '~website/blog/_utils/page-param'

export const revalidate = 3600 // 1 hour
export const dynamicParams = true

type Props = {
  params: Promise<{ page: string }>
}

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations('blog')
  const page = parsePageParam((await params).page)

  if (!page) {
    return Metadata({ title: t('title') })
  }

  return Metadata({
    title: t('pagedTitle', { page }),
    description: t('description'),
    alternates: {
      canonical: `/blog/page/${page}`,
    },
  })
}

/**
 * Continuation pages for /blog.
 *
 * /blog itself loads more posts by scrolling, which crawlers never do, so these
 * server-rendered pages are how every post past the first one gets a link
 * pointing at it.
 */
export default async function BlogArchivePage(props: Props) {
  const t = await getTranslations('blog')
  const page = parsePageParam((await props.params).page)

  if (!page) {
    notFound()
  }

  const { posts, meta } = await getPosts({ page })

  if (posts.length === 0) {
    notFound()
  }

  return (
    <Body>
      <div className="px-5">
        <div className="mx-auto max-w-[1184px] pb-24 pt-12 xl:pb-32 xl:pt-20">
          <div className="mb-10 grid gap-2">
            <h1 className="text-40 font-bold xl:text-64">{t('title')}</h1>
            <Text size={19}>
              {t('pageOf', { page, total: meta.pagination.pages })}
            </Text>
          </div>

          <PostGrid posts={posts} isLoading={false} />

          <BlogPager
            basePath="/blog"
            currentPage={page}
            totalPages={meta.pagination.pages}
          />
        </div>
      </div>
    </Body>
  )
}
