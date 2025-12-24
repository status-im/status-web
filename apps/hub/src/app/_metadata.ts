import type { Metadata } from 'next'

const DEFAULT_SITE_NAME = 'Status Hub'
const DEFAULT_SITE_URL = 'https://hub.status.network'
const DEFAULT_TWITTER_SITE = '@StatusL2'
const DEFAULT_OG_IMAGE = `${DEFAULT_SITE_URL}/opengraph-image.png`

type Input = Metadata & {
  title: NonNullable<Metadata['title']>
  description?: string
}

function getTitleString(title: Metadata['title']): string {
  if (typeof title === 'string') return title
  if (title && typeof title === 'object' && 'absolute' in title)
    return title.absolute
  if (title && typeof title === 'object' && 'default' in title)
    return title.default
  return ''
}

function toAbsoluteUrl(path: string | undefined): string | undefined {
  if (!path) return undefined
  return path.startsWith('http') ? path : `${DEFAULT_SITE_URL}${path}`
}

/**
 * Generate metadata for regular pages
 */
export function Metadata(input: Input): Metadata {
  const ogTitle = getTitleString(input.title)
  const canonicalUrl = toAbsoluteUrl(
    typeof input.alternates?.canonical === 'string'
      ? input.alternates.canonical
      : undefined
  )

  return {
    ...input,
    alternates: {
      ...input.alternates,
      ...(canonicalUrl && { canonical: canonicalUrl }),
    },
    openGraph: {
      type: 'website',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
        },
      ],
      url: canonicalUrl || './',
      title: ogTitle,
      description: input.description,
      siteName: DEFAULT_SITE_NAME,
      locale: 'en',
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
