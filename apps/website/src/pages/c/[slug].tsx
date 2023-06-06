import { decodeCommunityURLData } from '@status-im/js/encode-url-data'

import { PreviewPage } from '@/components/preview-page'
import { createGetServerSideProps } from '@/server/ssr'

import type { ServerSideProps } from '@/server/ssr'

export const getServerSideProps = createGetServerSideProps(
  decodeCommunityURLData
)

export default function CommunityPreviewPage(
  props: ServerSideProps<ReturnType<typeof decodeCommunityURLData>>
) {
  return (
    <PreviewPage
      type="community"
      decodedData={props.decodedData}
      encodedData={props.encodedData}
    />
  )
}
