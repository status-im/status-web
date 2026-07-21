import HomePage from '../../../../../status.app/src/app/(website)/page'
import { cloudinaryLoader } from '../../_components/assets/loader'

import type { Metadata } from 'next'

export const dynamic = 'force-static'

const GET_SITE_OG_IMAGE = cloudinaryLoader({
  src: 'get.status.app/Hero_app',
  width: 1200,
})

export default HomePage

export async function generateMetadata(): Promise<Metadata> {
  const title =
    'Status App | Private Messenger, Assets, Web Browser, Communities and more'
  const description =
    'Chat privately without surveillance. Combine censorship resistant communications with a private web browser in one secure app.'

  return {
    title,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      url: 'https://get.status.app/',
      title,
      description,
      siteName: 'Status App',
      images: [
        {
          url: GET_SITE_OG_IMAGE,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [GET_SITE_OG_IMAGE],
    },
  }
}
