import type { Metadata } from 'next'

const DEFAULT_SITE_NAME = 'Status Network Hub'
const DEFAULT_DESCRIPTION =
  'Get started on the gasless L2 with native yield and composable privacy! Try apps and deposit assets to earn Karma'
const DEFAULT_SITE_URL = 'https://hub.status.network'
const DEFAULT_TWITTER_SITE = '@StatusL2'
const DEFAULT_OG_IMAGE = `${DEFAULT_SITE_URL}/og-image.png`

type Input = Metadata & {
  // todo: get product copy for titles and descriptions
  // title: NonNullable<Metadata['title']>
  description?: string
  pathname?: string
}

// function getTitleString(title: Metadata['title']): string {
//   if (typeof title === 'string') return title
//   if (title && typeof title === 'object' && 'absolute' in title)
//     return title.absolute
//   if (title && typeof title === 'object' && 'default' in title)
//     return title.default
//   return ''
// }

function toAbsoluteUrl(path: string | undefined): string | undefined {
  if (!path) return undefined
  return path.startsWith('http') ? path : `${DEFAULT_SITE_URL}${path}`
}

/**
 * Generate metadata for regular pages
 */
export function Metadata(input: Input): Metadata {
  // const ogTitle = getTitleString(input.title)
  // const ogDescription = input.description
  const ogTitle = DEFAULT_SITE_NAME
  const ogDescription = DEFAULT_DESCRIPTION
  const canonicalUrl = toAbsoluteUrl(
    typeof input.alternates?.canonical === 'string'
      ? input.alternates.canonical
      : input.pathname
  )

  return {
    title: DEFAULT_SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    ...input,
    alternates: {
      ...input.alternates,
      ...(canonicalUrl && { canonical: canonicalUrl }),
      ...(input.pathname && {
        languages: {
          en: input.pathname,
          ko: `/ko${input.pathname === '/' ? '' : input.pathname}`,
          'x-default': input.pathname,
        },
      }),
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
      // description: input.description,
      description: ogDescription,
      siteName: DEFAULT_SITE_NAME,
      locale: 'en',
      ...input.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      site: DEFAULT_TWITTER_SITE,
      title: ogTitle,
      // description: input.description,
      description: ogDescription,
      ...input.twitter,
    },
  }
}
