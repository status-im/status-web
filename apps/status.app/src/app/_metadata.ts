import { getSeoOverride } from '~/config/seo-overrides'
import { SITE_URL } from '~/config/site'
import { createCloudinaryUrl } from '~components/assets/loader'

import type { Metadata } from 'next'

const DEFAULT_SITE_NAME = 'Status'
const DEFAULT_SITE_URL = SITE_URL
const DEFAULT_TWITTER_SITE = '@ethstatus'
const DEFAULT_OG_IMAGE = createCloudinaryUrl(
  'Open Graph/Status_Open_Graph_01:1200:630'
)

/**
 * Resolve a canonical path to the absolute, query-free URL it should declare.
 *
 * Canonicals have to be absolute in the HTML as served. Next resolves a
 * relative value against the *rendered* pathname, which for the `[locale]`
 * subtree is the internally rewritten `/en/...` path, a URL that only redirects
 * back to the one being rendered. Query strings are dropped so that every
 * referral variant (`?ref=...`, `?utm_campaign=...`) collapses onto one URL.
 * why: https://github.com/status-im/status-web/issues/1307
 */
export function toCanonicalUrl(path: string): string {
  const url = new URL(path, DEFAULT_SITE_URL)
  url.search = ''
  url.hash = ''
  return url.href
}

/**
 * Metadata for a client-rendered route, which cannot export metadata itself.
 * Mount it on a server `layout.tsx` so the segment still declares where it
 * lives, without touching the title and description it inherits.
 */
export function CanonicalMetadata(canonical: string): Metadata {
  return { alternates: { canonical: toCanonicalUrl(canonical) } }
}

type Input = Metadata & {
  title: NonNullable<Metadata['title']>
  description?: string
}

/**
 * Generate metadata for regular pages
 */
export function Metadata(input: Input): Metadata {
  const canonical =
    typeof input.alternates?.canonical === 'string'
      ? input.alternates.canonical
      : undefined
  const override = canonical ? getSeoOverride(canonical) : undefined
  const canonicalUrl = canonical ? toCanonicalUrl(canonical) : undefined

  const finalTitle = override?.title ?? input.title
  const finalDescription = override?.description ?? input.description

  const ogTitle =
    typeof finalTitle === 'string'
      ? finalTitle
      : 'absolute' in finalTitle
        ? finalTitle.absolute
        : finalTitle.default

  return {
    ...input,
    title: finalTitle,
    description: finalDescription,
    ...(canonicalUrl && {
      alternates: { ...input.alternates, canonical: canonicalUrl },
    }),
    openGraph: {
      type: 'website',
      images: [DEFAULT_OG_IMAGE],
      url: canonicalUrl ?? './',
      title: ogTitle,
      description: finalDescription,
      siteName: DEFAULT_SITE_NAME,
      locale: 'en',
      ...input.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      site: DEFAULT_TWITTER_SITE,
      title: ogTitle,
      description: finalDescription,
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
  const canonicalUrl = canonical ? toCanonicalUrl(canonical) : undefined

  if (canonicalUrl) {
    metadata.alternates = { canonical: canonicalUrl }
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

  if (canonicalUrl) {
    baseOG.url = canonicalUrl
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
