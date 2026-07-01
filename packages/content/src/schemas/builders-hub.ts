import { z } from 'zod'

import {
  backLinkSchema,
  ctaSchema,
  isoDateTimeSchema,
  languageSchema,
  linkHrefSchema,
  mediaRefSchema,
  publishStateSchema,
  schemaVersion,
  slugSchema,
} from './common'

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export const rewardCurrencySchema = z.literal('USDC')
export type RewardCurrency = z.infer<typeof rewardCurrencySchema>

export const rewardSchema = z.object({
  amount: z.number().positive(),
  currency: rewardCurrencySchema,
  xp: z.number().int().positive().optional(),
})
export type Reward = z.infer<typeof rewardSchema>

export const builderHubTagIconSchema = z.enum([
  'wallet',
  'chat',
  'files',
  'explorer',
  'lambda',
])
export type BuilderHubTagIcon = z.infer<typeof builderHubTagIconSchema>

export const builderHubTagSchema = z.object({
  label: z.string().min(1),
  icon: builderHubTagIconSchema.optional(),
})
export type BuilderHubTag = z.infer<typeof builderHubTagSchema>

// ---------------------------------------------------------------------------
// RFP
// ---------------------------------------------------------------------------

/**
 * Locale-agnostic RFP record.
 * Stored at `content/builders-hub/rfps/<slug>/index.json`.
 *
 * `relatedIdeas` is a one-way reference. The reverse direction is computed
 * by the loader at build time, not stored on `Idea`, to avoid two-sided
 * sync drift.
 */
export const rfpIndexSchema = z.object({
  schemaVersion: schemaVersion(1),
  slug: slugSchema,
  status: publishStateSchema,
  reward: rewardSchema,
  applyUrl: linkHrefSchema,
  tags: z.array(z.string().min(1)).default([]),
  image: mediaRefSchema.optional(),
  featured: z.boolean(),
  order: z.number().int().nonnegative().optional(),
  publishedAt: isoDateTimeSchema.optional(),
  closesAt: isoDateTimeSchema.optional(),
  owner: z
    .object({
      name: z.string().min(1),
      handle: z.string().min(1).optional(),
    })
    .optional(),
  relatedIdeas: z.array(slugSchema).optional(),
})
export type RFPIndex = z.infer<typeof rfpIndexSchema>

export const rfpLocaleSchema = z.object({
  language: languageSchema,
  title: z.string().min(1),
  /**
   * One-line pitch (~80 chars). Renders on the Builders Hub home card and
   * compact listing rows. Falls back to the leading clause of `summary` when
   * absent, but authors should set it explicitly because auto-truncation can
   * cut mid-sentence.
   */
  tagline: z.string().min(1).max(120).optional(),
  summary: z.string().min(1),
  description: z.string().min(1),
  ctaLabel: z.string().min(1).optional(),
})
export type RFPLocale = z.infer<typeof rfpLocaleSchema>

// ---------------------------------------------------------------------------
// Idea
// ---------------------------------------------------------------------------

/**
 * Submitter handle is stored without the leading `@`; the UI prepends it
 * when rendering. The validator rejects values starting with `@` to prevent
 * accidental double-prefixing.
 */
const submitterHandleSchema = z
  .string()
  .min(1)
  .refine(
    (value) => !value.startsWith('@'),
    'handle must be stored without leading "@"'
  )

export const ideaIndexSchema = z.object({
  schemaVersion: schemaVersion(1),
  slug: slugSchema,
  status: publishStateSchema,
  submitter: z.object({
    name: z.string().min(1).optional(),
    handle: submitterHandleSchema,
  }),
  reward: rewardSchema.optional(),
  image: mediaRefSchema.optional(),
  tags: z.array(z.string().min(1)).default([]),
  featured: z.boolean(),
  order: z.number().int().nonnegative().optional(),
  submittedAt: isoDateTimeSchema.optional(),
  discussionUrl: linkHrefSchema.optional(),
})
export type IdeaIndex = z.infer<typeof ideaIndexSchema>

