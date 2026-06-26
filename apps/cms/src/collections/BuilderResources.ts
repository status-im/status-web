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
  deleteBuilderResourceAsPullRequest,
  saveBuilderResourceAsPullRequest,
  type BuilderResourceDocLike,
} from '@/services/content-workflow'

export const BuilderResources: CollectionConfig = {
  slug: 'builder-resources',
  admin: {
    components: recentPrAdminComponents,
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    useAsTitle: 'title',
    description:
      'Resources shown on Builders Hub. Shape mirrors content/builders-hub/resources.',
  },
  access: authenticatedCollectionAccess,
  hooks: {
    afterChange: [
      createChangePullRequestHook<BuilderResourceDocLike>({
        save: saveBuilderResourceAsPullRequest,
      }),
    ],
    beforeDelete: [
      createDeletePullRequestHook<BuilderResourceDocLike>({
        collection: 'builder-resources',
        save: deleteBuilderResourceAsPullRequest,
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
