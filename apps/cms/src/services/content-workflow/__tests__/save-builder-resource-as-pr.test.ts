import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  buildBuilderResourcesFileChange,
  type BuilderResourceDocLike,
} from '../save-builder-resource-as-pr'

const createResourceDoc = (
  overrides: Partial<BuilderResourceDocLike> = {}
): BuilderResourceDocLike => ({
  slug: 'quick-start',
  status: 'published',
  title: 'Quick Start',
  description: 'Spin up a Logos-powered app in under five minutes.',
  ctaLabel: 'Read',
  href: '/technology-stack',
  ...overrides,
})

describe('buildBuilderResourcesFileChange', () => {
  it('writes the Builders Hub resources flat file in repo shape', async () => {
    const payload = {
      find: async () => ({
        docs: [
          createResourceDoc(),
          createResourceDoc({
            slug: 'video-tutorials',
            title: 'Video Tutorials',
            ctaLabel: 'Watch',
            href: 'https://youtube.com/@logos_network',
          }),
        ],
      }),
    } as unknown as Parameters<
      typeof buildBuilderResourcesFileChange
    >[0]['payload']

    const change = await buildBuilderResourcesFileChange({
      doc: createResourceDoc(),
      payload,
      mutation: 'upsert',
    })

    assert.equal(change.path, 'content/builders-hub/resources/en.json')
    assert.ok('content' in change)
    const json = JSON.parse(String(change.content)) as {
      items: Array<{ slug: string; href: string }>
    }
    assert.deepEqual(
      json.items.map((item) => item.slug),
      ['quick-start', 'video-tutorials']
    )
    assert.equal(json.items[0]?.href, '/technology-stack')
  })
})
