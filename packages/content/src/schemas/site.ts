import { z } from 'zod'

import {
  httpsUrlSchema,
  languageSchema,
  linkHrefSchema,
  mediaRefSchema,
  schemaVersion,
} from './common'

export const navLinkSchema = z.object({
  label: z.string().min(1),
  href: linkHrefSchema,
})
export type NavLink = z.infer<typeof navLinkSchema>

export const footerLinkSchema = z.object({
  label: z.string().min(1),
  href: linkHrefSchema,
  external: z.boolean().optional(),
})
export type FooterLink = z.infer<typeof footerLinkSchema>

export const navCommunityCardSchema = z.object({
  label: z.string().min(1),
  href: linkHrefSchema,
  description: z.string().min(1),
  ctaLabel: z.string().min(1).optional(),
  image: mediaRefSchema,
})
export type NavCommunityCard = z.infer<typeof navCommunityCardSchema>

export const navSectionSchema = z.object({
  label: z.string().min(1),
  links: z.array(navLinkSchema).min(1),
})
export type NavSection = z.infer<typeof navSectionSchema>

export const navCardSectionSchema = z.object({
  label: z.string().min(1),
  cards: z.array(navCommunityCardSchema).min(1),
})
export type NavCardSection = z.infer<typeof navCardSectionSchema>

export const navMenuPanelSchema = z.object({
  label: z.string().min(1),
  textSections: z.array(navSectionSchema).default([]),
  cardSections: z.array(navCardSectionSchema).default([]),
  actionCards: z.array(navCommunityCardSchema).default([]),
})
export type NavMenuPanel = z.infer<typeof navMenuPanelSchema>

export const siteSettingsSchema = z.object({
  schemaVersion: schemaVersion(1),
  language: languageSchema,
  siteName: z.string().min(1),
  siteTitle: z.string().min(1),
  siteDescription: z.string().min(1),
  canonicalUrl: httpsUrlSchema,
  keywords: z.array(z.string().min(1)).default([]),
  defaultOgImage: mediaRefSchema.optional(),
  social: z
    .object({
      twitter: httpsUrlSchema.optional(),
      discord: httpsUrlSchema.optional(),
      youtube: httpsUrlSchema.optional(),
      github: httpsUrlSchema.optional(),
    })
    .default({}),
})
export type SiteSettings = z.infer<typeof siteSettingsSchema>

export const navigationSchema = z.object({
  schemaVersion: schemaVersion(1),
  language: languageSchema,
  closedBar: z.object({
    brandLabel: z.string().min(1),
    menuLabel: z.string().min(1),
    closeLabel: z.string().min(1),
    openAriaLabel: z.string().min(1),
    closeAriaLabel: z.string().min(1),
  }),
  sitemap: z.array(navLinkSchema).min(1),
  topLinks: z.array(navLinkSchema).default([]),
  primaryCta: navLinkSchema.optional(),
  resources: navSectionSchema.optional(),
  exploreSections: z.array(navCardSectionSchema).default([]),
  menuPanels: z.array(navMenuPanelSchema).default([]),
  communityCards: z.array(navCommunityCardSchema).default([]),
  blog: z.object({
    label: z.string().min(1),
    seeAllLabel: z.string().min(1),
    seeAllHref: linkHrefSchema,
    visibleCount: z.number().int().positive().optional(),
  }),
})
export type Navigation = z.infer<typeof navigationSchema>

export const footerSchema = z.object({
  schemaVersion: schemaVersion(1),
  language: languageSchema,
  newsletter: z.object({
    title: z.string().min(1),
    emailLabel: z.string().min(1),
    roleLabel: z.string().min(1),
    cityLabel: z.string().min(1),
    submitLabel: z.string().min(1),
  }),
  tagline: z.string().min(1),
  image: mediaRefSchema,
  mainLinks: z.array(footerLinkSchema).default([]),
  socialLinks: z.array(footerLinkSchema).default([]),
  researchLinks: z.array(footerLinkSchema).default([]),
  infrastructureLinks: z.array(footerLinkSchema).default([]),
  legalLinks: z.array(footerLinkSchema).default([]),
  builtBy: z.object({
    label: z.string().min(1),
    attribution: z.string().min(1),
    href: linkHrefSchema.optional(),
  }),
})
export type Footer = z.infer<typeof footerSchema>
