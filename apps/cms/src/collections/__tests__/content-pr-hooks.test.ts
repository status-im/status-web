import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { BuilderHubSettings, BuilderListingSettings } from '../BuilderHub'
import { BuilderResources } from '../BuilderResources'
import {
  CircleEvents,
  CircleInitiatives,
  CircleResources,
  Circles,
} from '../Circles'
import { Ideas } from '../Ideas'
import { Pages } from '../Pages'
import { Rfps } from '../Rfps'
import {
  SiteFooterContent,
  SiteNavigationContent,
  SiteSettingsContent,
} from '../SiteContent'

const repoBackedCollections = [
  Pages,
  BuilderHubSettings,
  BuilderListingSettings,
  BuilderResources,
  SiteSettingsContent,
  SiteNavigationContent,
  SiteFooterContent,
  Circles,
  CircleEvents,
  CircleInitiatives,
  CircleResources,
  Ideas,
  Rfps,
]

describe('repo-backed content PR hooks', () => {
  it('creates content PRs only after Payload saves successfully', () => {
    for (const collection of repoBackedCollections) {
      assert.ok(
        collection.hooks?.afterChange?.length,
        `${collection.slug} should create content PRs in afterChange`
      )
      assert.equal(
        collection.hooks?.beforeChange,
        undefined,
        `${collection.slug} should not create content PRs before persistence`
      )
    }
  })
})
