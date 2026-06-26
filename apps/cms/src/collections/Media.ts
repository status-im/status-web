import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { authenticatedCollectionAccess } from './shared-fields'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const mediaStaticDir = path.resolve(
  dirname,
  '../../../get.status.app/public/cms/uploads'
)

const populatePublicPath: CollectionBeforeChangeHook = ({ data }) => {
  if (
    typeof data?.publicPath === 'string' &&
    data.publicPath.trim().length > 0
  ) {
    return data
  }
  if (typeof data?.filename !== 'string' || data.filename.length === 0) {
    return data
  }
  return {
    ...data,
    publicPath: `/cms/uploads/${data.filename}`,
  }
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    useAsTitle: 'filename',
    description:
      'Uploaded media stored in apps/get.status.app/public/cms/uploads so get.status.app content JSON can reference repo-owned public assets.',
  },
  access: authenticatedCollectionAccess,
  upload: {
    staticDir: mediaStaticDir,
    mimeTypes: ['image/*'],
  },
  hooks: {
    beforeChange: [populatePublicPath],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Use an empty string only for decorative images. Content images need descriptive alt text.',
      },
    },
    {
      name: 'publicPath',
      type: 'text',
      admin: {
        description:
          'Public path to copy into imageSrc fields, e.g. /cms/uploads/example.webp.',
      },
    },
  ],
  timestamps: true,
}
