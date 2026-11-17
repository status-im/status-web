import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { feeds, snapshotDirectory, validateFeed } from './feed-snapshots.mjs'

const [source, ...paths] = process.argv.slice(2)
const selected = paths.length
  ? feeds.filter(feed => paths.includes(feed.source))
  : feeds

if (!source || (paths.length && selected.length !== new Set(paths).size)) {
  throw new Error(
    'Usage: pnpm capture:feeds <live app URL or archive directory> [feed path ...]',
  )
}

const fromUrl = /^https?:\/\//.test(source)
const snapshots = await Promise.all(
  selected.map(async feed => {
    let body
    if (fromUrl) {
      const response = await fetch(new URL(feed.source, source), {
        signal: AbortSignal.timeout(15_000),
      })
      if (!response.ok)
        throw new Error(`${feed.source} returned HTTP ${response.status}`)
      body = Buffer.from(await response.arrayBuffer())
    } else {
      body = await readFile(join(source, feed.file))
    }

    validateFeed(body.toString('utf8'), feed)
    return { feed, body }
  }),
)

// Validate all requested XML before replacing any last-known-good file.
await mkdir(snapshotDirectory, { recursive: true })
for (const { feed, body } of snapshots) {
  const destination = join(snapshotDirectory, feed.file)
  const temporary = `${destination}.${process.pid}.tmp`
  await writeFile(temporary, body, { flag: 'wx' })
  await rename(temporary, destination)
  console.log(`Captured ${feed.source} in ${feed.file}`)
}
