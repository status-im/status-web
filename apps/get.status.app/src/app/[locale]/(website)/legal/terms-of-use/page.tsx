import { getTranslations } from 'next-intl/server'

import { formatDate } from '~app/_utils/format-date'

import { getLegalDocumentContent } from '../_utils/get-legal-document-content'
import { GET_SITE_OG_IMAGE } from '../_utils/get-site-og-image'

import type { Metadata } from 'next'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Terms of Use Rules for Status App'
  const description =
    'Read the governing conditions for utilizing software. Review liability limits, strict user obligations, and intellectual property guidelines.'

  return {
    title,
    description,
    alternates: {
      canonical: '/legal/terms-of-use',
    },
    openGraph: {
      type: 'website',
      url: 'https://get.status.app/legal/terms-of-use',
      title,
      description,
      siteName: 'Status App',
      images: [
        {
          url: GET_SITE_OG_IMAGE,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [GET_SITE_OG_IMAGE],
    },
  }
}

export default async function TermsOfUsePage() {
  const t = await getTranslations('common')
  const { meta, content } = await getLegalDocumentContent(
    'legal/terms-of-use.md'
  )

  return (
    <>
      <div className="mb-12">
        <h1 className="mb-3 text-40 font-bold xl:text-64">{meta.title}</h1>
        <p className="text-19 text-neutral-50">
          {t('lastUpdate')} {formatDate(meta.lastEdited, 'long')}
        </p>
      </div>
      <article className="root-content">{content}</article>
    </>
  )
}
