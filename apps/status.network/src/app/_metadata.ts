import type { Metadata } from 'next'

const DEFAULT_SITE_NAME = 'Status Network'
const DEFAULT_SITE_URL = 'https://status.network'
const DEFAULT_TWITTER_SITE = '@StatusL2'
const DEFAULT_OG_IMAGE = `${DEFAULT_SITE_URL}/opengraph-image.png`

type Input = Metadata & {
  title: NonNullable<Metadata['title']>
  description?: string
}

/**
 * Generate metadata for regular pages
 */
export function Metadata(input: Input): Metadata {
  const ogTitle =
    typeof input.title === 'string'
      ? input.title
      : 'absolute' in input.title
        ? input.title.absolute
        : input.title.default

  return {
    ...input,
    openGraph: {
      type: 'website',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
        },
      ],
      url: './',
      title: ogTitle,
      description: input.description,
      siteName: DEFAULT_SITE_NAME,
      locale: 'en_US',
      ...input.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      site: DEFAULT_TWITTER_SITE,
      title: ogTitle,
      description: input.description,
      ...input.twitter,
    },
  }
}
