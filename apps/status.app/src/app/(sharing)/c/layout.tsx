import { Metadata } from '~app/_metadata'
import { createCloudinaryUrl } from '~components/assets/loader'

type Props = {
  children: React.ReactNode
}

export const metadata = Metadata({
  title: {
    absolute: 'Join community in Status',
  },
  openGraph: {
    images: [
      createCloudinaryUrl('Open Graph/Status_Open_Graph_03_Community:1200:630'),
    ],
  },
})

export default function CommunityPreviewLayout({ children }: Props) {
  return <>{children}</>
}