export const ideaLocaleSchema = z.object({
  language: languageSchema,
  title: z.string().min(1),
  /**
   * One-line pitch (~80 chars) for the Builders Hub home idea row. Same
   * fallback semantics as the RFP `tagline`.
   */
  tagline: z.string().min(1).max(120).optional(),
  summary: z.string().min(1),
  description: z.string().min(1),
  ctaLabel: z.string().min(1).optional(),
})
export type IdeaLocale = z.infer<typeof ideaLocaleSchema>

// ---------------------------------------------------------------------------
// Builder resources (per-locale flat file)
// ---------------------------------------------------------------------------

export const builderResourceLocaleSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  ctaLabel: z.string().min(1),
  /**
   * Duplicated across locale files; the loader emits a CI warning when the
   * `href` for the same `slug` diverges between locales.
   */
  href: linkHrefSchema,
  /**
   * Duplicated across locale files; the loader warns on divergence between
   * locales for the same `slug`.
   */
  status: publishStateSchema,
})
export type BuilderResourceLocale = z.infer<typeof builderResourceLocaleSchema>

export const builderResourcesFileSchema = z.object({
  schemaVersion: schemaVersion(1),
  language: languageSchema,
  items: z.array(builderResourceLocaleSchema).default([]),
})
export type BuilderResourcesFile = z.infer<typeof builderResourcesFileSchema>

// ---------------------------------------------------------------------------
// BuilderHubSettings (per-locale)
// ---------------------------------------------------------------------------

const overviewLinkSchema = z.object({
  /**
   * Free-form key. Known values: 'ideas', 'rfps', 'resources',
   * 'github-issues', 'contribute'. Editors may add new keys for new rows.
   */
  key: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema.optional(),
})

const terminatorCardKindSchema = z.enum(['see-all-rfps', 'see-all-ideas'])
export type TerminatorCardKind = z.infer<typeof terminatorCardKindSchema>

const terminatorCardSchema = z.object({
  kind: terminatorCardKindSchema,
  title: z.string().min(1),
  /**
   * 1–4 slugs from the linked collection (ideas / rfps). The schema enforces
   * the count; the loader verifies that each slug references a published
   * record.
   */
  thumbnailSlugs: z.array(slugSchema).min(1).max(4),
  href: linkHrefSchema,
})

const rfpsSectionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  filterCta: ctaSchema.optional(),
  seeAllCta: ctaSchema,
  submitCta: ctaSchema.optional(),
  pinnedSlugs: z.array(slugSchema).optional(),
  displayCount: z.number().int().positive().optional(),
  terminatorCard: terminatorCardSchema.optional(),
})

const ideasSectionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  seeAllCta: ctaSchema,
  submitCta: ctaSchema.optional(),
  pinnedSlugs: z.array(slugSchema).optional(),
  displayCount: z.number().int().positive().optional(),
})

const appInstallSchema = z.object({
  accent: z.enum(['grey', 'yellow']),
  imagePosition: z.enum(['left', 'right']),
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(builderHubTagSchema).default([]),
  installCta: ctaSchema,
  learnMoreCta: ctaSchema,
  image: mediaRefSchema,
})

/**
 * Two distinct treatments in Figma: rounded image-overlay (boilerplate apps)
 * and flat dark-green pill (office hours). When variant is 'image-overlay',
 * `image` must be provided; the schema enforces that with a refine.
 */
const actionPanelSchema = z
  .object({
    variant: z.enum(['image-overlay', 'flat']),
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    image: mediaRefSchema.optional(),
    cta: ctaSchema,
  })
  .refine(
    (panel) => panel.variant !== 'image-overlay' || panel.image !== undefined,
    {
      message: 'actionPanel.image is required when variant is "image-overlay"',
      path: ['image'],
    }
  )

const officeHoursSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  cta: ctaSchema,
})

const resourcesSectionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  helpCenterCta: ctaSchema.optional(),
})

