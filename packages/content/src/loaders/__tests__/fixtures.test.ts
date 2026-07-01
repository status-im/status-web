import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { before, describe, it } from 'node:test'

import {
  getAllIdeas,
  getAllPageCopy,
  getAllRfps,
  getBuilderHubListingSettings,
  getBuilderHubSettings,
  getBuilderResources,
  getCircleEvents,
  getCircleInitiatives,
  getCircleResources,
  getCircles,
  getCirclesSettings,
  getFooter,
  getNavigationContent,
  getPageCopy,
  getSiteSettings,
  resolveBuilderHubHomeIdeas,
  resolveBuilderHubHomeRfps,
} from '../index'
import { setContentRoot } from '../_fs'

const activeLocale = 'en'

before(() => {
  setContentRoot(resolve(process.cwd(), '../../content'))
})

describe('content fixture loaders', () => {
  it('loads every page fixture by declared route', async () => {
    const records = await getAllPageCopy(activeLocale)

    assert.ok(records.length > 0)
    const routes = new Set<string>()
    for (const { page, slug } of records) {
      assert.equal(
        routes.has(page.route),
        false,
        `duplicate route ${page.route}`
      )
      routes.add(page.route)

      const loaded = await getPageCopy(page.route, activeLocale)
      assert.equal(loaded.route, page.route)
      assert.equal(
        slug,
        page.route === '/' ? 'home' : page.route.slice(1).replace(/\//g, '-')
      )
    }
  })

  it('loads site chrome fixtures without fallback content', async () => {
    const [settings, footer, navigation] = await Promise.all([
      getSiteSettings(activeLocale),
      getFooter(activeLocale),
      getNavigationContent(activeLocale),
    ])

    assert.ok(settings.siteTitle)
    assert.ok(footer.mainLinks.length > 0)
    assert.ok(navigation.sitemap.length > 0)
  })

  it('loads Builders Hub fixtures and keeps RFP to Idea references valid', async () => {
    const [settings, resources, listingIdeas, listingRfps, ideas, rfps] =
      await Promise.all([
        getBuilderHubSettings(activeLocale),
        getBuilderResources({ locale: activeLocale }),
        getBuilderHubListingSettings({ page: 'ideas', locale: activeLocale }),
        getBuilderHubListingSettings({ page: 'rfps', locale: activeLocale }),
        getAllIdeas({ locale: activeLocale }),
        getAllRfps({ locale: activeLocale }),
      ])

    assert.ok(settings.hero.title)
    assert.ok(resources.length > 0)
    assert.ok(listingIdeas.title)
    assert.ok(listingRfps.title)
    assert.ok(ideas.length > 0)
    assert.ok(rfps.length > 0)

    const ideaSlugs = new Set(ideas.map((idea) => idea.slug))
    for (const rfp of rfps) {
      for (const ideaSlug of rfp.relatedIdeas ?? []) {
        assert.equal(
          ideaSlugs.has(ideaSlug),
          true,
          `RFP "${rfp.slug}" references missing Idea "${ideaSlug}"`
        )
      }
    }
  })

  it('resolves Builders Hub home sections from pinned and fallback records', async () => {
    const [rfpResolution, ideaResolution] = await Promise.all([
      resolveBuilderHubHomeRfps(activeLocale),
      resolveBuilderHubHomeIdeas(activeLocale),
    ])

    assert.ok(rfpResolution.rfps.length > 0)
    assert.ok(rfpResolution.terminator)
    assert.ok(ideaResolution.ideas.length > 0)
  })

  it('loads Circles fixtures and keeps child records attached to existing circles', async () => {
    const [settings, resources, circles, events, initiatives] =
      await Promise.all([
        getCirclesSettings(activeLocale),
        getCircleResources({ locale: activeLocale }),
        getCircles({ locale: activeLocale }),
        getCircleEvents({ locale: activeLocale }),
        getCircleInitiatives({ locale: activeLocale }),
      ])

    assert.ok(settings.hero.title)
    assert.ok(resources.length > 0)
    assert.ok(circles.length > 0)

    const circleSlugs = new Set(circles.map((circle) => circle.slug))
    for (const circle of circles) {
      assert.equal(circle.coordinatesGeoJson[0], circle.coordinates.lng)
      assert.equal(circle.coordinatesGeoJson[1], circle.coordinates.lat)
      assert.ok(circle.detailBackLink.href)
    }
    for (const event of events) {
      assert.equal(
        circleSlugs.has(event.circleSlug),
        true,
        `event "${event.slug}" references missing circle "${event.circleSlug}"`
      )
    }
    for (const initiative of initiatives) {
      assert.equal(
        circleSlugs.has(initiative.circleSlug),
        true,
        `initiative "${initiative.slug}" references missing circle "${initiative.circleSlug}"`
      )
    }
  })

  it('rejects inactive locales instead of silently falling back', async () => {
    await assert.rejects(getAllPageCopy('fr'), /locale "fr" is not active/)
  })
})
