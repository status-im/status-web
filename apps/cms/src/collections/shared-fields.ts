import type { CollectionConfig, Field } from 'payload'

type FieldWithChildren = Field & {
  fields?: Field[]
  required?: boolean
}

export const collapsibleHasRequiredField = (
  fields: readonly Field[]
): boolean =>
  fields.some((field) => {
    const candidate = field as FieldWithChildren
    if (candidate.required === true) return true
    return candidate.fields
      ? collapsibleHasRequiredField(candidate.fields)
      : false
  })

export const shouldOpenCollapsible = (fields: readonly Field[]): boolean =>
  collapsibleHasRequiredField(fields)

export const authenticatedCollectionAccess: CollectionConfig['access'] = {
  read: () => true,
  create: ({ req }) => Boolean(req.user),
  update: ({ req }) => Boolean(req.user),
  delete: ({ req }) => Boolean(req.user),
}

export const createSlugField = (description?: string): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  ...(description && {
    admin: {
      description,
    },
  }),
})

export const createPublishStatusField = (): Field => ({
  name: 'status',
  type: 'select',
  required: true,
  defaultValue: 'draft',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Review', value: 'review' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
  ],
})

export const createImageFields = (): Field[] => [
  { name: 'imageSrc', type: 'text', admin: { width: '50%' } },
  { name: 'imageAlt', type: 'text', admin: { width: '50%' } },
  { name: 'imageWidth', type: 'number', admin: { width: '50%' } },
  { name: 'imageHeight', type: 'number', admin: { width: '50%' } },
]

export const recentPrAdminComponents = {
  beforeList: [
    '@/components/admin/production-sync-panel.tsx#ProductionSyncPanel',
    '@/components/admin/recent-pr-banner.tsx#RecentCollectionPrBanner',
  ],
  edit: {
    beforeDocumentControls: [
      '@/components/admin/recent-pr-banner.tsx#RecentDocumentPrBanner',
    ],
    SaveButton:
      '@/components/admin/content-pr-save-button.tsx#ContentPrSaveButton',
  },
} satisfies NonNullable<CollectionConfig['admin']>['components']
