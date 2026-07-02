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

const CONTENT_PREFIX = 'content/get.status.app'

const CONTENT_WORKFLOW_COLLECTIONS = {
  pages: {
    contentTypes: ['page'],
    label: 'Page',
    targetPath: slugPath(`${CONTENT_PREFIX}/pages/en`, '.json'),
  },
  'site-settings-content': {
    contentTypes: ['site-settings'],
    label: 'Site settings',
    targetPath: fixedPath(`${CONTENT_PREFIX}/site/en/settings.json`),
  },
  'site-navigation-content': {
    contentTypes: ['site-navigation'],
    label: 'Site navigation',
    targetPath: fixedPath(`${CONTENT_PREFIX}/site/en/navigation.json`),
  },
  'site-footer-content': {
    contentTypes: ['site-footer'],
    label: 'Site footer',
    targetPath: fixedPath(`${CONTENT_PREFIX}/site/en/footer.json`),
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
