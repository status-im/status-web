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

export const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})
export type Coordinates = z.infer<typeof coordinatesSchema>

/**
 * IANA timezone validator. Defers to the runtime's `Intl.DateTimeFormat`
 * implementation so the supported list stays in sync with the platform we
 * actually run on (Node 24 in CI, Node 24 at build time on Vercel).
 */
const isValidIanaTimeZone = (value: string): boolean => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format(new Date())
    return true
  } catch {
    return false
  }
}

export const ianaTimeZoneSchema = z
  .string()
  .min(1)
  .refine(
    isValidIanaTimeZone,
    'must be a valid IANA timezone, e.g. "America/Los_Angeles"'
  )

/**
 * Discord channel handle stored without the leading `#`. UI prepends it when
 * rendering (e.g. Figma displays "#circle-los-angeles").
 */
const discordChannelSchema = z
  .string()
  .min(1)
  .refine(
    (value) => !value.startsWith('#'),
    'discordChannel must be stored without leading "#"'
  )

const organizerSchema = z.object({
  name: z.string().min(1),
  handle: z.string().min(1).optional(),
  avatar: mediaRefSchema.optional(),
})
export type CircleOrganizer = z.infer<typeof organizerSchema>

const hostSchema = z.object({
  name: z.string().min(1),
  avatar: mediaRefSchema.optional(),
})
export type CircleEventHost = z.infer<typeof hostSchema>

// ---------------------------------------------------------------------------
// Circle
// ---------------------------------------------------------------------------

/**
 * Locale-agnostic Circle record.
 * Stored at `content/circles/circles/<slug>/index.json`.
 *
 * Place names (`city`, `country`, `region`) are stored here and treated as
 * English by default. When a locale that requires translated place names is
 * activated, those fields move into `<locale>.json` shape — that is a Phase 5
 * schema bump.
 */
export const circleIndexSchema = z.object({
  schemaVersion: schemaVersion(1),
  slug: slugSchema,
  status: publishStateSchema,
  city: z.string().min(1),
  country: z.string().min(1),
  region: z.string().min(1).optional(),
  coordinates: coordinatesSchema,
  timezone: ianaTimeZoneSchema,
  memberCount: z.number().int().nonnegative().optional(),
  discordChannel: discordChannelSchema.optional(),
  discordUrl: linkHrefSchema.optional(),
  forumUrl: linkHrefSchema.optional(),
  joinUrl: linkHrefSchema,
  image: mediaRefSchema.optional(),
  organizers: z.array(organizerSchema).optional(),
  order: z.number().int().nonnegative().optional(),
  /**
   * Defaults to `{ label: 'All circles', href: '/circles' }` when omitted;
   * the loader applies that default so the schema stays open to overrides.
   */
  detailBackLink: backLinkSchema.optional(),
})
export type CircleIndex = z.infer<typeof circleIndexSchema>

export const circleLocaleSchema = z.object({
  language: languageSchema,
  name: z.string().min(1),
  description: z.string().min(1),
})
export type CircleLocale = z.infer<typeof circleLocaleSchema>

// ---------------------------------------------------------------------------
// CircleEvent
// ---------------------------------------------------------------------------

/**
 * Locale-agnostic CircleEvent record.
 * Stored at `content/circles/events/<slug>/index.json`.
 *
 * `startsAt` is the primary source of truth for all date/time rendering;
 * `displayDateOverride` / `displayWeekdayOverride` / `displayTimeOverride`
 * are escape hatches for events whose auto-formatted output is wrong (e.g.
 * multi-day events, unusual venues). The CMS form leaves them blank by
 * default; if filled, they take precedence on every surface uniformly.
 */
export const circleEventIndexSchema = z
  .object({
    schemaVersion: schemaVersion(1),
    slug: slugSchema,
    status: publishStateSchema,
    circleSlug: slugSchema,
    startsAt: isoDateTimeSchema,
    endsAt: isoDateTimeSchema.optional(),
    timezone: ianaTimeZoneSchema,
    displayDateOverride: z.string().min(1).optional(),
    displayWeekdayOverride: z.string().min(1).optional(),
    displayTimeOverride: z.string().min(1).optional(),
    venueName: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    eventUrl: linkHrefSchema.optional(),
    image: mediaRefSchema.optional(),
    hostedBy: z.array(hostSchema).default([]),
    featured: z.boolean(),
    /**
     * Optional series number, e.g. 5 → renders as "Los Angeles Circle #5".
     * The loader auto-prefills max+1 within `circleSlug` when omitted.
     */
    sequenceNumber: z.number().int().positive().optional(),
  })
  .refine(
    (event) => event.endsAt === undefined || event.endsAt >= event.startsAt,
    {
      message: 'endsAt must be greater than or equal to startsAt',
      path: ['endsAt'],
    }
  )
