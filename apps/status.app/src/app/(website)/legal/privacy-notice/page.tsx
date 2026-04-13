import { getTranslations } from 'next-intl/server'

import { Metadata } from '~app/_metadata'
import { formatDate } from '~app/_utils/format-date'

import { getLegalDocumentContent } from '../_utils/get-legal-document-content'

import type { Metadata as NextMetadata } from 'next'

export async function generateMetadata(): Promise<NextMetadata> {
  const t = await getTranslations('nav')

  return Metadata({
    title: t('privacyNotice'),
    alternates: {
      canonical: '/legal/privacy-notice',
    },
  })
}

export default async function PrivacyNoticePage() {
  const t = await getTranslations('common')
  const { meta, content } = await getLegalDocumentContent(
    'legal/privacy-notice.md'
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
