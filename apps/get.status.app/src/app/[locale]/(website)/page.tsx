import HomePage, {
  revalidate,
} from '../../../../../status.app/src/app/(website)/page'
import { cloudinaryLoader } from '../../_components/assets/loader'

import type { Metadata } from 'next'

const GET_SITE_OG_IMAGE = cloudinaryLoader({
  src: 'get.status.app/Hero_app',
  width: 1200,
})

export default HomePage

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Status App: secure peer-to-peer private messenger'
  const description =
    'Status App combines an end-to-end encrypted messenger and a secure browser into a private, decentralized ecosystem with no phone number or email required.'

  return {
    title,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      url: 'https://get.status.app',
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

export { revalidate }
