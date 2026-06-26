/**
 * Smoke validator for the content fixtures shipped with this repo.
 *
 * Walks the active locales, calls each loader against the on-disk fixtures,
 * and reports pass/fail counts. Exits non-zero on the first failure so CI
 * can gate merges on it.
 *
 * Phase 1 covers the loaders that have fixtures land first; the remaining
 * loaders are added as the corresponding fixtures appear.
 */
import type { Language } from '../src/schemas/common'

import {
  getAllIdeas,
  getAllRfps,
  getBuilderHubListingSettings,
  getBuilderHubSettings,
  getBuilderResources,
  resolveBuilderHubHomeIdeas,
  resolveBuilderHubHomeRfps,
} from '../src/loaders/builders-hub'
import {
  formatEventDateForSurface,
  getCircleEvents,
  getCircleEventsGroupedByDate,
  getCircleInitiatives,
  getCircleResources,
  getCircles,
  getCirclesSettings,
} from '../src/loaders/circles'
import { z } from 'zod'

import {
  __resetCustomSectionRegistryForTests,
  getCustomSectionSchema,
  registerCustomSection,
} from '../src/schemas/custom-sections'
import { customSectionSchema } from '../src/schemas/pages'
import { getPageCopy, parseCustomSectionPayload } from '../src/loaders/pages'
import {
  getFooter,
  getNavigationContent,
  getSiteSettings,
} from '../src/loaders/site'
import { getActiveLocales } from '../src/locales/registry'

type Check = {
  name: string
  run: () => Promise<unknown>
}

const buildSiteChecks = (locale: Language): Check[] => [
  { name: `site.settings (${locale})`, run: () => getSiteSettings(locale) },
  { name: `site.footer (${locale})`, run: () => getFooter(locale) },
  {
    name: `site.navigation (${locale})`,
    run: () => getNavigationContent(locale),
  },
]

const buildBuilderHubChecks = (locale: Language): Check[] => [
  {
    name: `builders-hub.settings (${locale})`,
    run: () => getBuilderHubSettings(locale),
  },
  {
    name: `builders-hub.resources (${locale}) → at least one published item`,
    run: async () => {
      const items = await getBuilderResources({ locale, status: 'published' })
      if (items.length === 0) {
        throw new Error('expected at least one published builder resource')
      }
      return items
    },
  },
  {
    name: `builders-hub.listings.ideas (${locale})`,
    run: () => getBuilderHubListingSettings({ page: 'ideas', locale }),
  },
  {
    name: `builders-hub.listings.rfps (${locale})`,
    run: () => getBuilderHubListingSettings({ page: 'rfps', locale }),
  },
  {
    name: `builders-hub.rfps (${locale}) → at least one published RFP`,
    run: async () => {
      const rfps = await getAllRfps({ locale, status: 'published' })
      if (rfps.length === 0) {
        throw new Error('no published RFPs found')
      }
      return rfps
    },
  },
  {
    name: `builders-hub.rfps (${locale}) → canonical sort (order asc, then publishedAt desc)`,
    run: async () => {
      const rfps = await getAllRfps({ locale, status: 'published' })
      for (let i = 1; i < rfps.length; i++) {
        const prevOrder = rfps[i - 1].order ?? Number.MAX_SAFE_INTEGER
        const curOrder = rfps[i].order ?? Number.MAX_SAFE_INTEGER
        if (prevOrder > curOrder) {
          throw new Error(
            `out-of-order: "${rfps[i - 1].slug}" (order=${prevOrder}) before "${rfps[i].slug}" (order=${curOrder})`
          )
        }
      }
      return rfps
    },
  },
  {
    name: `builders-hub.home rfps (${locale}) → resolves with terminator card`,
    run: async () => {
      const result = await resolveBuilderHubHomeRfps(locale)
      if (result.rfps.length === 0) {
        throw new Error('home grid resolved to zero RFPs')
      }
      if (!result.terminator) {
        throw new Error('terminator card not resolved')
      }
      if (
        result.terminator.kind === 'see-all-ideas' &&
        result.terminator.thumbnailIdeas.length === 0
      ) {
        throw new Error(
          'see-all-ideas terminator resolved with zero thumbnail ideas'
        )
      }
      return result
    },
  },
  {
    name: `builders-hub.ideas (${locale}) → at least one published Idea + reverse refs computed`,
    run: async () => {
      const ideas = await getAllIdeas({ locale, status: 'published' })
      if (ideas.length === 0) {
        throw new Error('no published Ideas found')
      }
      // Every Idea must carry a relatedRfpSlugs array (possibly empty).
      for (const idea of ideas) {
        if (!Array.isArray(idea.relatedRfpSlugs)) {
          throw new Error(`Idea "${idea.slug}" missing relatedRfpSlugs array`)
        }
      }
      // quadratic-voting is referenced by secure-decentralised-frontends.relatedIdeas
      // → its reverse ref must contain that RFP slug.
      const qv = ideas.find((i) => i.slug === 'quadratic-voting')
      if (
        qv &&
        !qv.relatedRfpSlugs.includes('secure-decentralised-frontends')
      ) {
        throw new Error(
          `quadratic-voting.relatedRfpSlugs missing "secure-decentralised-frontends": got [${qv.relatedRfpSlugs.join(', ')}]`
        )
      }
      return ideas
    },
  },
  {
    name: `builders-hub.home ideas (${locale}) → resolves`,
    run: async () => {
      const result = await resolveBuilderHubHomeIdeas(locale)
      if (result.ideas.length === 0) {
        throw new Error('home table resolved to zero Ideas')
      }
      return result
    },
  },
]

