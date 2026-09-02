import {
  createAppJSONLD,
  createJSONLD,
  JSONLDScript as BaseJSONLDScript,
} from '@status-im/components'

import {
  SITE_DESCRIPTION,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_URL,
} from '~/config/site'

import type {
  ArticleSchema,
  BreadcrumbListSchema,
  JSONLDSchema,
  OrganizationSchema,
  WebPageSchema,
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
  defaultSiteUrl: SITE_URL,
  defaultSocialLinks: STATUS_SOCIAL_LINKS,
})
const appJsonLD = createAppJSONLD()

/**
 * JSON-LD schema generators with app-specific defaults
 */
export const jsonLD = {
  ...baseJsonLD,
  webpage: appJsonLD.webpage,
  /**
   * The Status organization, identical on every page that declares it.
   *
   * It takes no arguments on purpose. Callers used to pass the current page's
   * meta description, which made Google read `/keycard` as saying the Status
   * organization *is* "A secure contactless hardware wallet". Page-level copy
   * belongs on the `WebPage` node.
   */
  organization: () =>
    baseJsonLD.organization({
      name: SITE_NAME,
      url: SITE_URL,
      logo: SITE_LOGO_URL,
      description: SITE_DESCRIPTION,
    }),
  website: (config?: {
    description?: string
    searchUrl?: string
    name?: string
    url?: string
  }) =>
    baseJsonLD.website({
      name: config?.name ?? SITE_NAME,
      url: config?.url ?? SITE_URL,
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
  WebPageSchema,
  WebSiteSchema,
}

/**
 * Re-export JSONLDScript component
 */
export { BaseJSONLDScript as JSONLDScript }
