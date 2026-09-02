import { getTranslations } from 'next-intl/server'

import { Metadata, toMetaDescription } from '~app/_metadata'
import { getAuthorSlugs, getPostsByAuthorSlug } from '~website/_lib/ghost'
import { AuthorArchive } from '~website/blog/_components/author-archive'

export const revalidate = 3600 // 1 hour
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getAuthorSlugs()
  return slugs.map(slug => ({ slug })) satisfies Array<Awaited<Props['params']>>
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations('blog')
  const slug = (await params).slug
  const response = await getPostsByAuthorSlug(slug)

  if (!response) {
    return Metadata({
      title: t('authorNotFound'),
      alternates: {
        canonical: `/blog/author/${slug}`,
      },
    })
  }

  const { author } = response
  const authorName = author.name ?? author.slug ?? t('unknownAuthor')

  return Metadata({
    title: t('authorTitle', { author: authorName }),
    description:
      toMetaDescription(author.meta_description) ??
      t('postsByAuthor', { author: authorName }),
    alternates: {
      canonical: `/blog/author/${slug}`,
    },
  })
}

export default async function BlogAuthorPage(props: Props) {
  const { slug } = await props.params

  return <AuthorArchive slug={slug} page={1} />
}