const buildCirclesChecks = (locale: Language): Check[] => [
  {
    name: `circles.settings (${locale})`,
    run: () => getCirclesSettings(locale),
  },
  {
    name: `circles.resources (${locale}) → at least one published item`,
    run: async () => {
      const items = await getCircleResources({ locale, status: 'published' })
      if (items.length === 0) {
        throw new Error('expected at least one published circle resource')
      }
      return items
    },
  },
  {
    name: `circles (${locale}) → at least one published Circle`,
    run: async () => {
      const circles = await getCircles({ locale, status: 'published' })
      if (circles.length === 0) {
        throw new Error('no published Circles found')
      }
      return circles
    },
  },
  {
    name: `circles (${locale}) → canonical sort (order asc, then slug)`,
    run: async () => {
      const circles = await getCircles({ locale, status: 'published' })
      for (let i = 1; i < circles.length; i++) {
        const prev = circles[i - 1].order ?? Number.MAX_SAFE_INTEGER
        const cur = circles[i].order ?? Number.MAX_SAFE_INTEGER
        if (prev > cur) {
          throw new Error(
            `out-of-order: "${circles[i - 1].slug}" (order=${prev}) before "${circles[i].slug}" (order=${cur})`
          )
        }
      }
      return circles
    },
  },
  {
    name: `circles (${locale}) → detailBackLink default applied + override honoured + coordinatesGeoJson present`,
    run: async () => {
      const circles = await getCircles({ locale, status: 'published' })
      for (const circle of circles) {
        if (!circle.detailBackLink) {
          throw new Error(
            `circle "${circle.slug}" missing detailBackLink (default should always apply)`
          )
        }
        if (
          !Array.isArray(circle.coordinatesGeoJson) ||
          circle.coordinatesGeoJson.length !== 2
        ) {
          throw new Error(
            `circle "${circle.slug}" missing coordinatesGeoJson [lng, lat]`
          )
        }
        const [lng, lat] = circle.coordinatesGeoJson
        if (lng !== circle.coordinates.lng || lat !== circle.coordinates.lat) {
          throw new Error(
            `circle "${circle.slug}" coordinatesGeoJson does not match coordinates`
          )
        }
      }
      // Florianópolis was authored with an explicit detailBackLink override
      // ("Back to all circles") — verify the override survives the loader.
      const flori = circles.find((c) => c.slug === 'florianopolis')
      if (flori && flori.detailBackLink.label !== 'Back to all circles') {
        throw new Error(
          `florianopolis detailBackLink override lost: got "${flori.detailBackLink.label}"`
        )
      }
      // Any circle without an explicit override should land on the loader default.
      const la = circles.find((c) => c.slug === 'los-angeles')
      if (la && la.detailBackLink.label !== 'All circles') {
        throw new Error(
          `los-angeles detailBackLink default not applied: got "${la.detailBackLink.label}"`
        )
      }
      return circles
    },
  },
  {
    name: `circle events (${locale}) → at least one published event`,
    run: async () => {
      const events = await getCircleEvents({ locale, status: 'published' })
      if (events.length === 0) {
        throw new Error('no published CircleEvents found')
      }
      // Each event keeps its explicit sequenceNumber after the loader pass.
      const expectations: Record<string, number> = {
        'los-angeles-circle-4': 4,
        'los-angeles-circle-5': 5,
        'florianopolis-circle-2': 2,
      }
      for (const event of events) {
        const expected = expectations[event.slug]
        if (expected !== undefined && event.sequenceNumber !== expected) {
          throw new Error(
            `event "${event.slug}" expected sequenceNumber=${expected}, got ${event.sequenceNumber}`
          )
        }
      }
      return events
    },
  },
  {
    name: `circle events (${locale}) → grouped by event-local date across timezones`,
    run: async () => {
      const groups = await getCircleEventsGroupedByDate({
        locale,
        status: 'published',
      })
      if (groups.length === 0) {
        throw new Error('no event groups returned')
      }
      // Groups must arrive sorted ascending by groupKey (chronological).
      for (let i = 1; i < groups.length; i++) {
        if (groups[i - 1].groupKey > groups[i].groupKey) {
          throw new Error(
            `group out-of-order: ${groups[i - 1].groupKey} before ${groups[i].groupKey}`
          )
        }
      }
      // The Jan 21 group must contain BOTH the LA event and the Florianópolis
      // event (different UTC instants, same event-local date in their own zones).
      const jan21 = groups.find((g) => g.groupKey === '2026-01-21')
      if (!jan21) {
        throw new Error(
          `expected a "2026-01-21" group; got [${groups.map((g) => g.groupKey).join(', ')}]`
        )
      }
      const slugsInJan21 = new Set(jan21.events.map((e) => e.slug))
      for (const required of [
        'los-angeles-circle-4',
        'florianopolis-circle-2',
      ]) {
        if (!slugsInJan21.has(required)) {
          throw new Error(`Jan 21 group missing "${required}"`)
        }
      }
      return groups
    },
  },
  {
    name: `circle events (${locale}) → formatEventDateForSurface for all 4 surfaces`,
    run: async () => {
      const events = await getCircleEvents({
        circleSlug: 'los-angeles',
        locale,
        status: 'published',
      })
      const la4 = events.find((e) => e.slug === 'los-angeles-circle-4')
      if (!la4) throw new Error('los-angeles-circle-4 not found')

      const indexGroup = formatEventDateForSurface(la4, 'index-group', locale)
      if (!/January 21\s*\/\s*Wednesday/i.test(indexGroup)) {
        throw new Error(`index-group format unexpected: "${indexGroup}"`)
      }
      const indexCardTime = formatEventDateForSurface(
        la4,
        'index-card-time',
        locale
      )
      if (!/^7:00\s*PM$/.test(indexCardTime)) {
        throw new Error(`index-card-time format unexpected: "${indexCardTime}"`)
      }
      const detailDate = formatEventDateForSurface(la4, 'detail-date', locale)
      if (!/^January 21, 2026$/.test(detailDate)) {
        throw new Error(`detail-date format unexpected: "${detailDate}"`)
      }
      const press = formatEventDateForSurface(la4, 'press', locale)
      if (!/^01\.21\.26$/.test(press)) {
        throw new Error(`press format unexpected: "${press}"`)
      }
      return { indexGroup, indexCardTime, detailDate, press }
    },
  },
  {
    name: `circle initiatives (${locale}) → at least one published + per-circle filter`,
    run: async () => {
      const all = await getCircleInitiatives({ locale, status: 'published' })
      if (all.length === 0) {
        throw new Error('no published CircleInitiatives found')
      }
      // Per-circle filter: each circleSlug should narrow the result set.
      const expectations: Record<string, string[]> = {
        'los-angeles': ['logos-powered-nextdoor-app'],
        london: ['digital-escape-egress', 'digital-id-replacement'],
      }
      for (const [circleSlug, expectedSlugs] of Object.entries(expectations)) {
        const filtered = await getCircleInitiatives({
          circleSlug,
          locale,
          status: 'published',
        })
        const got = filtered.map((i) => i.slug).sort()
        const want = [...expectedSlugs].sort()
        if (
          got.length !== want.length ||
          got.some((s, idx) => s !== want[idx])
        ) {
          throw new Error(
            `circleSlug="${circleSlug}" expected [${want.join(', ')}], got [${got.join(', ')}]`
          )
        }
        for (const initiative of filtered) {
          if (initiative.circleSlug !== circleSlug) {
            throw new Error(
              `filter leak: "${initiative.slug}" returned for circleSlug="${circleSlug}" but its circleSlug is "${initiative.circleSlug}"`
            )
          }
        }
      }
      return all
    },
  },
  {
    name: `circle initiatives (${locale}) → canonical sort (order asc, then slug)`,
    run: async () => {
      const all = await getCircleInitiatives({ locale, status: 'published' })
      for (let i = 1; i < all.length; i++) {
        const prev = all[i - 1].order ?? Number.MAX_SAFE_INTEGER
        const cur = all[i].order ?? Number.MAX_SAFE_INTEGER
        if (prev > cur) {
          throw new Error(
            `out-of-order: "${all[i - 1].slug}" (order=${prev}) before "${all[i].slug}" (order=${cur})`
          )
        }
      }
      return all
    },
  },
]

