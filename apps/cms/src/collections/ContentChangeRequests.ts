import type { CollectionConfig } from 'payload'

/**
 * Tracks every CMS-driven content edit while it is in flight as a GitHub
 * pull request. Plan §6 "PR metadata model".
 *
 * One row per content branch. The CMS workflow service writes here when it
 * creates a branch, updates the row when the PR opens / merges / closes, and
 * reads from here for the editor lock check ("is anyone else editing this
 * record right now?").
 *
 * Source of truth for the actual diff is GitHub; this collection only
 * mirrors the metadata so the Admin UI can show pull-request state without
 * round-tripping the REST API on every form load.
 */
export const ContentChangeRequests: CollectionConfig = {
  slug: 'content-change-requests',
  admin: {
    defaultColumns: [
      'contentType',
      'targetPath',
      'branchName',
      'status',
      'updatedAt',
    ],
    useAsTitle: 'branchName',
    description:
      'Mirror of in-flight content PRs. Rows are created by the CMS workflow ' +
      'service — do not edit by hand unless you know what you are doing.',
  },
  // Editors should not be able to mutate these arbitrarily — only the
  // workflow service. For now leave open for development; tighten in a later
  // phase once roles are wired.
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'contentType',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description:
          'Logical content type — e.g. "pages", "rfp", "circle-event". Matches the loader namespace.',
      },
    },
    {
      name: 'targetPath',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description:
          'Repo-relative path the PR touches (e.g. "content/pages/en/home.json"). Indexed for lock queries.',
      },
    },
    {
      name: 'branchName',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'GitHub branch name. One row per branch.',
      },
    },
    {
      name: 'pullRequestNumber',
      type: 'number',
      admin: {
        description: 'GitHub PR number once opened.',
      },
    },
    {
      name: 'pullRequestUrl',
      type: 'text',
      admin: {
        description: 'Public GitHub PR URL once opened.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft (branch only, no PR yet)', value: 'draft' },
        { label: 'Open (PR awaiting review)', value: 'open' },
        { label: 'Merged', value: 'merged' },
        { label: 'Closed (without merge)', value: 'closed' },
      ],
      index: true,
    },
    {
      name: 'commitSha',
      type: 'text',
      admin: {
        description:
          'Latest commit SHA on the branch — useful for cache invalidation.',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Payload user who triggered this change request.',
      },
    },
  ],
  timestamps: true,
}
