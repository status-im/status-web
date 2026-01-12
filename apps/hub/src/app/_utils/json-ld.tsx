import {
  createJSONLD,
  JSONLDScript as BaseJSONLDScript,
} from '@status-im/components'

import type {
  ArticleSchema,
  BreadcrumbListSchema,
  JSONLDSchema,
  OrganizationSchema,
  WebSiteSchema,
} from '@status-im/components'

/**
 * Status Hub social media links
 */
const STATUS_HUB_SOCIAL_LINKS: string[] = [
  'https://x.com/StatusL2',
  'https://github.com/status-im',
]

/**
 * Create JSON-LD schema generators with Status Hub defaults
 */
const baseJsonLD = createJSONLD({
  defaultSiteUrl: 'https://hub.status.network',
  defaultSocialLinks: STATUS_HUB_SOCIAL_LINKS,
})

/**
 * JSON-LD schema generators with app-specific defaults
 */
export const jsonLD = {
  ...baseJsonLD,
  organization: (config?: {
    description?: string
    logo?: string
    sameAs?: string[]
  }) =>
    baseJsonLD.organization({
      name: 'Status Hub',
      url: 'https://hub.status.network',
      ...config,
    }),
  website: (config?: {
    description?: string
    searchUrl?: string
    name?: string
    url?: string
  }) =>
    baseJsonLD.website({
      name: config?.name ?? 'Status Hub',
      url: config?.url ?? 'https://hub.status.network',
      description: config?.description,
      searchUrl: config?.searchUrl,
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
  WebSiteSchema,
}

/**
 * Re-export JSONLDScript component
 */
export { BaseJSONLDScript as JSONLDScript }
