import type { ReactNode } from 'react'

/**
 * JSON-LD Schema types
 */
export type JSONLDSchema =
  | OrganizationSchema
  | WebSiteSchema
  | WebPageSchema
  | ArticleSchema
  | BreadcrumbListSchema
  | FAQPageSchema
  | SoftwareApplicationSchema

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

export type WebPageSchema = {
  '@context': 'https://schema.org'
  '@type': 'WebPage'
  name?: string
  description?: string
  url?: string
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

export type FAQPageSchema = {
  '@context': 'https://schema.org'
  '@type': 'FAQPage'
  mainEntity: Array<{
    '@type': 'Question'
    name: string
    acceptedAnswer: {
      '@type': 'Answer'
      text: string
    }
  }>
}

export type SoftwareApplicationSchema = {
  '@context': 'https://schema.org'
  '@type': 'SoftwareApplication'
  name: string
  applicationCategory: string
  operatingSystem: string
  url: string
  description?: string
}

type CreateJSONLDConfig = {
  defaultSiteUrl: string
  defaultSocialLinks?: string[]
}

/**
 * Generate JSON-LD schema script tag
 */
function generateJSONLDScript(schema: JSONLDSchema): string {
  return JSON.stringify(schema, null, 2)
}

/**
 * Create JSON-LD schema generators with site-specific defaults
 */
export function createJSONLD(config: CreateJSONLDConfig) {
  const { defaultSiteUrl, defaultSocialLinks = [] } = config

  return {
    organization: (orgConfig: {
      name: string
      url: string
      logo?: string
      description?: string
      sameAs?: string[]
    }): OrganizationSchema => ({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: orgConfig.name,
      url: orgConfig.url,
      ...(orgConfig.logo && { logo: orgConfig.logo }),
      ...(orgConfig.description && { description: orgConfig.description }),
      sameAs: orgConfig.sameAs ?? defaultSocialLinks,
    }),

    website: (websiteConfig: {
      name: string
      url: string
      description?: string
      searchUrl?: string
    }): WebSiteSchema => ({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: websiteConfig.name,
      url: websiteConfig.url,
      ...(websiteConfig.description && {
        description: websiteConfig.description,
      }),
      ...(websiteConfig.searchUrl && {
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: websiteConfig.searchUrl,
          },
          'query-input': 'required name=search_term_string',
        },
      }),
    }),

    article: (articleConfig: {
      headline: string
      description?: string
      image?: string | string[]
      datePublished?: string
      dateModified?: string
      author?: {
        name: string
        url?: string
        type?: 'Person' | 'Organization'
      }
      publisher?: { name: string; logo?: string }
    }): ArticleSchema => ({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: articleConfig.headline,
      ...(articleConfig.description && {
        description: articleConfig.description,
      }),
      ...(articleConfig.image && { image: articleConfig.image }),
      ...(articleConfig.datePublished && {
        datePublished: articleConfig.datePublished,
      }),
      ...(articleConfig.dateModified && {
        dateModified: articleConfig.dateModified,
      }),
      ...(articleConfig.author && {
        author: {
          '@type': articleConfig.author.type || 'Person',
          name: articleConfig.author.name,
          ...(articleConfig.author.url && { url: articleConfig.author.url }),
        },
      }),
      ...(articleConfig.publisher && {
        publisher: {
          '@type': 'Organization',
          name: articleConfig.publisher.name,
          ...(articleConfig.publisher.logo && {
            logo: {
              '@type': 'ImageObject',
              url: articleConfig.publisher.logo,
            },
          }),
        },
      }),
    }),

    breadcrumbList: (
      items: Array<{ name: string; url?: string }>,
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
            : `${defaultSiteUrl}${item.url}`,
        }),
      })),
    }),

    faqPage: (faqConfig: {
      questions: Array<{ question: string; answer: string }>
    }): FAQPageSchema => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqConfig.questions.map(q => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer,
        },
      })),
    }),
  }
}

type CreateAppJSONLDConfig = {
  defaultSiteUrl: string
  defaultSocialLinks?: string[]
  defaultName: string
  defaultUrl: string
}

/**
 * Create enhanced JSON-LD schema generators with app-specific defaults
 * Includes support for @id, publisher, webpage, and softwareApplication
 */
export function createAppJSONLD(config: CreateAppJSONLDConfig) {
  const { defaultName, defaultUrl } = config
  const baseJsonLD = createJSONLD({
    defaultSiteUrl: config.defaultSiteUrl,
    defaultSocialLinks: config.defaultSocialLinks,
  })

  return {
    ...baseJsonLD,
    organization: (orgConfig?: {
      '@id'?: string
      name?: string
      url?: string
      description?: string
      logo?: string
      sameAs?: string[]
    }) => {
      const { '@id': id, ...restConfig } = orgConfig ?? {}
      const schema = baseJsonLD.organization({
        name: orgConfig?.name ?? defaultName,
        url: orgConfig?.url ?? defaultUrl,
        ...restConfig,
      })
      return id ? { ...schema, '@id': id } : schema
    },
    website: (websiteConfig?: {
      '@id'?: string
      description?: string
      searchUrl?: string
      name?: string
      url?: string
      publisher?: {
        '@id'?: string
      }
    }) => {
      const { '@id': id, publisher, ...restConfig } = websiteConfig ?? {}
      const schema = baseJsonLD.website({
        name: restConfig.name ?? defaultName,
        url: restConfig.url ?? defaultUrl,
        description: restConfig.description,
        searchUrl: restConfig.searchUrl,
      })
      return {
        ...schema,
        ...(id && { '@id': id }),
        ...(publisher && { publisher }),
      }
    },
    webpage: (webpageConfig: {
      name?: string
      description?: string
      url?: string
    }): WebPageSchema => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      ...(webpageConfig.name && { name: webpageConfig.name }),
      ...(webpageConfig.description && {
        description: webpageConfig.description,
      }),
      ...(webpageConfig.url && { url: webpageConfig.url }),
    }),
    softwareApplication: (appConfig: {
      name: string
      applicationCategory: string
      operatingSystem: string
      url: string
      description?: string
    }): SoftwareApplicationSchema => ({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: appConfig.name,
      applicationCategory: appConfig.applicationCategory,
      operatingSystem: appConfig.operatingSystem,
      url: appConfig.url,
      ...(appConfig.description && { description: appConfig.description }),
    }),
  }
}

type JSONLDProps = {
  schema: JSONLDSchema | JSONLDSchema[]
}

/**
 * Component to inject JSON-LD structured data into the page
 * Usage: <JSONLDScript schema={jsonLD.article({...})} />
 */
export function JSONLDScript({ schema }: JSONLDProps): ReactNode {
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
