import { getTranslations } from 'next-intl/server'

import { formatDate } from '~app/_utils/format-date'

import { getLegalDocumentContent } from '../_utils/get-legal-document-content'
import { GET_SITE_OG_IMAGE } from '../_utils/get-site-og-image'

import type { Metadata } from 'next'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Privacy Policy for Status App'
  const description =
    'Understand what limited diagnostics the application gathers. Review how we protect user anonymity and handle third-party integrations securely.'

  return {
    title,
    description,
    alternates: {
      canonical: '/legal/privacy-policy',
    },
    openGraph: {
      type: 'website',
      url: 'https://get.status.app/legal/privacy-policy',
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

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('common')
  const { meta, content } = await getLegalDocumentContent(
    'legal/privacy-policy.md'
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