export type CircleEventIndex = z.infer<typeof circleEventIndexSchema>

export const circleEventLocaleSchema = z.object({
  language: languageSchema,
  /**
   * Override; loader prefills from circle.name + sequenceNumber, e.g.
   * "Los Angeles Circle #5".
   */
  title: z.string().min(1),
  /**
   * City + region shown on the index card with the map-pin icon
   * (e.g. "Florianópolis, Santa Catarina"). The detail card uses
   * `venueName` instead.
   */
  locationLabel: z.string().min(1),
})
export type CircleEventLocale = z.infer<typeof circleEventLocaleSchema>

// ---------------------------------------------------------------------------
// CircleInitiative
// ---------------------------------------------------------------------------

export const circleInitiativeIndexSchema = z.object({
  schemaVersion: schemaVersion(1),
  slug: slugSchema,
  status: publishStateSchema,
  circleSlug: slugSchema,
  href: linkHrefSchema,
  image: mediaRefSchema,
  featured: z.boolean(),
  order: z.number().int().nonnegative().optional(),
})
export type CircleInitiativeIndex = z.infer<typeof circleInitiativeIndexSchema>

export const circleInitiativeLocaleSchema = z.object({
  language: languageSchema,
  locationLabel: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  ctaLabel: z.string().min(1),
})
export type CircleInitiativeLocale = z.infer<
  typeof circleInitiativeLocaleSchema
>

// ---------------------------------------------------------------------------
// CircleResource (per-locale flat file, same shape as BuilderResource)
// ---------------------------------------------------------------------------

export const circleResourceLocaleSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  ctaLabel: z.string().min(1),
  /** Duplicated across locale files; loader warns on divergence. */
  href: linkHrefSchema,
  /** Duplicated across locale files; loader warns on divergence. */
  status: publishStateSchema,
})
export type CircleResourceLocale = z.infer<typeof circleResourceLocaleSchema>

export const circleResourcesFileSchema = z.object({
  schemaVersion: schemaVersion(1),
  language: languageSchema,
  items: z.array(circleResourceLocaleSchema).default([]),
})
export type CircleResourcesFile = z.infer<typeof circleResourcesFileSchema>

// ---------------------------------------------------------------------------
// CirclesSettings (per-locale)
// ---------------------------------------------------------------------------

const mapSettingsSchema = z.object({
  defaultZoom: z.number().positive(),
  defaultCenter: coordinatesSchema,
  /** Static-image fallback rendered behind the markers in Phase 1. */
  image: mediaRefSchema.optional(),
  attribution: z.object({
    label: z.string().min(1),
    linkLabel: z.string().min(1),
    href: linkHrefSchema,
  }),
  zoomInAriaLabel: z.string().min(1),
  zoomOutAriaLabel: z.string().min(1),
  /** Shown on touch devices when the user tries to pan with a single finger. */
  gestureHintLabel: z.string().min(1).optional(),
})

const nearbyCtaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  cta: ctaSchema,
})

const eventsSectionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  calendarCta: ctaSchema,
})

const initiativesSectionSchema = z.object({
  title: z.string().min(1),
  cta: ctaSchema.optional(),
})

const circlesResourcesSectionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  helpCenterCta: ctaSchema.optional(),
})

export const circlesSettingsSchema = z.object({
  schemaVersion: schemaVersion(1),
  language: languageSchema,
  hero: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    eyebrow: z.string().min(1).optional(),
    backLink: backLinkSchema.optional(),
    topRightCta: ctaSchema.optional(),
    findCta: ctaSchema,
    joinCta: ctaSchema,
  }),
  map: mapSettingsSchema,
  nearbyCta: nearbyCtaSchema,
  eventsSection: eventsSectionSchema,
  initiativesSection: initiativesSectionSchema,
  /**
   * Shared label for the hero Join button on every Circle detail page
   * (Figma value: "Join this circle"). Stored sentence case; the component
   * uppercases at render.
   */
  detailJoinCtaLabel: z.string().min(1),
  resourcesSection: circlesResourcesSectionSchema,
})
export type CirclesSettings = z.infer<typeof circlesSettingsSchema>
