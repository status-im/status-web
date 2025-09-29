import { Metadata } from '~app/_metadata'
import { formatDate } from '~app/_utils/format-date'

import { getLegalDocumentContent } from '../_utils/get-legal-document-content'

export const metadata = Metadata({
  title: 'Privacy Policy',
})

export default async function PrivacyPolicyPage() {
  const { meta, content } = await getLegalDocumentContent(
    'legal/privacy-policy.md'
  )

  return (
    <>
      <div className="mb-12">
        <h1 className="mb-3 text-40 font-bold xl:text-64">{meta.title}</h1>
        <p className="text-19 text-neutral-50">
          Last update: {formatDate(meta.lastEdited, 'long')}
        </p>
      </div>
      <article className="root-content">{content}</article>
    </>
  )
}
