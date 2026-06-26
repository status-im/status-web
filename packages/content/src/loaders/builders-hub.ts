import { assertActiveLocale } from '../locales/registry'
import {
  type BuilderHubListingPageSettings,
  type BuilderHubSettings,
  type BuilderResourceLocale,
  type IdeaIndex,
  type IdeaLocale,
  type Language,
  type PublishState,
  type RFPIndex,
  type RFPLocale,
  builderHubListingPageSettingsSchema,
  builderHubSettingsSchema,
  builderResourcesFileSchema,
  ideaIndexSchema,
  ideaLocaleSchema,
  rfpIndexSchema,
  rfpLocaleSchema,
} from '../schemas/index'

import { contentPath, listDirectories, readJson } from './_fs'

const RFPS_DIR = 'builders-hub/rfps'
const IDEAS_DIR = 'builders-hub/ideas'
const SETTINGS_DIR = 'builders-hub/settings'
const RESOURCES_DIR = 'builders-hub/resources'
const LISTINGS_DIR = 'builders-hub/listings'

const DEFAULT_HOME_IDEAS_COUNT = 7
const DEFAULT_HOME_RFP_GRID_COUNT = 8

// ---------------------------------------------------------------------------
// View models
// ---------------------------------------------------------------------------

export type Rfp = RFPIndex & RFPLocale
export type Idea = IdeaIndex & IdeaLocale & { relatedRfpSlugs: string[] }
export type BuilderResource = BuilderResourceLocale

export type BuilderHubHomeRfpResolution = {
  rfps: Rfp[]
  terminator: BuilderHubHomeTerminator | null
}

export type BuilderHubHomeTerminator =
  | {
      kind: 'see-all-ideas'
      title: string
      href: string
      thumbnailIdeas: Idea[]
    }
  | {
      kind: 'see-all-rfps'
      title: string
      href: string
      thumbnailRfps: Rfp[]
    }

