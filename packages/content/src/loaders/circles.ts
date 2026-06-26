import { assertActiveLocale } from '../locales/registry'
import {
  type BackLink,
  type CircleEventIndex,
  type CircleEventLocale,
  type CircleIndex,
  type CircleInitiativeIndex,
  type CircleInitiativeLocale,
  type CircleLocale,
  type CircleResourceLocale,
  type CirclesSettings,
  type Language,
  type PublishState,
  circleEventIndexSchema,
  circleEventLocaleSchema,
  circleIndexSchema,
  circleInitiativeIndexSchema,
  circleInitiativeLocaleSchema,
  circleLocaleSchema,
  circleResourcesFileSchema,
  circlesSettingsSchema,
} from '../schemas/index'

import { contentPath, listDirectories, readJson } from './_fs'

const SETTINGS_DIR = 'circles/settings'
const CIRCLES_DIR = 'circles/circles'
const EVENTS_DIR = 'circles/events'
const INITIATIVES_DIR = 'circles/initiatives'
const RESOURCES_DIR = 'circles/resources'

const DEFAULT_DETAIL_BACK_LINK: BackLink = {
  label: 'All circles',
  href: '/circles',
}

// ---------------------------------------------------------------------------
// View models
// ---------------------------------------------------------------------------

export type Circle = Omit<CircleIndex, 'detailBackLink'> &
  CircleLocale & {
    /** Always present after loading; defaults applied by the loader. */
    detailBackLink: BackLink
    /** GeoJSON-friendly accessor: `[lng, lat]`. */
    coordinatesGeoJson: [number, number]
  }

/**
 * `sequenceNumber` becomes required on the view model: the loader fills any
 * missing value with `max(existing) + 1` within the same `circleSlug`,
 * skipping numbers already taken by explicit overrides.
 */
export type CircleEvent = Omit<CircleEventIndex, 'sequenceNumber'> &
  CircleEventLocale & { sequenceNumber: number }

export type CircleInitiative = CircleInitiativeIndex & CircleInitiativeLocale

export type CircleResource = CircleResourceLocale

export type CircleEventDateGroup = {
  /** YYYY-MM-DD in the event's local timezone — stable React key. */
  groupKey: string
  /** Display string for the group header date portion (e.g. "January 21"). */
  date: string
  /** Display string for the group header weekday portion (e.g. "Wednesday"). */
  weekday: string
  events: CircleEvent[]
}

// ---------------------------------------------------------------------------
// Single-record loaders
// ---------------------------------------------------------------------------

const loadCircleRecord = async (
  slug: string,
  locale: Language
): Promise<Circle> => {
  const indexData = await readJson(
    contentPath(CIRCLES_DIR, slug, 'index.json'),
    circleIndexSchema
  )
  const localeData = await readJson(
    contentPath(CIRCLES_DIR, slug, `${locale}.json`),
    circleLocaleSchema
  )
  if (indexData.slug !== slug) {
    throw new Error(
      `Circle slug mismatch: directory "${slug}" but index.json says "${indexData.slug}"`
    )
  }
  const { detailBackLink, coordinates, ...rest } = indexData
  return {
    ...rest,
    ...localeData,
    coordinates,
    detailBackLink: detailBackLink ?? DEFAULT_DETAIL_BACK_LINK,
    coordinatesGeoJson: [coordinates.lng, coordinates.lat],
  }
}

const loadCircleEventRecordRaw = async (
  slug: string,
  locale: Language
): Promise<CircleEventIndex & CircleEventLocale> => {
  const indexData = await readJson(
    contentPath(EVENTS_DIR, slug, 'index.json'),
    circleEventIndexSchema
  )
  const localeData = await readJson(
    contentPath(EVENTS_DIR, slug, `${locale}.json`),
    circleEventLocaleSchema
  )
  if (indexData.slug !== slug) {
    throw new Error(
      `CircleEvent slug mismatch: directory "${slug}" but index.json says "${indexData.slug}"`
    )
  }
  return { ...indexData, ...localeData }
}

const loadInitiativeRecord = async (
  slug: string,
  locale: Language
): Promise<CircleInitiative> => {
  const indexData = await readJson(
    contentPath(INITIATIVES_DIR, slug, 'index.json'),
    circleInitiativeIndexSchema
  )
  const localeData = await readJson(
    contentPath(INITIATIVES_DIR, slug, `${locale}.json`),
    circleInitiativeLocaleSchema
  )
  if (indexData.slug !== slug) {
    throw new Error(
      `CircleInitiative slug mismatch: directory "${slug}" but index.json says "${indexData.slug}"`
    )
  }
  return { ...indexData, ...localeData }
}

// ---------------------------------------------------------------------------
// sequenceNumber auto-prefill
// ---------------------------------------------------------------------------

