import {
  createAppJSONLD,
  JSONLDScript as BaseJSONLDScript,
} from '@status-im/components'

import type {
  ArticleSchema,
  BreadcrumbListSchema,
  JSONLDSchema,
  OrganizationSchema,
  SoftwareApplicationSchema,
  WebSiteSchema,
} from '@status-im/components'

const DEFAULT_NAME = 'Status Network Hub'
const DEFAULT_URL = 'https://hub.status.network'

const STATUS_HUB_SOCIAL_LINKS: string[] = [
  'https://status.network/',
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
  }) =>
    baseJsonLD.organization({
      name: DEFAULT_NAME,
      url: DEFAULT_URL,
      ...config,
      sameAs: config?.sameAs ?? STATUS_HUB_SOCIAL_LINKS,
    }),
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
  WebSiteSchema,
}

/**
 * Re-export JSONLDScript component
 */
export { BaseJSONLDScript as JSONLDScript }
