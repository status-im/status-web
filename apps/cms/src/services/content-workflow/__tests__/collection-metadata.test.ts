import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  getContentWorkflowCollection,
  getContentWorkflowCollectionLabel,
  getContentWorkflowTargetPath,
} from '../collection-metadata'

describe('content workflow collection metadata', () => {
  it('covers every repo-backed admin collection that uses PR status UI', () => {
    const expected = [
      'pages',
      'site-settings-content',
      'site-navigation-content',
      'site-footer-content',
    ]

    for (const collection of expected) {
      assert.ok(
        getContentWorkflowCollection(collection),
        `${collection} should have workflow metadata`
      )
      assert.ok(
        getContentWorkflowCollectionLabel(collection),
        `${collection} should have a status label`
      )
    }
  })

  it('builds slug-derived and fixed target paths for live PR lookup', () => {
    assert.equal(
      getContentWorkflowTargetPath('pages', { slug: 'apps' }),
      'content/get.status.app/pages/en/apps.json'
    )
    assert.equal(
      getContentWorkflowTargetPath('site-settings-content', {}),
      'content/get.status.app/site/en/settings.json'
    )
    assert.equal(
      getContentWorkflowTargetPath('site-footer-content', {}),
      'content/get.status.app/site/en/footer.json'
    )
  })
})
