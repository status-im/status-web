import { getTranslations } from 'next-intl/server'

import { Metadata, toMetaDescription } from '~app/_metadata'
import { getPostsByTagSlug } from '~website/_lib/ghost'
import { TagArchive } from '~website/blog/_components/tag-archive'
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

  const response = await getPostsByTagSlug(slug, page)
  const name = response?.tag.name ?? slug

  return Metadata({
    title: t('tagPagedTitle', { name, page }),
    description:
      toMetaDescription(response?.tag.description) ??
      t('tagDescription', { name }),
    alternates: {
      canonical: `/blog/tag/${slug}/page/${page}`,
    },
  })
}

export default async function BlogTagArchivePage(props: Props) {
  const { slug, page: pageParam } = await props.params
  const page = resolvePageParam(pageParam, `/blog/tag/${slug}`)

  return <TagArchive slug={slug} page={page} />
}
