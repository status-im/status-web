import fs from 'fs/promises'

/** Shared Cloudinary account for status.app and get.status.app */
export const CLOUDINARY_CLOUD_NAME = 'dhgck7ebz'

export const getResourceUrls = (cloudName = CLOUDINARY_CLOUD_NAME) => [
  `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?context=true`,
  `https://api.cloudinary.com/v1_1/${cloudName}/resources/video?`,
  `https://api.cloudinary.com/v1_1/${cloudName}/resources/raw?`,
]

const MAX_RESULTS = 500

export const fetchResources = async (url, credentials) => {
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
            `${credentials.apiKey}:${credentials.apiSecret}`,
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

export const filterByPrefixes = (resources, prefixes) => {
  if (!prefixes?.length) {
    return resources
  }

  return resources.filter(resource =>
    prefixes.some(prefix => resource.public_id.startsWith(prefix)),
  )
}

export const generateTypesContent = ({ images, videos, zipFiles }) => `
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
`

export const writeTypesFile = async (outPath, content) => {
  await fs.writeFile(outPath, content)
}