const PAGE_ROUTES: ReadonlyArray<{ route: string; minSections: number }> = [
  { route: '/', minSections: 1 },
  { route: '/builders-hub', minSections: 0 },
  { route: '/circles', minSections: 0 },
  { route: '/technology-stack', minSections: 1 },
  { route: '/technology-stack/blockchain', minSections: 1 },
]

const buildPagesChecks = (locale: Language): Check[] => [
  {
    name: `pages.home (${locale}) → loads + every section componentType valid`,
    run: async () => {
      const page = await getPageCopy('/', locale)
      if (page.sections.length === 0) {
        throw new Error('home page has zero sections')
      }
      const expected: readonly string[] = [
        'hero',
        'cardGrid',
        'richText',
        'techStackOverview',
        'gallery',
        'ctaPanel',
        'relatedArticles',
      ]
      const seen: Set<string> = new Set(
        page.sections.map((s) => s.componentType)
      )
      const missing = expected.filter((t) => !seen.has(t))
      if (missing.length > 0) {
        throw new Error(
          `home.json missing expected section types: [${missing.join(', ')}]`
        )
      }
      // Spot-check the discriminated union narrowing — pulls a typed field
      // from each variant so a regression in pageSectionSchema would surface.
      for (const section of page.sections) {
        switch (section.componentType) {
          case 'hero':
            if (!section.headline)
              throw new Error(`hero "${section.key}" missing headline`)
            break
          case 'cardGrid':
            if (section.cards.length === 0) {
              throw new Error(`cardGrid "${section.key}" has zero cards`)
            }
            break
          case 'techStackOverview':
            if (section.pillars.length !== 4) {
              throw new Error(
                `techStackOverview "${section.key}" expected 4 pillars`
              )
            }
            break
          case 'gallery':
            if (section.items.length === 0) {
              throw new Error(`gallery "${section.key}" has zero items`)
            }
            break
          case 'ctaPanel':
            // `cta` is optional (sections like the LMN intro render without one).
            // Verify the always-required `title` is set instead.
            if (!section.title)
              throw new Error(`ctaPanel "${section.key}" missing title`)
            break
          case 'relatedArticles':
            if (!section.title)
              throw new Error(`relatedArticles "${section.key}" missing title`)
            break
          case 'richText':
            if (!section.body)
              throw new Error(`richText "${section.key}" missing body`)
            break
        }
      }
      return page
    },
  },
  {
    name: `pages — every seed route loads + route-field round-trips + minSections`,
    run: async () => {
      for (const { route, minSections } of PAGE_ROUTES) {
        const page = await getPageCopy(route, locale)
        if (page.route !== route) {
          throw new Error(
            `route mismatch on "${route}": file declares "${page.route}"`
          )
        }
        if (page.sections.length < minSections) {
          throw new Error(
            `page "${route}" has ${page.sections.length} sections, expected at least ${minSections}`
          )
        }
        if (!page.title || !page.description) {
          throw new Error(`page "${route}" missing title or description`)
        }
      }
      return PAGE_ROUTES
    },
  },
  {
    name: `pages.technology-stack (${locale}) → giantSwitch present + tags icons enum-validated`,
    run: async () => {
      const page = await getPageCopy('/technology-stack', locale)
      const gs = page.sections.find((s) => s.componentType === 'giantSwitch')
      if (!gs || gs.componentType !== 'giantSwitch') {
        throw new Error('technology-stack.json missing a giantSwitch section')
      }
      if (!gs.tags || gs.tags.length === 0) {
        throw new Error(
          'giantSwitch tags missing — Logos App banner expects at least one tag'
        )
      }
      const allowed = new Set(['wallet', 'chat', 'files', 'explorer', 'lambda'])
      for (const tag of gs.tags) {
        if (tag.icon !== undefined && !allowed.has(tag.icon)) {
          throw new Error(
            `giantSwitch tag "${tag.label}" has unknown icon "${tag.icon}"`
          )
        }
      }
      return gs
    },
  },
  {
    name: `pages.technology-stack/blockchain (${locale}) → expected section types present`,
    run: async () => {
      const page = await getPageCopy('/technology-stack/blockchain', locale)
      const types = new Set(page.sections.map((s) => s.componentType))
      for (const required of [
        'hero',
        'ctaPanel',
        'cardGrid',
        'relatedArticles',
      ]) {
        if (!types.has(required as never)) {
          throw new Error(`blockchain page missing "${required}" section`)
        }
      }
      return page
    },
  },
]

