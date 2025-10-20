import { cache } from 'react'

import { decodeUserURLData } from '@status-im/js/encode-url-data'

import { Metadata } from '~app/_metadata'
import { createCloudinaryUrl } from '~components/assets/loader'
import { PreviewPage } from '~sharing/_components/preview-page'

export const revalidate = 180 // 3 minutes

const decodeData = cache((slug: string) => {
  const encodedData = decodeURIComponent(slug)
  return { encodedData, decodedData: decodeUserURLData(encodedData) }
})

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { decodedData } = decodeData((await params).slug)

  if (!decodedData) {
    // fallback to parent layout metadata
    return {}
  }

  return Metadata({
    title: {
      absolute: `Connect with ${decodedData.displayName} in Status`,
    },
    description: decodedData?.description,
    openGraph: {
      images: [
        createCloudinaryUrl('Open Graph/Status_Open_Graph_04_Profile:1200:630'),
      ],
    },
  })
}

export default async function UserPreviewPage({ params }: Props) {
  const { encodedData, decodedData } = decodeData((await params).slug)

  return (
    <PreviewPage
      type="profile"
      encodedData={encodedData}
      decodedData={decodedData}
    />
  )
}
