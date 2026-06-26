import type { CollectionConfig } from 'payload'

import {
  authenticatedCollectionAccess,
  createSlugField,
  recentPrAdminComponents,
} from './shared-fields'
import { createChangePullRequestHook } from './content-pr-hooks'
import {
  saveSiteFooterAsPullRequest,
  saveSiteNavigationAsPullRequest,
  saveSiteSettingsAsPullRequest,
  type SiteFooterDocLike,
  type SiteNavigationDocLike,
  type SiteSettingsDocLike,
} from '../services/content-workflow'

const noDeleteAccess: CollectionConfig['access'] = {
  ...authenticatedCollectionAccess,
  delete: () => false,
}

export const SiteSettingsContent: CollectionConfig = {
  slug: 'site-settings-content',
  admin: {
    components: recentPrAdminComponents,
    defaultColumns: ['slug', 'updatedAt'],
    useAsTitle: 'slug',
    description:
      'Repo-backed site settings for get.status.app. Saving validates and writes content/get.status.app/site/en/settings.json.',
  },
  access: noDeleteAccess,
  hooks: {
    afterChange: [
      createChangePullRequestHook<SiteSettingsDocLike>({
        save: saveSiteSettingsAsPullRequest,
      }),
    ],
  },
  fields: [
    createSlugField('Use "settings".'),
    {
      name: 'settings',
      type: 'json',
      required: true,
      admin: { description: 'Must match @status-im/content siteSettingsSchema.' },
    },
  ],
  timestamps: true,
}

export const SiteNavigationContent: CollectionConfig = {
  slug: 'site-navigation-content',
  admin: {
    components: recentPrAdminComponents,
    defaultColumns: ['slug', 'updatedAt'],
    useAsTitle: 'slug',
    description:
      'Repo-backed site navigation for get.status.app. Saving validates and writes content/get.status.app/site/en/navigation.json.',
  },
  access: noDeleteAccess,
  hooks: {
    afterChange: [
      createChangePullRequestHook<SiteNavigationDocLike>({
        save: saveSiteNavigationAsPullRequest,
      }),
    ],
  },
  fields: [
    createSlugField('Use "navigation".'),
    {
      name: 'navigation',
      type: 'json',
      required: true,
      admin: { description: 'Must match @status-im/content navigationSchema.' },
    },
  ],
  timestamps: true,
}

export const SiteFooterContent: CollectionConfig = {
  slug: 'site-footer-content',
  admin: {
    components: recentPrAdminComponents,
    defaultColumns: ['slug', 'updatedAt'],
    useAsTitle: 'slug',
    description:
      'Repo-backed site footer for get.status.app. Saving validates and writes content/get.status.app/site/en/footer.json.',
  },
  access: noDeleteAccess,
  hooks: {
    afterChange: [
      createChangePullRequestHook<SiteFooterDocLike>({
        save: saveSiteFooterAsPullRequest,
      }),
    ],
  },
  fields: [
    createSlugField('Use "footer".'),
    {
      name: 'footer',
      type: 'json',
      required: true,
      admin: { description: 'Must match @status-im/content footerSchema.' },
    },
  ],
  timestamps: true,
}
