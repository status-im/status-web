import { getTranslations } from 'next-intl/server'

import { Metadata, toMetaDescription } from '~app/_metadata'
import {
  getArchivePostsByTag,
  getArchiveTagSlugs,
} from '~website/_lib/blog-archive'
import { TagArchive } from '~website/blog/_components/tag-archive'

export const revalidate = 3600 // 1 hour
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = getArchiveTagSlugs()
  return slugs.map(slug => ({ slug })) satisfies Array<Awaited<Props['params']>>
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations('blog')
  const slug = (await params).slug
  const response = getArchivePostsByTag(slug)
  const name = response?.tag.name ?? slug

  return Metadata({
    title: t('tagTitle', { name }),
    description:
      toMetaDescription(response?.tag.description) ??
      t('tagDescription', { name }),
    alternates: {
      canonical: `/blog/tag/${slug}`,
    },
  })
}

export default async function BlogTagPage(props: Props) {
  const { slug } = await props.params

  return <TagArchive slug={slug} page={1} />
}
