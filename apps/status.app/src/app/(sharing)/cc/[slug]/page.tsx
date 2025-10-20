import { cache } from 'react'

import { decodeChannelURLData } from '@status-im/js/encode-url-data'

import { Metadata } from '~app/_metadata'
import { createCloudinaryUrl } from '~components/assets/loader'
import { PreviewPage } from '~sharing/_components/preview-page'

export const revalidate = 180 // 3 minutes

const decodeData = cache((slug: string) => {
  const channelUuid = slug.match(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  )

  if (channelUuid) {
    return { channelUuid: channelUuid[0], encodedData: null, decodedData: null }
  }

  const encodedData = decodeURIComponent(slug)

  return {
    encodedData,
    decodedData: decodeChannelURLData(encodedData),
  }
})

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { channelUuid, decodedData } = decodeData((await params).slug)

  if (channelUuid || !decodedData) {
    return Metadata({
      title: {
        absolute: 'Join community channel in Status',
      },
      openGraph: {
        images: [
          createCloudinaryUrl(
            'Open Graph/Status_Open_Graph_02_Channel:1200:631'
          ),
        ],
      },
    })
  }

  return Metadata({
    title: {
      absolute: `Join #${decodedData.displayName} channel in ${decodedData.community!.displayName} community`,
    },
    description: decodedData?.description,
    openGraph: {
      url: createCloudinaryUrl(
        'Open Graph/Status_Open_Graph_02_Channel:1200:631'
      ),
    },
  })
}

export default async function ChannelPreviewPage({ params }: Props) {
  const { channelUuid, decodedData, encodedData } = decodeData(
    (await params).slug
  )

  if (channelUuid) {
    return (
      <PreviewPage
        type="channel"
        encodedData={null}
        decodedData={null}
        channelUuid={channelUuid}
      />
    )
  }

  return (
    <PreviewPage
      type="channel"
      encodedData={encodedData}
      decodedData={decodedData}
    />
  )
}
