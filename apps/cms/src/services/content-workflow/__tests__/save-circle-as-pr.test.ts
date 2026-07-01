import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  buildCircleFixtureChanges,
  type CircleDocLike,
} from '../save-circle-as-pr'

const createCircleDoc = (
  overrides: Partial<CircleDocLike> = {}
): CircleDocLike => ({
  slug: 'los-angeles',
  status: 'published',
  name: 'Los Angeles',
  description: 'A local circle.',
  city: 'Los Angeles',
  country: 'United States',
  lat: 34.0522,
  lng: -118.2437,
  timezone: 'America/Los_Angeles',
  joinUrl: 'https://luma.com/fvtjixui',
  imageSrc: '/cms/circles/los-angeles/cover.webp',
  ...overrides,
})

describe('buildCircleFixtureChanges', () => {
  it('keeps an explicit empty image alt string for decorative images', () => {
    const { indexChange } = buildCircleFixtureChanges(
      createCircleDoc({ imageAlt: undefined })
    )

    assert.ok('content' in indexChange)
    const indexJson = JSON.parse(String(indexChange.content)) as {
      image?: { alt?: string }
    }
    assert.equal(indexJson.image?.alt, '')
  })
})