export type BuilderHubHomeIdeaResolution = {
  ideas: Idea[]
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

/**
 * Plan §4 ordering convention: `order` ascending, then date descending, then
 * `slug` for tie-break. Records without `order` sort after ordered ones.
 * Records without a date sort after dated ones.
 */
const compareWithFallback = (
  a: { slug: string; order?: number; date?: string },
  b: { slug: string; order?: number; date?: string }
): number => {
  const aOrder = a.order ?? Number.MAX_SAFE_INTEGER
  const bOrder = b.order ?? Number.MAX_SAFE_INTEGER
  if (aOrder !== bOrder) return aOrder - bOrder

  if (a.date && b.date && a.date !== b.date) return b.date.localeCompare(a.date)
  if (a.date && !b.date) return -1
  if (!a.date && b.date) return 1

  return a.slug.localeCompare(b.slug)
}

const sortRfpsCanonical = (rfps: Rfp[]): Rfp[] =>
  [...rfps].sort((a, b) =>
    compareWithFallback(
      { slug: a.slug, order: a.order, date: a.publishedAt },
      { slug: b.slug, order: b.order, date: b.publishedAt }
    )
  )

const sortIdeasCanonical = (ideas: Idea[]): Idea[] =>
  [...ideas].sort((a, b) =>
    compareWithFallback(
      { slug: a.slug, order: a.order, date: a.submittedAt },
      { slug: b.slug, order: b.order, date: b.submittedAt }
    )
  )

// ---------------------------------------------------------------------------
// Single-record loaders
// ---------------------------------------------------------------------------

const loadRfpRecord = async (slug: string, locale: Language): Promise<Rfp> => {
  const indexData = await readJson(
    contentPath(RFPS_DIR, slug, 'index.json'),
    rfpIndexSchema
  )
  const localeData = await readJson(
    contentPath(RFPS_DIR, slug, `${locale}.json`),
    rfpLocaleSchema
  )
  if (indexData.slug !== slug) {
    throw new Error(
      `RFP slug mismatch: directory "${slug}" but index.json says "${indexData.slug}"`
    )
  }
  return { ...indexData, ...localeData }
}

const loadIdeaRecordWithoutReverseRefs = async (
  slug: string,
  locale: Language
): Promise<Omit<Idea, 'relatedRfpSlugs'>> => {
  const indexData = await readJson(
    contentPath(IDEAS_DIR, slug, 'index.json'),
    ideaIndexSchema
  )
  const localeData = await readJson(
    contentPath(IDEAS_DIR, slug, `${locale}.json`),
    ideaLocaleSchema
  )
  if (indexData.slug !== slug) {
    throw new Error(
      `Idea slug mismatch: directory "${slug}" but index.json says "${indexData.slug}"`
    )
  }
  return { ...indexData, ...localeData }
}

// ---------------------------------------------------------------------------
// Settings + flat files
// ---------------------------------------------------------------------------

export const getBuilderHubSettings = async (
  locale: Language
): Promise<BuilderHubSettings> => {
  assertActiveLocale(locale)
  return readJson(
    contentPath(SETTINGS_DIR, `${locale}.json`),
    builderHubSettingsSchema
  )
}

export const getBuilderHubListingSettings = async ({
  page,
  locale,
}: {
  page: 'ideas' | 'rfps'
  locale: Language
}): Promise<BuilderHubListingPageSettings> => {
  assertActiveLocale(locale)
  return readJson(
    contentPath(LISTINGS_DIR, page, `${locale}.json`),
    builderHubListingPageSettingsSchema
  )
}

export const getBuilderResources = async ({
  locale,
  status,
}: {
  locale: Language
  status?: PublishState
}): Promise<BuilderResource[]> => {
  assertActiveLocale(locale)
  const file = await readJson(
    contentPath(RESOURCES_DIR, `${locale}.json`),
    builderResourcesFileSchema
  )
  return status
    ? file.items.filter((item) => item.status === status)
    : file.items
}

// ---------------------------------------------------------------------------
// RFP / Idea collection loaders
// ---------------------------------------------------------------------------

type CollectionListOptions = {
  locale: Language
  status?: PublishState
  limit?: number
}

export const getAllRfps = async ({
  locale,
  status,
  limit,
}: CollectionListOptions): Promise<Rfp[]> => {
  assertActiveLocale(locale)
  const slugs = await listDirectories(contentPath(RFPS_DIR))
  const rfps = await Promise.all(
    slugs.map((slug) => loadRfpRecord(slug, locale))
  )
  const filtered = status ? rfps.filter((rfp) => rfp.status === status) : rfps
  const sorted = sortRfpsCanonical(filtered)
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted
}

export const getAllIdeas = async ({
  locale,
  status,
  limit,
}: CollectionListOptions): Promise<Idea[]> => {
  assertActiveLocale(locale)
  const ideaSlugs = await listDirectories(contentPath(IDEAS_DIR))
  const [rawIdeas, allRfps] = await Promise.all([
    Promise.all(
      ideaSlugs.map((slug) => loadIdeaRecordWithoutReverseRefs(slug, locale))
    ),
    // Reverse-ref source: pull all RFPs (no status filter — a published Idea
    // may be referenced by an in-review RFP and the editor still wants to see
    // the link surfaced).
    getAllRfps({ locale }),
  ])

  const reverseRefs = new Map<string, string[]>()
  for (const rfp of allRfps) {
    for (const ideaSlug of rfp.relatedIdeas ?? []) {
      const list = reverseRefs.get(ideaSlug) ?? []
      list.push(rfp.slug)
      reverseRefs.set(ideaSlug, list)
    }
  }

  const ideas: Idea[] = rawIdeas.map((idea) => ({
    ...idea,
    relatedRfpSlugs: reverseRefs.get(idea.slug) ?? [],
  }))

  const filtered = status
    ? ideas.filter((idea) => idea.status === status)
    : ideas
  const sorted = sortIdeasCanonical(filtered)
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted
}

export const getRfpBySlug = async (
  slug: string,
  locale: Language
): Promise<Rfp> => {
  assertActiveLocale(locale)
  return loadRfpRecord(slug, locale)
}

export const getIdeaBySlug = async (
  slug: string,
  locale: Language
): Promise<Idea> => {
  assertActiveLocale(locale)
  const [base, allRfps] = await Promise.all([
    loadIdeaRecordWithoutReverseRefs(slug, locale),
    getAllRfps({ locale }),
  ])
  const relatedRfpSlugs = allRfps
    .filter((rfp) => rfp.relatedIdeas?.includes(slug))
    .map((rfp) => rfp.slug)
  return { ...base, relatedRfpSlugs }
}

// ---------------------------------------------------------------------------
// Home view resolvers (apply pinnedSlugs + displayCount + terminator)
// ---------------------------------------------------------------------------

const pickByPinnedThenLatest = <T extends { slug: string }>(
  pool: T[],
  pinnedSlugs: readonly string[] | undefined,
  totalSlots: number
): T[] => {
  if (totalSlots <= 0) return []
  const bySlug = new Map(pool.map((item) => [item.slug, item]))
  const pinned: T[] = []
  for (const slug of pinnedSlugs ?? []) {
    const match = bySlug.get(slug)
    if (match) pinned.push(match)
  }
  const seen = new Set(pinned.map((item) => item.slug))
  const fill = pool
    .filter((item) => !seen.has(item.slug))
    .slice(0, Math.max(0, totalSlots - pinned.length))
  return [...pinned, ...fill].slice(0, totalSlots)
}

export const resolveBuilderHubHomeRfps = async (
  locale: Language
): Promise<BuilderHubHomeRfpResolution> => {
  assertActiveLocale(locale)
  const [settings, allRfps] = await Promise.all([
    getBuilderHubSettings(locale),
    getAllRfps({ locale, status: 'published' }),
  ])
  const section = settings.rfpsSection

  const totalGridSlots = section.displayCount ?? DEFAULT_HOME_RFP_GRID_COUNT
  const rfpSlots = section.terminatorCard
    ? Math.max(0, totalGridSlots - 1)
    : totalGridSlots
  const rfps = pickByPinnedThenLatest(allRfps, section.pinnedSlugs, rfpSlots)

  let terminator: BuilderHubHomeTerminator | null = null
  if (section.terminatorCard) {
    const tc = section.terminatorCard
    if (tc.kind === 'see-all-ideas') {
      const allIdeas = await getAllIdeas({ locale, status: 'published' })
      const bySlug = new Map(allIdeas.map((idea) => [idea.slug, idea]))
      const thumbnailIdeas = tc.thumbnailSlugs
        .map((slug) => bySlug.get(slug))
        .filter((idea): idea is Idea => idea !== undefined)
      terminator = {
        kind: 'see-all-ideas',
        title: tc.title,
        href: tc.href,
        thumbnailIdeas,
      }
    } else {
      const bySlug = new Map(allRfps.map((rfp) => [rfp.slug, rfp]))
      const thumbnailRfps = tc.thumbnailSlugs
        .map((slug) => bySlug.get(slug))
        .filter((rfp): rfp is Rfp => rfp !== undefined)
      terminator = {
        kind: 'see-all-rfps',
        title: tc.title,
        href: tc.href,
        thumbnailRfps,
      }
    }
  }

  return { rfps, terminator }
}

export const resolveBuilderHubHomeIdeas = async (
  locale: Language
): Promise<BuilderHubHomeIdeaResolution> => {
  assertActiveLocale(locale)
  const [settings, allIdeas] = await Promise.all([
    getBuilderHubSettings(locale),
    getAllIdeas({ locale, status: 'published' }),
  ])
  const section = settings.ideasSection
  const limit = section.displayCount ?? DEFAULT_HOME_IDEAS_COUNT
  const ideas = pickByPinnedThenLatest(allIdeas, section.pinnedSlugs, limit)
  return { ideas }
}

export { DEFAULT_HOME_IDEAS_COUNT, DEFAULT_HOME_RFP_GRID_COUNT }
