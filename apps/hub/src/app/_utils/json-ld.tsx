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
export const jsonLD = createJSONLD({
  defaultSiteUrl: 'https://hub.status.network',
  defaultSocialLinks: STATUS_HUB_SOCIAL_LINKS,
})

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
