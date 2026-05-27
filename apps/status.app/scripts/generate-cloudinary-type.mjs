import { z } from 'zod'

import {
  fetchResources,
  generateTypesContent,
  getResourceUrls,
  writeTypesFile,
} from './cloudinary-shared.mjs'

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
  getResourceUrls().map(url => fetchResources(url, credentials)),
)

await writeTypesFile(
  'src/app/_components/assets/types.ts',
  generateTypesContent({ images, videos, zipFiles }),
)
