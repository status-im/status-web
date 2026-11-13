import { Metadata } from '~app/_metadata'
import { createCloudinaryUrl } from '~components/assets/loader'
import { ErrorPage } from '~sharing/_components/error-page'
import { PreviewPage } from '~sharing/_components/preview-page'
import { ERROR_CODES } from '~sharing/_error-codes'

import { parseMessageLink } from './_parse-message-link'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ 'message-id'?: string | string[] }>
}

export const metadata = Metadata({
  title: {
    absolute: 'View message in Status',
  },
  openGraph: {
    images: [
      createCloudinaryUrl('Open Graph/Status_Open_Graph_02_Channel:1200:631'),
    ],
  },
})

export default async function MessagePreviewPage({
  params,
  searchParams,
}: Props) {
  const data = parseMessageLink(
    (await params).slug,
    (await searchParams)['message-id']
  )

  if (!data) {
    return <ErrorPage errorCode={ERROR_CODES.NOT_FOUND} />
  }

  return (
    <PreviewPage
      type="channel"
      encodedData={null}
      decodedData={null}
      channelUuid={data.channelUuid}
      communityPublicKey={data.communityPublicKey}
      messageId={data.messageId}
    />
  )
}
