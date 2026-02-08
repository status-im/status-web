import type { Metadata } from 'next'

type MetadataConfig = {
  siteName: string
  siteUrl: string
  twitterSite: string
  ogImage: string
  defaultDescription?: string
}

type MetadataInput = Metadata & {
  title?: NonNullable<Metadata['title']>
  description?: string
  pathname?: string
  locale?: string
}

export function generateMetadata(
  input: MetadataInput,
  config: MetadataConfig,
): Metadata {
  const ogTitle = input.title
    ? typeof input.title === 'string'
      ? input.title
      : 'absolute' in input.title
        ? input.title.absolute
        : input.title.default
    : config.siteName

  const ogDescription = input.description || config.defaultDescription

  const getCanonicalUrl = () => {
    const applyLocale = (path: string): string => {
      if (path.startsWith('http')) return path
      if (input.locale === 'ko') {
        return path === '/' ? '/ko' : `/ko${path}`
      }
      return path
    }

    if (typeof input.alternates?.canonical === 'string') {
      const canonicalPath = applyLocale(input.alternates.canonical)
      return canonicalPath.startsWith('http')
        ? canonicalPath
        : `${config.siteUrl}${canonicalPath}`
    }

    if (input.pathname) {
      const fullPath = applyLocale(input.pathname)
      return `${config.siteUrl}${fullPath}`
    }

    return undefined
  }

  const canonicalUrl = getCanonicalUrl()

  return {
    ...input,
    alternates: {
      ...input.alternates,
      ...(canonicalUrl && { canonical: canonicalUrl }),
      ...(input.pathname && {
        languages: {
          en: `${config.siteUrl}${input.pathname}`,
          ko: `${config.siteUrl}/ko${input.pathname === '/' ? '' : input.pathname}`,
          'x-default': `${config.siteUrl}${input.pathname}`,
        },
      }),
    },
    openGraph: {
      type: 'website',
      images: [
        {
          url: config.ogImage,
          width: 1200,
          height: 630,
        },
      ],
      url: canonicalUrl || './',
      ...(ogTitle && { title: ogTitle }),
      ...(ogDescription && { description: ogDescription }),
      siteName: config.siteName,
      locale: 'en',
      ...input.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      site: config.twitterSite,
      ...(ogTitle && { title: ogTitle }),
      ...(ogDescription && { description: ogDescription }),
      ...input.twitter,
    },
  }
}
