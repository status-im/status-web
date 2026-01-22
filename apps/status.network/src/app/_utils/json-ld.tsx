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

/**
 * Status Network social media links
 */
const STATUS_NETWORK_SOCIAL_LINKS: string[] = [
  'https://x.com/StatusL2',
  'https://github.com/status-im',
]

/**
 * JSON-LD schema generators with Status Network defaults
 */
export const jsonLD = createAppJSONLD({
  defaultSiteUrl: 'https://status.network',
  defaultSocialLinks: STATUS_NETWORK_SOCIAL_LINKS,
  defaultName: 'Status Network',
  defaultUrl: 'https://status.network',
})

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
