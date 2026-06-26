import { z } from 'zod'

import { builderHubTagSchema, rewardSchema } from './builders-hub'
import {
  ctaSchema,
  httpsUrlSchema,
  isoDateTimeSchema,
  languageSchema,
  linkHrefSchema,
  mediaRefSchema,
  schemaVersion,
} from './common'

/**
 * Internal-only route path. Pages are statically rendered under `/[locale]`,
 * so the stored route is always relative to the locale segment and starts
 * with "/".
 */
const routePathSchema = z
  .string()
  .min(1)
  .refine((value) => value.startsWith('/'), 'route must start with "/"')

/**
 * Section keys mirror Figma section keys (e.g. "home.atf", "home.techStack",
 * "buildersHub.heroSection"). The shape is intentionally permissive — design
 * naming evolves and a regex would just rot.
 */
const sectionKeySchema = z.string().min(1)

// ---------------------------------------------------------------------------
// PageSeo
// ---------------------------------------------------------------------------

export const pageSeoSchema = z.object({
  /** Overrides PageCopy.title for the document `<title>`. */
  metaTitle: z.string().min(1).optional(),
  /** Overrides PageCopy.description for the meta description. */
  metaDescription: z.string().min(1).optional(),
  keywords: z.array(z.string().min(1)).optional(),
  ogImage: mediaRefSchema.optional(),
  noindex: z.boolean().optional(),
  canonicalUrl: httpsUrlSchema.optional(),
})
export type PageSeo = z.infer<typeof pageSeoSchema>

// ---------------------------------------------------------------------------
// Section types (discriminated by `componentType`)
// ---------------------------------------------------------------------------

export const heroSectionSchema = z.object({
  componentType: z.literal('hero'),
  key: sectionKeySchema,
  eyebrow: z.string().min(1).optional(),
  headline: z.string().min(1),
  body: z.string().min(1).optional(),
  bodySecondary: z.string().min(1).optional(),
  items: z
    .array(
      z.object({
        label: z.string().min(1).optional(),
        title: z.string().min(1),
        description: z.string().min(1).optional(),
        href: linkHrefSchema.optional(),
      })
    )
    .optional(),
  status: z
    .object({
      label: z.string().min(1),
      body: z.string().min(1),
      cta: ctaSchema.optional(),
      secondaryCta: ctaSchema.optional(),
    })
    .optional(),
  background: mediaRefSchema.optional(),
  ctas: z.array(ctaSchema).optional(),
})
export type HeroSection = z.infer<typeof heroSectionSchema>

export const richTextSectionSchema = z.object({
  componentType: z.literal('richText'),
  key: sectionKeySchema,
  body: z.string().min(1),
})
export type RichTextSection = z.infer<typeof richTextSectionSchema>

const cardGridCardSchema = z.object({
  label: z.string().min(1).optional(),
  footerLabel: z.string().min(1).optional(),
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  image: mediaRefSchema.optional(),
  cta: ctaSchema.optional(),
  secondaryCta: ctaSchema.optional(),
  showIcon: z.boolean().optional(),
})

export const cardGridSectionSchema = z.object({
  componentType: z.literal('cardGrid'),
  key: sectionKeySchema,
  /**
   * Optional small eyebrow label rendered above the heading. Common in mid-
   * page section blocks ("Cryptarchia", "Use Cases") that sit alongside body
   * copy and a section-level CTA.
   */
  eyebrow: z.string().min(1).optional(),
  heading: z.string().min(1).optional(),
  subheading: z.string().min(1).optional(),
  /**
   * Optional second subheading paragraph. Some sections (Use Cases on home
   * and /technology-stack) split a long subheading across two desktop
   * columns; the component renders both side-by-side on desktop and
   * concatenated on mobile.
   */
  subheadingExtra: z.string().min(1).optional(),
  /** Section-level CTA, separate from per-card CTAs. */
  cta: ctaSchema.optional(),
  cards: z.array(cardGridCardSchema).min(1),
})
export type CardGridSection = z.infer<typeof cardGridSectionSchema>

