import HomePage, {
  revalidate,
} from '../../../../../status.app/src/app/(website)/page'

import type { Metadata } from 'next'

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
          url: 'https://res.cloudinary.com/dhgck7ebz/image/upload/v1779884371/get.status.app/Hero_app.png',
        },
      ],
    },
  }
}

export { revalidate }
