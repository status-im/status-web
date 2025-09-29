import { Metadata } from '~app/_metadata'
import { createCloudinaryUrl } from '~components/assets/loader'

type Props = {
  children: React.ReactNode
}

export const metadata = Metadata({
  title: {
    absolute: 'Open profile in Status',
  },
  openGraph: {
    images: [
      createCloudinaryUrl('Open Graph/Status_Open_Graph_04_Profile:1200:630'),
    ],
  },
})

export default function UserPreviewLayout({ children }: Props) {
  return <>{children}</>
}
