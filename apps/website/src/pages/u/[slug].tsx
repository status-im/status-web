import { decodeUserURLData } from '@status-im/js/encode-url-data'

import { PreviewPage } from '@/components/preview-page'
import { createGetServerSideProps } from '@/server/ssr'

import type { ServerSideProps } from '@/server/ssr'

export const getServerSideProps = createGetServerSideProps(decodeUserURLData)

export default function UserPreviewPage(
  props: ServerSideProps<ReturnType<typeof decodeUserURLData>>
) {
  return (
    <PreviewPage
      type="profile"
      decodedData={props.decodedData}
      encodedData={props.encodedData}
    />
  )
}
