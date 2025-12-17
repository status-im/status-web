const DEFAULT_SITE_URL = 'https://status.app'

/**
 * Status organization social media links
 */
const STATUS_SOCIAL_LINKS: string[] = [
  'https://x.com/ethstatus',
  'https://github.com/status-im',
  'https://www.youtube.com/@Statusim',
]

/**
 * JSON-LD Schema types
 */
export type JSONLDSchema =
  | OrganizationSchema
  | WebSiteSchema
  | ArticleSchema
  | BreadcrumbListSchema

export type OrganizationSchema = {
  '@context': 'https://schema.org'
  '@type': 'Organization'
  name: string
  url: string
  logo?: string
  description?: string
  sameAs?: string[]
  contactPoint?: {
    '@type': 'ContactPoint'
    contactType: string
    email?: string
    url?: string
  }
}

export type WebSiteSchema = {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  name: string
  url: string
  description?: string
  potentialAction?: {
    '@type': 'SearchAction'
    target: {
      '@type': 'EntryPoint'
      urlTemplate: string
    }
    'query-input': string
  }
}

export type ArticleSchema = {
  '@context': 'https://schema.org'
  '@type': 'Article'
  headline: string
  description?: string
  image?: string | string[]
  datePublished?: string
  dateModified?: string
  author?: {
    '@type': 'Person' | 'Organization'
    name: string
    url?: string
  }
  publisher?: {
    '@type': 'Organization'
    name: string
    logo?: {
      '@type': 'ImageObject'
      url: string
    }
  }
}

export type BreadcrumbListSchema = {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item?: string
  }>
}

/**
 * Generate JSON-LD schema script tag
 */
function generateJSONLDScript(schema: JSONLDSchema): string {
  return JSON.stringify(schema, null, 2)
}

/**
 * Common JSON-LD schemas
 */
export const jsonLD = {
  organization: (config: {
    name: string
    url: string
    logo?: string
    description?: string
    sameAs?: string[]
  }): OrganizationSchema => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    url: config.url,
    ...(config.logo && { logo: config.logo }),
    ...(config.description && { description: config.description }),
    sameAs: config.sameAs ?? STATUS_SOCIAL_LINKS,
  }),

  website: (config: {
    name: string
    url: string
    description?: string
    searchUrl?: string
  }): WebSiteSchema => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    url: config.url,
    ...(config.description && { description: config.description }),
    ...(config.searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: config.searchUrl,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  }),

  article: (config: {
    headline: string
    description?: string
    image?: string | string[]
    datePublished?: string
    dateModified?: string
    author?: { name: string; url?: string; type?: 'Person' | 'Organization' }
    publisher?: { name: string; logo?: string }
  }): ArticleSchema => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.headline,
    ...(config.description && { description: config.description }),
    ...(config.image && { image: config.image }),
    ...(config.datePublished && { datePublished: config.datePublished }),
    ...(config.dateModified && { dateModified: config.dateModified }),
    ...(config.author && {
      author: {
        '@type': config.author.type || 'Person',
        name: config.author.name,
        ...(config.author.url && { url: config.author.url }),
      },
    }),
    ...(config.publisher && {
      publisher: {
        '@type': 'Organization',
        name: config.publisher.name,
        ...(config.publisher.logo && {
          logo: {
            '@type': 'ImageObject',
            url: config.publisher.logo,
          },
        }),
      },
    }),
  }),

  breadcrumbList: (
    items: Array<{ name: string; url?: string }>
  ): BreadcrumbListSchema => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && {
        item: item.url.startsWith('http')
          ? item.url
          : `${DEFAULT_SITE_URL}${item.url}`,
      }),
    })),
  }),
}

type JSONLDProps = {
  schema: JSONLDSchema | JSONLDSchema[]
}

/**
 * Component to inject JSON-LD structured data into the page
 * Usage: <JSONLDScript schema={jsonLD.article({...})} />
 */
export function JSONLDScript({ schema }: JSONLDProps) {
  const schemas = Array.isArray(schema) ? schema : [schema]

  return (
    <>
      {schemas.map((s, index) => (
        <script
          key={index}
          id={`json-ld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateJSONLDScript(s),
          }}
        />
      ))}
    </>
  )
}
