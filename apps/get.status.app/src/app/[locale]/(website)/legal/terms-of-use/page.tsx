import TermsOfUsePage from '../../../../../../../status.app/src/app/(website)/legal/terms-of-use/page'
import { cloudinaryLoader } from '../../../../_components/assets/loader'

import type { Metadata } from 'next'

export const dynamic = 'force-static'

const GET_SITE_OG_IMAGE = cloudinaryLoader({
  src: 'get.status.app/Hero_app',
  width: 1200,
})

export default TermsOfUsePage

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Terms of Use Rules for Status App'
  const description =
    'Read the governing conditions for utilizing software. Review liability limits, strict user obligations, and intellectual property guidelines.'

  return {
    title,
    description,
    alternates: {
      canonical: '/legal/terms-of-use',
    },
    openGraph: {
      type: 'website',
      url: 'https://get.status.app/legal/terms-of-use',
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
