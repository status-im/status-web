import { z } from 'zod'

/**
 * Language is the closed set of locales the schema can represent.
 * The active locale list is read from `apps/web/i18n/routing.ts` at build time;
 * this union is intentionally pre-declared so adding a locale is a routing
 * change, not a schema change.
 */
export const languageSchema = z.enum(['en', 'fr', 'ko'])
export type Language = z.infer<typeof languageSchema>

export const publishStateSchema = z.enum([
  'draft',
  'review',
  'published',
  'archived',
])
export type PublishState = z.infer<typeof publishStateSchema>

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const slugSchema = z
  .string()
  .min(1)
  .regex(SLUG_PATTERN, 'slug must be lowercase kebab-case')

/**
 * Internal links start with `/`, external links start with `https://`, and
 * same-page anchors start with `#` (e.g. `#map` scrolls to `id="map"`).
 * Other protocols (mailto:, tel:, etc.) can be added when a real use case appears.
 */
export const linkHrefSchema = z
  .string()
  .min(1)
  .refine(
    (value) =>
      value.startsWith('/') ||
      value.startsWith('https://') ||
      value.startsWith('#'),
    'href must start with "/" (internal), "https://" (external), or "#" (anchor)'
  )

export const httpsUrlSchema = z
  .string()
  .min(1)
  .refine(
    (value) => value.startsWith('https://'),
    'URL must start with "https://"'
  )

export const isoDateTimeSchema = z.string().datetime({ offset: true })

/**
 * Builds a literal Zod schema for a known `schemaVersion` value.
 * Loaders compare the parsed version against the latest known version and
 * either pass through, run a migration, or fail the build.
 */
export const schemaVersion = <V extends number>(version: V) =>
  z.literal(version)

export const mediaRefSchema = z.object({
  /**
   * Phase 1: absolute path from `apps/web/public`, e.g. `/cms/circles/los-angeles/cover.webp`.
   * The path constraint is enforced by the loader, not by the schema, so a future
   * external-storage adapter can swap to CDN URLs without a schema bump.
   */
  src: z.string().min(1),
  /**
   * Required as a string. Decorative images use an explicit empty string;
   * the editor UI labels that case "decorative" so intent is recorded.
   */
  alt: z.string(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  credit: z.string().optional(),
})
export type MediaRef = z.infer<typeof mediaRefSchema>

export const ctaVariantSchema = z.enum([
  'primary',
  'secondary',
  'tertiary',
  'link',
])
export type CtaVariant = z.infer<typeof ctaVariantSchema>

export const ctaIconOverrideSchema = z.union([
  z.literal('arrow-right'),
  z.literal('arrow-left'),
  z.literal('none'),
  z.string().min(1),
])
export type CtaIconOverride = z.infer<typeof ctaIconOverrideSchema>

/**
 * Small "← <parent>" link rendered above hero sections on detail and listing
 * pages. Labels are stored sentence case; the CTA component uppercases them
 * at render.
 */
export const backLinkSchema = z.object({
  label: z.string().min(1),
  href: linkHrefSchema,
})
export type BackLink = z.infer<typeof backLinkSchema>

export const ctaSchema = z.object({
  /**
   * Stored sentence case (e.g. "Join this circle"); the CTA component renders
   * uppercase via CSS so editors never have to type SHOUTING text.
   */
  label: z.string().min(1),
  href: linkHrefSchema,
  external: z.boolean().optional(),
  variant: ctaVariantSchema.optional(),
  iconOverride: ctaIconOverrideSchema.optional(),
})
export type CTA = z.infer<typeof ctaSchema>
