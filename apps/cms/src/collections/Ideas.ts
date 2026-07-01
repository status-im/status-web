import type { CollectionConfig } from 'payload'

import {
  authenticatedCollectionAccess,
  createPublishStatusField,
  createSlugField,
  recentPrAdminComponents,
} from './shared-fields'
import {
  createChangePullRequestHook,
  createDeletePullRequestHook,
} from './content-pr-hooks'
import {
  deleteIdeaAsPullRequest,
  saveIdeaAsPullRequest,
  type IdeaDocLike,
} from '@/services/content-workflow'

/**
 * Editor-facing collection for Builders Hub Ideas — community-submitted
 * proposals that the Logos team curates and surfaces on the home page Ideas
 * table and the `/builders-hub/ideas` listing.
 *
 * Storage and workflow follow the same model as `Rfps`: drafts live in
 * Payload's Postgres database, and saving the Admin form pushes the JSON
 * fixtures to a content PR via the workflow service. The loader picks up the
 * change once the PR merges.
 *
 * Field shape mirrors the IdeaIndex + IdeaLocale Zod schemas in
 * `@status-im/content/schemas/builders-hub.ts`. Differences from Rfp:
 *
 *  - submitter (handle is required, no leading "@") instead of owner
 *  - reward is optional
 *  - discussionUrl instead of applyUrl, and optional
 *  - submittedAt instead of publishedAt + closesAt
 *  - no `relatedIdeas` (the relationship is one-way: RFP → Ideas)
 */
export const Ideas: CollectionConfig = {
  slug: 'ideas',
  admin: {
    components: recentPrAdminComponents,
    defaultColumns: ['title', 'slug', 'status', 'featured', 'updatedAt'],
    useAsTitle: 'title',
    description:
      'Community-submitted concepts driving sovereignty forward. ' +
      'Saving creates a GitHub pull request for review.',
  },
  access: authenticatedCollectionAccess,
  hooks: {
    afterChange: [
      createChangePullRequestHook<IdeaDocLike>({
        save: saveIdeaAsPullRequest,
      }),
    ],
    beforeDelete: [
      createDeletePullRequestHook<IdeaDocLike>({
        collection: 'ideas',
        save: deleteIdeaAsPullRequest,
      }),
    ],
  },
  fields: [
    createSlugField(
      'URL-safe identifier — kebab-case, ASCII only. Used as the directory name in `content/builders-hub/ideas/<slug>/`.'
    ),
    createPublishStatusField(),

    // ----- Locale-level (English) -----
    {
      type: 'collapsible',
      label: 'Copy (English)',
      admin: { initCollapsed: false },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'tagline',
          type: 'text',
          maxLength: 120,
          admin: {
            description:
              'One-line pitch (~80 chars) shown on the home Ideas table and listing rows.',
          },
        },
        { name: 'summary', type: 'textarea', required: true },
        { name: 'description', type: 'textarea', required: true },
        {
          name: 'ctaLabel',
          type: 'text',
          admin: {
            description: 'Per-row CTA text. Defaults to "Discuss" when empty.',
          },
        },
      ],
    },

    // ----- Submitter -----
    {
      type: 'collapsible',
      label: 'Submitter',
      admin: { initCollapsed: false },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'submitterName',
              type: 'text',
              admin: { width: '50%', description: 'Display name (optional).' },
            },
            {
              name: 'submitterHandle',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
                description:
                  'Stored without the leading "@". Validation rejects "@" prefixes.',
              },
              validate: (value: unknown): true | string => {
                if (typeof value !== 'string' || value.length === 0) {
                  return 'Handle is required.'
                }
                if (value.startsWith('@')) {
                  return 'Handle must be stored without the leading "@".'
                }
                return true
              },
            },
          ],
        },
      ],
    },

    // ----- Reward (optional) -----
    {
      type: 'collapsible',
      label: 'Reward (optional)',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'rewardAmount',
              type: 'number',
              min: 0,
              admin: { width: '40%', description: 'Leave empty if no reward.' },
            },
            {
              name: 'rewardCurrency',
              type: 'select',
              defaultValue: 'USDC',
              options: [{ label: 'USDC', value: 'USDC' }],
              admin: { width: '30%' },
            },
            {
              name: 'rewardXp',
              type: 'number',
              min: 0,
              admin: { width: '30%' },
            },
          ],
        },
      ],
    },

    // ----- Index-level metadata -----
    {
      type: 'collapsible',
      label: 'Metadata',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'discussionUrl',
          type: 'text',
          admin: {
            description:
              'Forum thread for the idea (optional). External https URL.',
          },
        },
        {
          name: 'tags',
          type: 'text',
          hasMany: true,
        },
        { name: 'featured', type: 'checkbox', defaultValue: false },
        {
          name: 'order',
          type: 'number',
          min: 0,
          admin: {
            description: 'Sort key (ascending).',
          },
        },
        { name: 'submittedAt', type: 'date' },
      ],
    },
  ],
  timestamps: true,
}
