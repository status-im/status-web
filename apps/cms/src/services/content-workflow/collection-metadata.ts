type TargetPathInput = {
  page?: string | null
  slug?: string | null
}

type TargetPathBuilder = (input: TargetPathInput) => string | null

interface ContentWorkflowCollection {
  contentTypes: readonly string[]
  label: string
  targetPath: TargetPathBuilder
}

const slugPath =
  (prefix: string, suffix = '/index.json'): TargetPathBuilder =>
  ({ slug }) =>
    slug ? `${prefix}/${slug}${suffix}` : null

const fixedPath =
  (path: string): TargetPathBuilder =>
  () =>
    path

const CONTENT_WORKFLOW_COLLECTIONS = {
  pages: {
    contentTypes: ['page'],
    label: 'Page',
    targetPath: slugPath('content/pages/en', '.json'),
  },
  'builder-hub-settings': {
    contentTypes: ['builder-hub-settings'],
    label: 'Builders Hub settings',
    targetPath: fixedPath('content/builders-hub/settings/en.json'),
  },
  'builder-listing-settings': {
    contentTypes: ['builder-listing'],
    label: 'Builders Hub listing settings',
    targetPath: ({ page }) =>
      page ? `content/builders-hub/listings/${page}/en.json` : null,
  },
  'builder-resources': {
    contentTypes: ['builder-resource'],
    label: 'Builder resource',
    targetPath: fixedPath('content/builders-hub/resources/en.json'),
  },
  'site-settings-content': {
    contentTypes: ['site-settings'],
    label: 'Site settings',
    targetPath: fixedPath('content/site/en/settings.json'),
  },
  'site-navigation-content': {
    contentTypes: ['site-navigation'],
    label: 'Site navigation',
    targetPath: fixedPath('content/site/en/navigation.json'),
  },
  'site-footer-content': {
    contentTypes: ['site-footer'],
    label: 'Site footer',
    targetPath: fixedPath('content/site/en/footer.json'),
  },
  circles: {
    contentTypes: ['circle'],
    label: 'Circle',
    targetPath: slugPath('content/circles/circles'),
  },
  'circle-events': {
    contentTypes: ['circle-event'],
    label: 'Circle event',
    targetPath: slugPath('content/circles/events'),
  },
  'circle-initiatives': {
    contentTypes: ['circle-initiative'],
    label: 'Circle initiative',
    targetPath: slugPath('content/circles/initiatives'),
  },
  'circle-resources': {
    contentTypes: ['circle-resource'],
    label: 'Circle resource',
    targetPath: fixedPath('content/circles/resources/en.json'),
  },
  ideas: {
    contentTypes: ['idea'],
    label: 'Idea',
    targetPath: slugPath('content/builders-hub/ideas'),
  },
  rfps: {
    contentTypes: ['rfp'],
    label: 'RFP',
    targetPath: slugPath('content/builders-hub/rfps'),
  },
} as const satisfies Record<string, ContentWorkflowCollection>

export type ContentWorkflowCollectionSlug =
  keyof typeof CONTENT_WORKFLOW_COLLECTIONS

export const getContentWorkflowCollection = (
  collection: string
): ContentWorkflowCollection | null =>
  Object.hasOwn(CONTENT_WORKFLOW_COLLECTIONS, collection)
    ? CONTENT_WORKFLOW_COLLECTIONS[collection as ContentWorkflowCollectionSlug]
    : null

export const getContentWorkflowCollectionLabel = (
  collection: string
): string | null => getContentWorkflowCollection(collection)?.label ?? null

export const getContentWorkflowTargetPath = (
  collection: string,
  input: TargetPathInput
): string | null =>
  getContentWorkflowCollection(collection)?.targetPath(input) ?? null
