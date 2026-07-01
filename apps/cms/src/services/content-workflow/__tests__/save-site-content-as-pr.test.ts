import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  buildSiteFooterFileChange,
  buildSiteNavigationFileChange,
  buildSiteSettingsFileChange,
} from '../save-site-content-as-pr'

describe('site content fixture builders', () => {
  it('writes site settings to the repo-backed settings file', () => {
    const change = buildSiteSettingsFileChange({
      slug: 'settings',
      settings: {
        schemaVersion: 1,
        language: 'en',
        siteName: 'Logos',
        siteTitle: 'Logos',
        siteDescription: 'A movement.',
        canonicalUrl: 'https://logos.co',
        keywords: ['logos'],
        social: {},
      },
    })

    assert.equal(change.path, 'content/site/en/settings.json')
  })

  it('writes site navigation to the repo-backed navigation file', () => {
    const change = buildSiteNavigationFileChange({
      slug: 'navigation',
      navigation: {
        schemaVersion: 1,
        language: 'en',
        closedBar: {
          brandLabel: 'LOGOS',
          menuLabel: 'MENU',
          closeLabel: 'CLOSE',
          openAriaLabel: 'Open navigation menu',
          closeAriaLabel: 'Close navigation menu',
        },
        sitemap: [{ label: 'Home', href: '/' }],
        communityCards: [],
        blog: {
          label: 'Blog',
          seeAllLabel: 'SEE ALL',
          seeAllHref: '/blog',
        },
      },
    })

    assert.equal(change.path, 'content/site/en/navigation.json')
  })
})
