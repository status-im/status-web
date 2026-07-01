import type { CollectionConfig } from 'payload'

import {
  authenticatedCollectionAccess,
  createSlugField,
  recentPrAdminComponents,
} from './shared-fields'
import { createChangePullRequestHook } from './content-pr-hooks'
import {
  savePageAsPullRequest,
  type PageDocLike,
} from '../services/content-workflow'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    components: recentPrAdminComponents,
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    description:
      'Repo-backed page metadata and sections for get.status.app. Saving validates and writes content/get.status.app/pages/en/<slug>.json through a GitHub pull request (or directly to disk when CONTENT_LOCAL_WRITE=true).',
  },
  access: {
    ...authenticatedCollectionAccess,
    delete: () => false,
  },
  hooks: {
    afterChange: [
      createChangePullRequestHook<PageDocLike>({
        save: savePageAsPullRequest,
      }),
    ],
  },
  fields: [
    createSlugField('Route-derived file slug, e.g. "/" -> "home".'),
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'route',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description:
          'Internal route starting with "/". Must match page.route in the JSON payload.',
      },
    },
    {
      name: 'page',
      type: 'json',
      required: true,
      admin: {
        description: 'Must match @status-im/content pageCopySchema exactly.',
      },
    },
  ],
  versions: {
    drafts: true,
  },
}
