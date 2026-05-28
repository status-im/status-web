import AppsPage from '../../../../../../status.app/src/app/(website)/apps/page'

import type { Metadata } from 'next'

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
          url: 'https://res.cloudinary.com/dhgck7ebz/image/upload/v1779884371/get.status.app/Hero_app.png',
        },
      ],
    },
  }
}
