import { createCloudinaryUrl } from '~components/assets/loader'

import type { Metadata } from 'next'

const DEFAULT_SITE_NAME = 'Status'
const DEFAULT_SITE_URL = 'https://status.app'
const DEFAULT_TWITTER_SITE = '@ethstatus'
const DEFAULT_OG_IMAGE = createCloudinaryUrl(
  'Open Graph/Status_Open_Graph_01:1200:630'
)

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
      images: [DEFAULT_OG_IMAGE],
      url: './',
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

/**
 * Blog post metadata configuration
 */
export type BlogMetadataConfig = {
  title: string
  description?: string
  canonical?: string
  image?: string
  publishedTime?: string
  modifiedTime?: string
  author?: {
    name: string
    twitter?: string
  }
  noindex?: boolean
  nofollow?: boolean
}

/**
 * Generate metadata for blog posts
 */
export function BlogMetadata(config: BlogMetadataConfig): Metadata {
  const {
    title,
    description,
    canonical,
    image = DEFAULT_OG_IMAGE,
    publishedTime,
    modifiedTime,
    author,
    noindex = false,
    nofollow = false,
  } = config

  const metadata: Metadata = {
    title,
    description,
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
      },
    },
  }

  // Canonical URL
  if (canonical) {
    metadata.alternates = {
      canonical: canonical.startsWith('http')
        ? canonical
        : `${DEFAULT_SITE_URL}${canonical}`,
    }
  }

  // Open Graph metadata
  const baseOG: NonNullable<Metadata['openGraph']> = {
    type: 'article',
    title,
    description,
    images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    siteName: DEFAULT_SITE_NAME,
    locale: 'en',
  }

  if (canonical) {
    baseOG.url = canonical.startsWith('http')
      ? canonical
      : `${DEFAULT_SITE_URL}${canonical}`
  }

  // Article-specific Open Graph properties
  if (publishedTime || modifiedTime || author) {
    const articleOG = baseOG as NonNullable<Metadata['openGraph']> & {
      publishedTime?: string
      modifiedTime?: string
      authors?: string[]
    }
    if (publishedTime) {
      articleOG.publishedTime = publishedTime
    }
    if (modifiedTime) {
      articleOG.modifiedTime = modifiedTime
    }
    if (author?.name) {
      articleOG.authors = [author.name]
    }
    metadata.openGraph = articleOG as Metadata['openGraph']
  } else {
    metadata.openGraph = baseOG
  }

  // Twitter Card metadata
  metadata.twitter = {
    card: 'summary_large_image',
    site: DEFAULT_TWITTER_SITE,
    title,
    description,
    images: image ? [image] : undefined,
    creator: author?.twitter,
  }

  return metadata
}