/**
 * For each `circleSlug`, sort events by `startsAt` ascending and fill any
 * missing `sequenceNumber` with the next unused integer starting at 1,
 * skipping values already held by explicit overrides.
 */
const fillSequenceNumbers = (
  events: ReadonlyArray<CircleEventIndex & CircleEventLocale>
): CircleEvent[] => {
  const groupedBySlug = new Map<
    string,
    Array<CircleEventIndex & CircleEventLocale>
  >()
  for (const event of events) {
    const list = groupedBySlug.get(event.circleSlug) ?? []
    list.push(event)
    groupedBySlug.set(event.circleSlug, list)
  }

  const filledBySlug = new Map<string, CircleEvent>()
  for (const list of groupedBySlug.values()) {
    list.sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    const taken = new Set<number>()
    for (const event of list) {
      if (event.sequenceNumber !== undefined) taken.add(event.sequenceNumber)
    }
    let next = 1
    for (const event of list) {
      if (event.sequenceNumber !== undefined) {
        filledBySlug.set(event.slug, {
          ...event,
          sequenceNumber: event.sequenceNumber,
        })
        continue
      }
      while (taken.has(next)) next++
      taken.add(next)
      filledBySlug.set(event.slug, { ...event, sequenceNumber: next })
      next++
    }
  }

  // Preserve original input order so caller-side filters/sorts stay stable.
  return events.map(
    (event) => filledBySlug.get(event.slug) ?? { ...event, sequenceNumber: 1 }
  )
}

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

export type CircleEventSurface =
  | 'index-group'
  | 'index-card-time'
  | 'detail-date'
  | 'detail-time'
  | 'press'

type DateFormatOptions = Intl.DateTimeFormatOptions & { timeZone: string }

const formatInTimezone = (
  iso: string,
  locale: Language,
  options: DateFormatOptions
): string => new Intl.DateTimeFormat(locale, options).format(new Date(iso))

const formatPressDate = (
  iso: string,
  locale: Language,
  timeZone: string
): string => {
  // Press cards render dates as MM.DD.YY (e.g. "02.14.26"). Use formatToParts
  // so the part order is stable regardless of locale.
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone,
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(iso))
  const month = parts.find((p) => p.type === 'month')?.value ?? ''
  const day = parts.find((p) => p.type === 'day')?.value ?? ''
  const year = parts.find((p) => p.type === 'year')?.value ?? ''
  return `${month}.${day}.${year}`
}

type EventDateInputs = Pick<
  CircleEventIndex,
  | 'startsAt'
  | 'timezone'
  | 'displayDateOverride'
  | 'displayTimeOverride'
  | 'displayWeekdayOverride'
>

/**
 * Surface-specific event date string. Override fields take precedence on
 * every surface that includes the corresponding field.
 *
 * - `index-group`     → "January 21 / Wednesday"
 * - `index-card-time` → "12:00 PM"            (component appends viewer-local)
 * - `detail-date`     → "February 22, 2026"
 * - `detail-time`     → "12:00 PM"
 * - `press`           → "02.14.26"
 *
 * The `index-card` surface in the original spec is split into
 * `index-card-time` here because the date row is in the group header above
 * the card and the only per-card content is the event-local time string.
 */