const buildCustomSectionChecks = (): Check[] => {
  // Sample custom-section schema: an announcement banner with a level enum.
  // The shape is local to this test — production custom sections register
  // their own schemas at app bootstrap.
  const announcementBannerSchema = z.object({
    level: z.enum(['info', 'warning']),
    message: z.string().min(1),
    dismissible: z.boolean().default(false),
  })
  type AnnouncementBanner = z.infer<typeof announcementBannerSchema>

  const SCHEMA_ID = 'announcement-banner'

  return [
    {
      name: 'custom-sections → register / lookup / duplicate-throw / unknown-id',
      run: async () => {
        __resetCustomSectionRegistryForTests()

        // Unknown id returns undefined before registration.
        if (getCustomSectionSchema(SCHEMA_ID) !== undefined) {
          throw new Error('lookup before register should return undefined')
        }

        registerCustomSection(SCHEMA_ID, announcementBannerSchema)

        // After registration the schema is retrievable.
        if (getCustomSectionSchema(SCHEMA_ID) !== announcementBannerSchema) {
          throw new Error(
            'lookup after register did not return the registered schema'
          )
        }

        // Duplicate registration throws.
        let duplicateThrew = false
        try {
          registerCustomSection(SCHEMA_ID, announcementBannerSchema)
        } catch {
          duplicateThrew = true
        }
        if (!duplicateThrew) {
          throw new Error('duplicate registration must throw but did not')
        }

        return SCHEMA_ID
      },
    },
    {
      name: 'custom-sections → parseCustomSectionPayload returns typed payload',
      run: async () => {
        __resetCustomSectionRegistryForTests()
        registerCustomSection(SCHEMA_ID, announcementBannerSchema)

        const section = customSectionSchema.parse({
          componentType: 'custom',
          key: 'global.announcement',
          customSchemaId: SCHEMA_ID,
          payload: { level: 'info', message: 'Hello operator.' },
        })

        const parsed: AnnouncementBanner = parseCustomSectionPayload(
          section,
          announcementBannerSchema
        )
        if (parsed.level !== 'info') {
          throw new Error(`expected level=info, got ${parsed.level}`)
        }
        if (parsed.dismissible !== false) {
          throw new Error(
            'schema default for dismissible should resolve to false'
          )
        }
        return parsed
      },
    },
    {
      name: 'custom-sections → invalid payload throws via parseCustomSectionPayload',
      run: async () => {
        __resetCustomSectionRegistryForTests()
        registerCustomSection(SCHEMA_ID, announcementBannerSchema)

        const badSection = customSectionSchema.parse({
          componentType: 'custom',
          key: 'global.announcement',
          customSchemaId: SCHEMA_ID,
          payload: { level: 'critical', message: 'oops' },
        })

        let threw = false
        try {
          parseCustomSectionPayload(badSection, announcementBannerSchema)
        } catch {
          threw = true
        }
        if (!threw) {
          throw new Error('invalid payload must throw but did not')
        }
        // Reset so subsequent process exits clean (no stale state for any
        // hypothetical follow-up checks).
        __resetCustomSectionRegistryForTests()
        return null
      },
    },
  ]
}

const main = async (): Promise<void> => {
  const locales = getActiveLocales()
  const checks: Check[] = []
  for (const locale of locales) {
    checks.push(
      ...buildSiteChecks(locale),
      ...buildBuilderHubChecks(locale),
      ...buildCirclesChecks(locale),
      ...buildPagesChecks(locale)
    )
  }
  // Locale-agnostic checks (registry behaviour, schema-only).
  checks.push(...buildCustomSectionChecks())

  let failed = 0
  for (const check of checks) {
    try {
      await check.run()
      console.log(`ok    ${check.name}`)
    } catch (err) {
      failed++
      const message = err instanceof Error ? err.message : String(err)
      console.error(`FAIL  ${check.name}: ${message}`)
    }
  }

  console.log('')
  console.log(`${checks.length - failed}/${checks.length} checks passed`)
  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
