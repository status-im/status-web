import { Metadata } from '~/app/_metadata'
import { formatDate } from '~app/_utils/format-date'
import { getLegalDocumentContent } from '../_utils/get-legal-document-content'

export const metadata = Metadata({
  title: 'Terms of Use',
})

export default async function TermsOfUsePage() {
  const { meta, content } = await getLegalDocumentContent('terms-of-use')

  return (
    <>
      <div className="mb-[72px]">
        <h1 className="mb-3 max-w-[697px] text-40 font-700 xl:text-64">
          {meta.title}
        </h1>
        <p className="text-19 text-neutral-50">
          Last update: {formatDate(meta.lastEdited, 'long')}
        </p>
      </div>
      <article className="font-300">{content}</article>
    </>
  )
}