const tableRowSchema = z.object({
  number: z.string().min(1).optional(),
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  reward: rewardSchema.optional(),
  cta: ctaSchema.optional(),
  secondaryCta: ctaSchema.optional(),
})

export const tableSectionSchema = z.object({
  componentType: z.literal('table'),
  key: sectionKeySchema,
  title: z.string().min(1),
  subtitle: z.string().min(1).optional(),
  action: ctaSchema.optional(),
  rows: z.array(tableRowSchema).default([]),
})
export type TableSection = z.infer<typeof tableSectionSchema>

export const giantSwitchSectionSchema = z.object({
  componentType: z.literal('giantSwitch'),
  key: sectionKeySchema,
  accent: z.enum(['grey', 'yellow']),
  imagePosition: z.enum(['left', 'right']),
  title: z.string().min(1),
  description: z.string().min(1),
  image: mediaRefSchema,
  tags: z.array(builderHubTagSchema).optional(),
  primaryCta: ctaSchema.optional(),
  secondaryCta: ctaSchema.optional(),
})
export type GiantSwitchSection = z.infer<typeof giantSwitchSectionSchema>

export const relatedArticlesSectionSchema = z.object({
  componentType: z.literal('relatedArticles'),
  key: sectionKeySchema,
  label: z.string().min(1).optional(),
  mobileLabel: z.string().min(1).optional(),
  eyebrow: z.string().min(1).optional(),
  title: z.string().min(1),
  cta: ctaSchema.optional(),
  items: z
    .array(
      z.object({
        title: z.string().min(1),
        mobileTitle: z.string().min(1).optional(),
        image: mediaRefSchema,
        imagePosition: z.string().min(1).optional(),
        date: z.string().min(1),
        author: z.string().min(1),
        readingTime: z.number().int().positive(),
        href: linkHrefSchema,
      })
    )
    .optional(),
  visibleCount: z.number().int().positive().optional(),
})
export type RelatedArticlesSection = z.infer<
  typeof relatedArticlesSectionSchema
>

export const ctaPanelSectionSchema = z.object({
  componentType: z.literal('ctaPanel'),
  key: sectionKeySchema,
  /** Optional small eyebrow label rendered above the title. */
  eyebrow: z.string().min(1).optional(),
  mobileEyebrow: z.string().min(1).optional(),
  footerLabel: z.string().min(1).optional(),
  title: z.string().min(1),
  mobileTitle: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  mobileDescription: z.string().min(1).optional(),
  image: mediaRefSchema.optional(),
  /**
   * Optional. Some "annotated text + image" sections render without a CTA
   * (e.g. LMN intro on the messaging page). Sections that do need a CTA
   * just provide it; sections that don't omit the field.
   */
  cta: ctaSchema.optional(),
  /**
   * Optional secondary CTA rendered alongside the primary one. Used by
   * sections like the home Circles CTA where users can either find an
   * existing circle or start a new one.
   */
  secondaryCta: ctaSchema.optional(),
})
export type CtaPanelSection = z.infer<typeof ctaPanelSectionSchema>

const galleryItemSchema = z.object({
  image: mediaRefSchema,
  caption: z.string().min(1).optional(),
  /**
   * Free-form date string. ISO 8601 is preferred when callers need to compare
   * or sort, but gallery captions often want abbreviated forms ("FEB 14").
   */
  date: z.union([isoDateTimeSchema, z.string().min(1)]).optional(),
})

export const gallerySectionSchema = z.object({
  componentType: z.literal('gallery'),
  key: sectionKeySchema,
  items: z.array(galleryItemSchema).min(1),
})
export type GallerySection = z.infer<typeof gallerySectionSchema>

const techStackPillarSchema = z.object({
  id: z.enum(['storage', 'messaging', 'blockchain', 'userModules']),
  title: z.string().min(1),
  body: z.string().min(1),
  href: linkHrefSchema,
  details: z
    .array(
      z.object({
        title: z.string().min(1),
        body: z.string().min(1),
      })
    )
    .optional(),
})

