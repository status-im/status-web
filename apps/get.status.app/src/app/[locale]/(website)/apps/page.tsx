import AppsPage from '../../../../../../status.app/src/app/(website)/apps/page'
import { cloudinaryLoader } from '../../../_components/assets/loader'

import type { Metadata } from 'next'

const GET_SITE_OG_IMAGE = cloudinaryLoader({
  src: 'get.status.app/Hero_app',
  width: 1200,
})

export default AppsPage

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Apps'
  const description =
    'Use Status on the go with the mobile app, or get the full set of features on desktop. Private messaging and a secure browser, on every device you own.'

  return {
    title,
    description,
    alternates: {
      canonical: '/apps',
    },
    openGraph: {
      type: 'website',
      url: 'https://get.status.app/apps',
      title,
      description,
      siteName: 'Status App',
      images: [
        {
          url: GET_SITE_OG_IMAGE,
        },
      ],
    },
  }
}
