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
 * Status organization social media links
 */
const STATUS_SOCIAL_LINKS: string[] = [
  'https://x.com/ethstatus',
  'https://github.com/status-im',
  'https://www.youtube.com/@Statusim',
]

/**
 * Create JSON-LD schema generators with Status.app defaults
 */
const baseJsonLD = createJSONLD({
  defaultSiteUrl: 'https://status.app',
  defaultSocialLinks: STATUS_SOCIAL_LINKS,
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
      name: 'Status',
      url: 'https://status.app',
      ...config,
    }),
  website: (config?: {
    description?: string
    searchUrl?: string
    name?: string
    url?: string
  }) =>
    baseJsonLD.website({
      name: config?.name ?? 'Status',
      url: config?.url ?? 'https://status.app',
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
