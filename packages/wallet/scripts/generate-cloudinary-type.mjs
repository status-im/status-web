import { z } from 'zod'
import fs from 'fs/promises'

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

const MAX_RESULTS = 500 // Maximum results per request
const RESOURCE_URLS = [
  'https://api.cloudinary.com/v1_1/dhgck7ebz/resources/image?context=true',
  'https://api.cloudinary.com/v1_1/dhgck7ebz/resources/video?',
  'https://api.cloudinary.com/v1_1/dhgck7ebz/resources/raw?',
]

// Fetch all resources from Cloudinary using pagination because Cloudinary has a maximum of 500 results per request
const fetchResources = async url => {
  let allResources = []
  let nextCursor

  do {
    const response = await fetch(
      `${url}&max_results=${MAX_RESULTS}${
        nextCursor ? `&next_cursor=${nextCursor}` : ''
      }`,
      {
        headers: {
          Authorization: `Basic ${btoa(
            `${env.data.CLOUDINARY_API_KEY}:${env.data.CLOUDINARY_API_SECRET}`,
          )}`,
        },
      },
    )

    const { resources, next_cursor } = await response.json()

    if (resources && resources.length > 0) {
      allResources.push(...resources)
      nextCursor = next_cursor
    } else {
      console.warn(
        'Empty or undefined response received. Consider running the script again.',
      )
      break
    }
  } while (nextCursor)

  return allResources
}

const [images, videos, zipFiles] = await Promise.all(
  RESOURCE_URLS.map(async url => fetchResources(url)),
)

fs.writeFile(
  'src/image/types.ts',
  `
export type ImageType =
  ${images
    .map(
      i =>
        `{ id: '${i.public_id}:${i.width}:${i.height}', alt: "${
          i.context?.custom?.alt ?? ''
        }" }`,
    )
    .join(' | ')}

export type ImageId = ImageType['id']

export type ImageAlt = { [K in ImageType as K['id']]: K['alt'] }

export type VideoId = ${[...videos]
    .map(v => `'${v.public_id}:${v.width}:${v.height}'`)
    .sort()
    .join(' | ')}

   export type ZipFileId = ${[...zipFiles]
     .map(z => `'${z.public_id}'`)
     .sort()
     .join(' | ')}
 `,
)
