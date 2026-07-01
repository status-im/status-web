import type { CollectionConfig, Field } from 'payload'

import {
  authenticatedCollectionAccess,
  createImageFields,
  createPublishStatusField,
  createSlugField,
  recentPrAdminComponents,
  shouldOpenCollapsible,
} from './shared-fields'
import {
  createChangePullRequestHook,
  createDeletePullRequestHook,
} from './content-pr-hooks'
import { isValidIanaTimeZone } from '@/lib/timezones'
import {
  deleteCircleEventAsPullRequest,
  deleteCircleInitiativeAsPullRequest,
  deleteCircleResourceAsPullRequest,
  deleteCircleAsPullRequest,
  saveCircleEventAsPullRequest,
  saveCircleInitiativeAsPullRequest,
  saveCircleResourceAsPullRequest,
  saveCircleAsPullRequest,
  type CircleDocLike,
  type CircleEventDocLike,
  type CircleInitiativeDocLike,
  type CircleResourceDocLike,
} from '@/services/content-workflow'

const createTimeZoneField = (width: string): Field => ({
  name: 'timezone',
  type: 'text',
  required: true,
  admin: {
    components: {
      Field: '@/components/admin/timezone-field.tsx#TimezoneField',
    },
    width,
  },
  validate: (value) => {
    if (typeof value !== 'string' || value.length === 0) {
      return 'A timezone is required.'
    }

    return (
      isValidIanaTimeZone(value) ||
      'Must be a valid IANA timezone, e.g. "America/Los_Angeles".'
    )
  },
})

const circleCommunityFields: Field[] = [
  { name: 'memberCount', type: 'number', min: 0 },
  { name: 'discordChannel', type: 'text' },
  { name: 'discordUrl', type: 'text' },
  { name: 'forumUrl', type: 'text' },
  { name: 'joinUrl', type: 'text', required: true },
  {
    name: 'organizers',
    type: 'array',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'handle', type: 'text' },
    ],
  },
]

const circleImageFields = createImageFields()

export const Circles: CollectionConfig = {
  slug: 'circles',
  admin: {
    components: recentPrAdminComponents,
    defaultColumns: ['name', 'slug', 'city', 'status', 'updatedAt'],
    useAsTitle: 'name',
    description:
      'Local Logos chapters. Shape mirrors content/circles/circles fixtures.',
  },
  access: authenticatedCollectionAccess,
  hooks: {
    afterChange: [
      createChangePullRequestHook<CircleDocLike>({
        save: saveCircleAsPullRequest,
      }),
    ],
    beforeDelete: [
      createDeletePullRequestHook<CircleDocLike>({
        collection: 'circles',
        save: deleteCircleAsPullRequest,
      }),
    ],
  },
  fields: [
    createSlugField(),
    createPublishStatusField(),
    {
      type: 'collapsible',
      label: 'Copy (English)',
      admin: { initCollapsed: false },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      type: 'collapsible',
      label: 'Location',
      admin: { initCollapsed: false },
      fields: [
        { name: 'city', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
        { name: 'region', type: 'text' },
        {
          type: 'row',
          fields: [
            {
              name: 'lat',
              type: 'number',
              required: true,
              admin: { width: '33%' },
            },
            {
              name: 'lng',
              type: 'number',
              required: true,
              admin: { width: '33%' },
            },
            {
              ...createTimeZoneField('34%'),
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Community',
      admin: { initCollapsed: !shouldOpenCollapsible(circleCommunityFields) },
      fields: circleCommunityFields,
    },
    {
      type: 'collapsible',
      label: 'Image',
      admin: { initCollapsed: false },
      fields: circleImageFields,
    },
    { name: 'order', type: 'number', min: 0 },
  ],
  timestamps: true,
}

export const CircleEvents: CollectionConfig = {
  slug: 'circle-events',
  admin: {
    components: recentPrAdminComponents,
    defaultColumns: ['title', 'slug', 'circleSlug', 'status', 'startsAt'],
    useAsTitle: 'title',
    description:
      'Circle gatherings. Shape mirrors content/circles/events fixtures.',
  },
  access: authenticatedCollectionAccess,
  hooks: {
    afterChange: [
      createChangePullRequestHook<CircleEventDocLike>({
        save: saveCircleEventAsPullRequest,
      }),
    ],
    beforeDelete: [
      createDeletePullRequestHook<CircleEventDocLike>({
        collection: 'circle-events',
        save: deleteCircleEventAsPullRequest,
      }),
    ],
  },
  fields: [
    createSlugField(),
    createPublishStatusField(),
    { name: 'circleSlug', type: 'text', required: true, index: true },
    {
      type: 'collapsible',
      label: 'Copy (English)',
      admin: { initCollapsed: false },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'locationLabel', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startsAt',
          type: 'date',
          required: true,
          admin: { width: '33%' },
        },
        { name: 'endsAt', type: 'date', admin: { width: '33%' } },
        {
          ...createTimeZoneField('34%'),
        },
      ],
    },
    { name: 'venueName', type: 'text' },
    { name: 'address', type: 'text' },
    { name: 'eventUrl', type: 'text' },
    {
      name: 'hostedBy',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'sequenceNumber', type: 'number', min: 1 },
    {
      type: 'collapsible',
      label: 'Image',
      admin: { initCollapsed: true },
      fields: createImageFields(),
    },
  ],
  timestamps: true,
}

export const CircleInitiatives: CollectionConfig = {
  slug: 'circle-initiatives',
  admin: {
    components: recentPrAdminComponents,
    defaultColumns: ['title', 'slug', 'circleSlug', 'status', 'updatedAt'],
    useAsTitle: 'title',
    description:
      'Winnable local issues. Shape mirrors content/circles/initiatives fixtures.',
  },
  access: authenticatedCollectionAccess,
  hooks: {
    afterChange: [
      createChangePullRequestHook<CircleInitiativeDocLike>({
        save: saveCircleInitiativeAsPullRequest,
      }),
    ],
    beforeDelete: [
      createDeletePullRequestHook<CircleInitiativeDocLike>({
        collection: 'circle-initiatives',
        save: deleteCircleInitiativeAsPullRequest,
      }),
    ],
  },
  fields: [
    createSlugField(),
    createPublishStatusField(),
    { name: 'circleSlug', type: 'text', required: true, index: true },
    { name: 'href', type: 'text', required: true },
    {
      type: 'collapsible',
      label: 'Copy (English)',
      admin: { initCollapsed: false },
      fields: [
        { name: 'locationLabel', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'ctaLabel', type: 'text', required: true },
      ],
    },
    {
      type: 'collapsible',
      label: 'Image',
      admin: { initCollapsed: true },
      fields: createImageFields(),
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'order', type: 'number', min: 0 },
  ],
  timestamps: true,
}

export const CircleResources: CollectionConfig = {
  slug: 'circle-resources',
  admin: {
    components: recentPrAdminComponents,
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    useAsTitle: 'title',
    description:
      'Resources shown on the Circles page. Shape mirrors content/circles/resources.',
  },
  access: authenticatedCollectionAccess,
  hooks: {
    afterChange: [
      createChangePullRequestHook<CircleResourceDocLike>({
        save: saveCircleResourceAsPullRequest,
      }),
    ],
    beforeDelete: [
      createDeletePullRequestHook<CircleResourceDocLike>({
        collection: 'circle-resources',
        save: deleteCircleResourceAsPullRequest,
      }),
    ],
  },
  fields: [
    createSlugField(),
    createPublishStatusField(),
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'ctaLabel', type: 'text', required: true },
    { name: 'href', type: 'text', required: true },
  ],
  timestamps: true,
}
