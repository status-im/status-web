import {
  JSONLDScript as BaseJSONLDScript,
  createAppJSONLD,
} from '@status-im/components'
import type {
  ArticleSchema,
  BreadcrumbListSchema,
  JSONLDSchema,
  OrganizationSchema,
  SoftwareApplicationSchema,
  WebPageSchema,
  WebSiteSchema,
} from '@status-im/components'

const DEFAULT_NAME = 'Status Network'
const DEFAULT_URL = 'https://status.network'

const STATUS_NETWORK_SOCIAL_LINKS: string[] = [
  'https://x.com/StatusL2',
  'https://github.com/status-im',
]

const baseJsonLD = createAppJSONLD()

export const jsonLD = {
  ...baseJsonLD,
  organization: (config?: {
    '@id'?: string
    name?: string
    url?: string
    description?: string
    logo?: string
    sameAs?: string[]
  }) => {
    const { sameAs, ...restConfig } = config ?? {}
    return baseJsonLD.organization({
      name: DEFAULT_NAME,
      url: DEFAULT_URL,
      ...restConfig,
      sameAs: sameAs ?? STATUS_NETWORK_SOCIAL_LINKS,
    })
  },
}

/**
 * Re-export types for convenience
 */
export type {
  ArticleSchema,
  BreadcrumbListSchema,
  JSONLDSchema,
  OrganizationSchema,
  SoftwareApplicationSchema,
  WebPageSchema,
  WebSiteSchema,
}

/**
 * Re-export JSONLDScript component
 */
export { BaseJSONLDScript as JSONLDScript }
