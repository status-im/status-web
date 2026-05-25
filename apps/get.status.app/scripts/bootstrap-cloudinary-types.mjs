import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import { GET_STATUS_APP_CLOUDINARY_PREFIXES } from './cloudinary-prefixes.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const statusTypesPath = path.join(
  __dirname,
  '../../status.app/src/app/_components/assets/types.ts',
)
const outPath = path.join(__dirname, '../src/app/_components/assets/types.ts')

const publicIdFromAssetId = id => id.replace(/:\d+:\d+$/, '')

const matchesPrefix = assetId => {
  const publicId = assetId.includes(':')
    ? publicIdFromAssetId(assetId)
    : assetId

  return GET_STATUS_APP_CLOUDINARY_PREFIXES.some(prefix =>
    publicId.startsWith(prefix),
  )
}

const source = await fs.readFile(statusTypesPath, 'utf8')

const imageBody = source
  .slice(
    source.indexOf('export type ImageType =') +
      'export type ImageType ='.length,
    source.indexOf('export type ImageId ='),
  )
  .trim()

const imageEntries = imageBody
  .split(/\n\s*\|/)
  .map(entry => entry.trim().replace(/^\|\s*/, ''))
  .filter(Boolean)
  .filter(entry => {
    const id = entry.match(/id:\s*'([^']+)'/)?.[1]
    return id && matchesPrefix(id)
  })

const filterQuotedUnion = sectionName => {
  const start = source.indexOf(`export type ${sectionName} =`)
  const body = source.slice(start + `export type ${sectionName} =`.length)

  return body
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith("| '"))
    .filter(line => {
      const id = line.match(/\|\s*'([^']+)'/)?.[1]
      return id && matchesPrefix(id)
    })
}

const videoLines = filterQuotedUnion('VideoId')
const zipLines = filterQuotedUnion('ZipFileId')

const content = `export type ImageType =
  | ${imageEntries.join('\n  | ')}

export type ImageId = ImageType['id']

export type ImageAlt = { [K in ImageType as K['id']]: K['alt'] }

export type VideoId =
  ${videoLines.join('\n  ')}

export type ZipFileId =
  ${zipLines.join('\n  ')}
`

await fs.writeFile(outPath, content)
console.log(
  `Bootstrapped get.status.app types (${imageEntries.length} images, ${videoLines.length} videos, ${zipLines.length} zip files)`,
)
