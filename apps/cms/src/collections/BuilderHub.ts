import type { CollectionConfig } from 'payload'

import {
  authenticatedCollectionAccess,
  createSlugField,
  recentPrAdminComponents,
} from './shared-fields'
import { createChangePullRequestHook } from './content-pr-hooks'
import {
  saveBuilderHubSettingsAsPullRequest,
  saveBuilderListingSettingsAsPullRequest,
  type BuilderHubSettingsDocLike,
  type BuilderListingSettingsDocLike,
} from '@/services/content-workflow'

const noDeleteAccess: CollectionConfig['access'] = {
  ...authenticatedCollectionAccess,
  delete: () => false,
}

export const BuilderHubSettings: CollectionConfig = {
  slug: 'builder-hub-settings',
  admin: {
    components: recentPrAdminComponents,
    defaultColumns: ['slug', 'updatedAt'],
    useAsTitle: 'slug',
    description:
      'Raw Builders Hub page settings. Saving validates and writes content/builders-hub/settings/en.json through a GitHub pull request.',
  },
  access: noDeleteAccess,
  hooks: {
    afterChange: [
      createChangePullRequestHook<BuilderHubSettingsDocLike>({
        save: saveBuilderHubSettingsAsPullRequest,
      }),
    ],
  },
  fields: [
    createSlugField('Use "builders-hub".'),
    {
      name: 'settings',
      type: 'json',
      required: true,
      admin: {
        description:
          'Must match @status-im/content builderHubSettingsSchema exactly.',
      },
    },
  ],
  timestamps: true,
}

export const BuilderListingSettings: CollectionConfig = {
  slug: 'builder-listing-settings',
  admin: {
    components: recentPrAdminComponents,
    defaultColumns: ['page', 'title', 'updatedAt'],
    useAsTitle: 'title',
    description:
      'Settings for /builders-hub/ideas and /builders-hub/rfps listing pages. Saving writes the matching content/builders-hub/listings file through a GitHub pull request.',
  },
  access: noDeleteAccess,
  hooks: {
    afterChange: [
      createChangePullRequestHook<BuilderListingSettingsDocLike>({
        save: saveBuilderListingSettingsAsPullRequest,
      }),
    ],
  },
  fields: [
    {
      name: 'page',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'Ideas', value: 'ideas' },
        { label: 'RFPs', value: 'rfps' },
      ],
    },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'breadcrumbLabel', type: 'text', required: true },
    {
      type: 'collapsible',
      label: 'Submit CTA',
      admin: { initCollapsed: false },
      fields: [
        { name: 'submitCtaLabel', type: 'text', required: true },
        { name: 'submitCtaHref', type: 'text', required: true },
        { name: 'submitCtaExternal', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'defaultView',
          type: 'select',
          required: true,
          defaultValue: 'grid',
          options: [
            { label: 'Grid', value: 'grid' },
            { label: 'List', value: 'list' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'pageSize',
          type: 'number',
          required: true,
          min: 1,
          max: 50,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Pagination',
      admin: { initCollapsed: true },
      fields: [
        { name: 'previousLabel', type: 'text', required: true },
        { name: 'nextLabel', type: 'text', required: true },
      ],
    },
    {
      type: 'collapsible',
      label: 'Bottom CTA',
      admin: { initCollapsed: true },
      fields: [
        { name: 'bottomCtaTitle', type: 'text', required: true },
        { name: 'bottomCtaLabel', type: 'text', required: true },
        { name: 'bottomCtaHref', type: 'text', required: true },
        { name: 'bottomCtaExternal', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
  timestamps: true,
}
