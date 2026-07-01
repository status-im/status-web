import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  buildBuilderHubSettingsFileChange,
  type BuilderHubSettingsDocLike,
} from '../save-builder-hub-settings-as-pr'
import {
  buildBuilderListingSettingsFileChange,
  type BuilderListingSettingsDocLike,
} from '../save-builder-listing-settings-as-pr'

const createListingDoc = (
  overrides: Partial<BuilderListingSettingsDocLike> = {}
): BuilderListingSettingsDocLike => ({
  page: 'rfps',
  title: 'RFPs',
  description: 'Funded work.',
  breadcrumbLabel: 'RFPs',
  submitCtaLabel: 'Submit',
  submitCtaHref: 'https://discord.gg/logosnetwork',
  submitCtaExternal: true,
  defaultView: 'grid',
  pageSize: 12,
  previousLabel: 'Previous',
  nextLabel: 'Next',
  bottomCtaTitle: 'Have a build idea?',
  bottomCtaLabel: 'Submit',
  bottomCtaHref: 'https://discord.gg/logosnetwork',
  bottomCtaExternal: true,
  ...overrides,
})

describe('Builders Hub settings fixture builders', () => {
  it('writes listing settings to the selected listing file', () => {
    const change = buildBuilderListingSettingsFileChange(
      createListingDoc({ page: 'ideas', title: 'Ideas' })
    )

    assert.equal(change.path, 'content/builders-hub/listings/ideas/en.json')
    assert.ok('content' in change)
  })

  it('validates and writes the raw Builders Hub settings file', () => {
    const doc: BuilderHubSettingsDocLike = {
      slug: 'builders-hub',
      settings: {
        schemaVersion: 1,
        language: 'en',
        hero: { title: 'Builders Hub' },
        rfpsSection: {
          title: 'RFPs',
          seeAllCta: { label: 'See all', href: '/builders-hub/rfps' },
        },
        ideasSection: {
          title: 'Ideas',
          seeAllCta: { label: 'See all', href: '/builders-hub/ideas' },
        },
        appInstall: {
          accent: 'grey',
          imagePosition: 'left',
          title: 'Install Basecamp',
          description: 'Install the Logos builder app.',
          tags: [],
          installCta: { label: 'Install', href: '/builders-hub#app-install' },
          learnMoreCta: { label: 'Learn more', href: '/technology-stack' },
          image: {
            src: '/cms/builders-hub/settings/app-install.webp',
            alt: '',
          },
        },
        resourcesSection: { title: 'Resources' },
      },
    }

    const change = buildBuilderHubSettingsFileChange(doc)

    assert.equal(change.path, 'content/builders-hub/settings/en.json')
  })
})
