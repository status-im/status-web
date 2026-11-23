import { getTranslations } from 'next-intl/server'

import { Metadata, toMetaDescription } from '~app/_metadata'
import { AuthorArchive } from '~website/blog/_components/author-archive'
import { readAuthorArchive } from '~website/blog/_utils/archive-data'
import {
  parsePageParam,
  resolvePageParam,
} from '~website/blog/_utils/page-param'

export const revalidate = 3600 // 1 hour
export const dynamicParams = true

type Props = {
  params: Promise<{ slug: string; page: string }>
}

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations('blog')
  const { slug, page: pageParam } = await params
  const page = parsePageParam(pageParam)

  if (!page) {
    return Metadata({ title: t('title') })
  }

  const response = await readAuthorArchive(slug, page)

  if (response === undefined) {
    return Metadata({ title: t('maintenanceTitle') })
  }
  const authorName =
    response?.author.name ?? response?.author.slug ?? t('unknownAuthor')

  return Metadata({
    title: t('authorPagedTitle', { author: authorName, page }),
    description:
      toMetaDescription(response?.author.meta_description) ??
      t('postsByAuthor', { author: authorName }),
    alternates: {
      canonical: `/blog/author/${slug}/page/${page}`,
    },
  })
}

export default async function BlogAuthorArchivePage(props: Props) {
  const { slug, page: pageParam } = await props.params
  const page = resolvePageParam(pageParam, `/blog/author/${slug}`)

  return <AuthorArchive slug={slug} page={page} />
}
