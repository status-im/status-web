import { z } from 'zod'

import {
  fetchResources,
  filterByPrefixes,
  generateTypesContent,
  getResourceUrls,
  writeTypesFile,
} from '../../status.app/scripts/cloudinary-shared.mjs'

import { GET_STATUS_APP_CLOUDINARY_PREFIXES } from './cloudinary-prefixes.mjs'

const env = z
  .object({
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
  })
  .safeParse(process.env)

if (!env.success) {
  console.error('🚨 CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are required')
  process.exit(1)
}

const credentials = {
  apiKey: env.data.CLOUDINARY_API_KEY,
  apiSecret: env.data.CLOUDINARY_API_SECRET,
}

const [images, videos, zipFiles] = await Promise.all(
  getResourceUrls().map(async url => {
    const resources = await fetchResources(url, credentials)
    return filterByPrefixes(resources, GET_STATUS_APP_CLOUDINARY_PREFIXES)
  }),
)

await writeTypesFile(
  'src/app/_components/assets/types.ts',
  generateTypesContent({ images, videos, zipFiles }),
)

console.log(
  `Synced ${images.length} images, ${videos.length} videos, ${zipFiles.length} raw files for get.status.app`,
)