const techStackArchitectureSchema = z.object({
  eyebrow: z.string().min(1).optional(),
  title: z.string().min(1),
  body: z.array(z.string().min(1)).min(1),
  cta: ctaSchema.optional(),
  image: mediaRefSchema,
})

const techStackBasecampSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1).optional(),
  href: linkHrefSchema,
  cta: ctaSchema.optional(),
})

export const techStackOverviewSectionSchema = z.object({
  componentType: z.literal('techStackOverview'),
  key: sectionKeySchema,
  /**
   * Optional small label rendered above the title — used by surfaces that
   * combine the techStackOverview with intro copy (e.g. the home page).
   */
  eyebrow: z.string().min(1).optional(),
  /** Optional section-level title. The /technology-stack page itself shows
   * the title in a separate hero, so it's not required there. */
  title: z.string().min(1).optional(),
  /** Optional section-level CTA (e.g. "See the Stack"). */
  cta: ctaSchema.optional(),
  architecture: techStackArchitectureSchema.optional(),
  basecamp: techStackBasecampSchema.optional(),
  pillars: z.array(techStackPillarSchema).length(4),
  networkingTitle: z.string().min(1),
  networkingDescription: z.string().min(1).optional(),
  foundationTitle: z.string().min(1),
  foundationDescription: z.string().min(1).optional(),
})
export type TechStackOverviewSection = z.infer<
  typeof techStackOverviewSectionSchema
>

/**
 * Marketing slogan / annotated-text section: a title with a highlighted
 * leading word (accent color), followed by an optional multi-paragraph body
 * and optional CTA. Common Logos design pattern that appears on the home
 * page (Mountain, Parallel Society headline) and the technology-stack page
 * (Modular by design.).
 *
 * The split between `highlight` and `rest` is data-driven rather than
 * derived by string matching so editors can change either independently
 * without component refactors.
 */
export const featuredTextSectionSchema = z.object({
  componentType: z.literal('featuredText'),
  key: sectionKeySchema,
  eyebrow: z.string().min(1).optional(),
  /** Title rendered as a highlighted leading phrase + plain trailing phrase. */
  title: z.object({
    highlight: z.string().min(1),
    rest: z.string().min(1),
  }),
  /** Optional multi-paragraph body. Each entry renders as its own <p>. */
  body: z.array(z.string().min(1)).optional(),
  cta: ctaSchema.optional(),
  /** Optional secondary CTA — used by sections like home Circles CTA where
   * users can pick between two related actions. */
  secondaryCta: ctaSchema.optional(),
  image: mediaRefSchema.optional(),
})
export type FeaturedTextSection = z.infer<typeof featuredTextSectionSchema>

/**
 * Escape hatch for one-off sections. The `payload` is validated against the
 * Zod schema registered for `customSchemaId` at load time (see
 * `./custom-sections.ts`), not at parse time.
 */
export const customSectionSchema = z.object({
  componentType: z.literal('custom'),
  key: sectionKeySchema,
  customSchemaId: z.string().min(1),
  payload: z.unknown(),
})
export type CustomSection = z.infer<typeof customSectionSchema>

// ---------------------------------------------------------------------------
// PageSection discriminated union
// ---------------------------------------------------------------------------

export const pageSectionSchema = z.discriminatedUnion('componentType', [
  heroSectionSchema,
  richTextSectionSchema,
  cardGridSectionSchema,
  tableSectionSchema,
  giantSwitchSectionSchema,
  relatedArticlesSectionSchema,
  ctaPanelSectionSchema,
  gallerySectionSchema,
  techStackOverviewSectionSchema,
  featuredTextSectionSchema,
  customSectionSchema,
])
export type PageSection = z.infer<typeof pageSectionSchema>

// ---------------------------------------------------------------------------
// PageCopy
// ---------------------------------------------------------------------------

export const pageCopySchema = z.object({
  schemaVersion: schemaVersion(1),
  language: languageSchema,
  route: routePathSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  heading: z.string().min(1).optional(),
  seo: pageSeoSchema.optional(),
  sections: z.array(pageSectionSchema).default([]),
})
export type PageCopy = z.infer<typeof pageCopySchema>
