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
      'builder-hub-settings',
      'builder-listing-settings',
      'builder-resources',
      'site-settings-content',
      'site-navigation-content',
      'site-footer-content',
      'circles',
      'circle-events',
      'circle-initiatives',
      'circle-resources',
      'ideas',
      'rfps',
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
      getContentWorkflowTargetPath('pages', { slug: 'about' }),
      'content/pages/en/about.json'
    )
    assert.equal(
      getContentWorkflowTargetPath('ideas', { slug: 'quadratic-voting' }),
      'content/builders-hub/ideas/quadratic-voting/index.json'
    )
    assert.equal(
      getContentWorkflowTargetPath('builder-resources', {}),
      'content/builders-hub/resources/en.json'
    )
    assert.equal(
      getContentWorkflowTargetPath('site-footer-content', {}),
      'content/site/en/footer.json'
    )
    assert.equal(
      getContentWorkflowTargetPath('builder-listing-settings', {
        page: 'rfps',
      }),
      'content/builders-hub/listings/rfps/en.json'
    )
  })
})