export const formatEventDateForSurface = (
  event: EventDateInputs,
  surface: CircleEventSurface,
  locale: Language
): string => {
  switch (surface) {
    case 'index-group': {
      const date =
        event.displayDateOverride ??
        formatInTimezone(event.startsAt, locale, {
          timeZone: event.timezone,
          month: 'long',
          day: 'numeric',
        })
      const weekday =
        event.displayWeekdayOverride ??
        formatInTimezone(event.startsAt, locale, {
          timeZone: event.timezone,
          weekday: 'long',
        })
      return `${date} / ${weekday}`
    }
    case 'index-card-time':
    case 'detail-time': {
      return (
        event.displayTimeOverride ??
        formatInTimezone(event.startsAt, locale, {
          timeZone: event.timezone,
          hour: 'numeric',
          minute: '2-digit',
        })
      )
    }
    case 'detail-date': {
      return (
        event.displayDateOverride ??
        formatInTimezone(event.startsAt, locale, {
          timeZone: event.timezone,
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      )
    }
    case 'press': {
      return (
        event.displayDateOverride ??
        formatPressDate(event.startsAt, locale, event.timezone)
      )
    }
  }
}

const buildEventGroupKey = (event: {
  startsAt: string
  timezone: string
}): string => {
  // 'sv-SE' formats dates as ISO YYYY-MM-DD; combined with the event's own
  // timezone this yields a stable, timezone-correct group key.
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: event.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(event.startsAt))
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

const sortByOrderThenSlug = <T extends { slug: string; order?: number }>(
  items: T[]
): T[] =>
  [...items].sort((a, b) => {
    const aOrder = a.order ?? Number.MAX_SAFE_INTEGER
    const bOrder = b.order ?? Number.MAX_SAFE_INTEGER
    if (aOrder !== bOrder) return aOrder - bOrder
    return a.slug.localeCompare(b.slug)
  })

const sortEventsByStartsAtAsc = (events: CircleEvent[]): CircleEvent[] =>
  [...events].sort((a, b) => {
    if (a.startsAt !== b.startsAt) return a.startsAt.localeCompare(b.startsAt)
    return a.slug.localeCompare(b.slug)
  })

// ---------------------------------------------------------------------------
// Public loaders
// ---------------------------------------------------------------------------

export const getCirclesSettings = async (
  locale: Language
): Promise<CirclesSettings> => {
  assertActiveLocale(locale)
  return readJson(
    contentPath(SETTINGS_DIR, `${locale}.json`),
    circlesSettingsSchema
  )
}

export const getCircles = async ({
  locale,
  status,
}: {
  locale: Language
  status?: PublishState
}): Promise<Circle[]> => {
  assertActiveLocale(locale)
  const slugs = await listDirectories(contentPath(CIRCLES_DIR))
  const circles = await Promise.all(
    slugs.map((slug) => loadCircleRecord(slug, locale))
  )
  const filtered = status ? circles.filter((c) => c.status === status) : circles
  return sortByOrderThenSlug(filtered)
}

export const getCircleBySlug = async (
  slug: string,
  locale: Language
): Promise<Circle> => {
  assertActiveLocale(locale)
  return loadCircleRecord(slug, locale)
}

export const getCircleResources = async ({
  locale,
  status,
}: {
  locale: Language
  status?: PublishState
}): Promise<CircleResource[]> => {
  assertActiveLocale(locale)
  const file = await readJson(
    contentPath(RESOURCES_DIR, `${locale}.json`),
    circleResourcesFileSchema
  )
  return status
    ? file.items.filter((item) => item.status === status)
    : file.items
}

const loadAllEventsRaw = async (
  locale: Language
): Promise<Array<CircleEventIndex & CircleEventLocale>> => {
  const slugs = await listDirectories(contentPath(EVENTS_DIR))
  return Promise.all(
    slugs.map((slug) => loadCircleEventRecordRaw(slug, locale))
  )
}

export const getCircleEvents = async ({
  circleSlug,
  locale,
  status,
}: {
  circleSlug?: string
  locale: Language
  status?: PublishState
}): Promise<CircleEvent[]> => {
  assertActiveLocale(locale)
  const raw = await loadAllEventsRaw(locale)
  // sequenceNumber is computed across ALL events for a circleSlug, so we
  // assign numbers before filtering.
  const filled = fillSequenceNumbers(raw)
  const filtered = filled.filter((event) => {
    if (circleSlug && event.circleSlug !== circleSlug) return false
    if (status && event.status !== status) return false
    return true
  })
  return sortEventsByStartsAtAsc(filtered)
}

export const getCircleEventsGroupedByDate = async ({
  locale,
  status,
}: {
  locale: Language
  status?: PublishState
}): Promise<CircleEventDateGroup[]> => {
  const events = await getCircleEvents({ locale, status })

  const groups = new Map<string, CircleEventDateGroup>()
  for (const event of events) {
    const groupKey = buildEventGroupKey(event)
    let group = groups.get(groupKey)
    if (!group) {
      group = {
        groupKey,
        date:
          event.displayDateOverride ??
          formatInTimezone(event.startsAt, locale, {
            timeZone: event.timezone,
            month: 'long',
            day: 'numeric',
          }),
        weekday:
          event.displayWeekdayOverride ??
          formatInTimezone(event.startsAt, locale, {
            timeZone: event.timezone,
            weekday: 'long',
          }),
        events: [],
      }
      groups.set(groupKey, group)
    }
    group.events.push(event)
  }

  return [...groups.values()].sort((a, b) =>
    a.groupKey.localeCompare(b.groupKey)
  )
}

export const getCircleInitiatives = async ({
  circleSlug,
  locale,
  status,
}: {
  circleSlug?: string
  locale: Language
  status?: PublishState
}): Promise<CircleInitiative[]> => {
  assertActiveLocale(locale)
  const slugs = await listDirectories(contentPath(INITIATIVES_DIR))
  const initiatives = await Promise.all(
    slugs.map((slug) => loadInitiativeRecord(slug, locale))
  )
  const filtered = initiatives.filter((initiative) => {
    if (circleSlug && initiative.circleSlug !== circleSlug) return false
    if (status && initiative.status !== status) return false
    return true
  })
  return sortByOrderThenSlug(filtered)
}

export { DEFAULT_DETAIL_BACK_LINK }