const journeyLinkSchema = z.object({
  label: z.string().min(1),
  href: linkHrefSchema,
})

const builderHubInfoCardSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: mediaRefSchema.optional(),
  /**
   * How the card image fills its frame. `cover` (default) crops to fill —
   * correct for full-bleed graphics. `contain` shows the whole image without
   * cropping — needed for images with built-in padding (e.g. the terminal
   * mockup) that would otherwise be clipped.
   */
  imageFit: z.enum(['cover', 'contain']).default('cover'),
  ctas: z.array(ctaSchema).default([]),
})

const supportMetricSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
})

const supportCardSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  cta: ctaSchema,
  metrics: z.array(supportMetricSchema).optional(),
})

const documentationCategorySchema = z.object({
  title: z.string().min(1),
  links: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        cta: ctaSchema,
      })
    )
    .default([]),
})

export const builderHubSettingsSchema = z.object({
  schemaVersion: schemaVersion(1),
  language: languageSchema,
  hero: z.object({
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    eyebrow: z.string().min(1).optional(),
    backLink: backLinkSchema.optional(),
    topRightCta: ctaSchema.optional(),
    secondaryCtas: z.array(ctaSchema).optional(),
  }),
  overviewLinks: z.array(overviewLinkSchema).default([]),
  rfpsSection: rfpsSectionSchema,
  ideasSection: ideasSectionSchema,
  appInstall: appInstallSchema,
  actionPanels: z.array(actionPanelSchema).default([]),
  officeHours: officeHoursSchema.optional(),
  resourcesSection: resourcesSectionSchema,
  journey: z
    .object({
      title: z.string().min(1),
      links: z.array(journeyLinkSchema).min(1),
    })
    .optional(),
  inspiration: z
    .object({
      title: z.string().min(1),
      ideasTitle: z.string().min(1),
      ideasDescription: z.string().min(1),
      issuesTitle: z.string().min(1),
      issuesDescription: z.string().min(1),
      issuesImage: mediaRefSchema,
    })
    .optional(),
  prepare: z
    .object({
      title: z.string().min(1),
      cards: z.array(builderHubInfoCardSchema).min(1),
    })
    .optional(),
  build: z
    .object({
      title: z.string().min(1),
      cards: z.array(builderHubInfoCardSchema).min(1),
    })
    .optional(),
  programs: z
    .object({
      title: z.string().min(1),
      prizeTitle: z.string().min(1),
      prizeHeading: z.string().min(1),
      prizeDescription: z.string().min(1),
      prizeImage: mediaRefSchema,
      prizeHref: linkHrefSchema,
      rfpsTitle: z.string().min(1),
      rfpsDescription: z.string().min(1),
      rfpsHref: linkHrefSchema,
    })
    .optional(),
  support: z
    .object({
      title: z.string().min(1),
      cards: z.array(supportCardSchema).min(1),
    })
    .optional(),
  documentation: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      categories: z.array(documentationCategorySchema).min(1),
    })
    .optional(),
})
export type BuilderHubSettings = z.infer<typeof builderHubSettingsSchema>

// ---------------------------------------------------------------------------
// Listing page settings (Ideas / RFPs)
// ---------------------------------------------------------------------------

export const builderHubListingPageSettingsSchema = z.object({
  schemaVersion: schemaVersion(1),
  language: languageSchema,
  page: z.enum(['ideas', 'rfps']),
  title: z.string().min(1),
  description: z.string().min(1),
  breadcrumbLabel: z.string().min(1),
  submitCta: ctaSchema,
  defaultView: z.enum(['grid', 'list']),
  pageSize: z.number().int().min(1).max(50),
  pagination: z.object({
    previousLabel: z.string().min(1),
    nextLabel: z.string().min(1),
  }),
  bottomCta: z.object({
    title: z.string().min(1),
    cta: ctaSchema,
  }),
})
export type BuilderHubListingPageSettings = z.infer<
  typeof builderHubListingPageSettingsSchema
>
