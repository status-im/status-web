import { decodeChannelURLData } from '@status-im/js/encode-url-data'

import { PreviewPage } from '@/components/preview-page'
import { createGetServerSideProps } from '@/server/ssr'

import type { ServerSideProps } from '@/server/ssr'

export const getServerSideProps = createGetServerSideProps(decodeChannelURLData)

export default function ChannelPreviewPage(
  props: ServerSideProps<ReturnType<typeof decodeChannelURLData>>
) {
  return (
    <PreviewPage
      type="channel"
      errorCode={props.errorCode}
      unverifiedData={props.unverifiedData}
      encodedData={props.encodedData}
      channelUuid={props.channelUuid}
    />
  )
}
