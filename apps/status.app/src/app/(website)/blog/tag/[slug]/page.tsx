import { getTranslations } from 'next-intl/server'

import { Metadata, toMetaDescription } from '~app/_metadata'
import { TagArchive } from '~website/blog/_components/tag-archive'
import { readTagArchive } from '~website/blog/_utils/archive-data'

export const revalidate = 3600 // 1 hour
export const dynamicParams = true

// Generate on demand so Ghost availability does not block the build.
export function generateStaticParams() {
  return []
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations('blog')
  const slug = (await params).slug
  const response = await readTagArchive(slug, 1)

  if (response === undefined) {
    return Metadata({ title: t('maintenanceTitle') })
  }
  // Ghost stores a human-readable name and description per tag. The slug is
  // what the URL needs, not what a search result should read as.
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
