import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { XMLParser, XMLValidator } from 'fast-xml-parser'

export const snapshotDirectory = fileURLToPath(
  new URL('../public/feeds/', import.meta.url),
)

export const feeds = [
  { source: '/rss', file: 'blog-rss.xml' },
  { source: '/feed.xml', file: 'blog-atom.xml', atom: true },
  { source: '/desktop-news/rss', file: 'desktop-news.xml' },
  { source: '/desktop-news/rss/v2', file: 'desktop-news-v2.xml', v2: true },
  { source: '/mobile-news/rss', file: 'mobile-news.xml' },
  { source: '/mobile-news/rss/v2', file: 'mobile-news-v2.xml', v2: true },
]

const parser = new XMLParser({
  ignoreAttributes: false,
  processEntities: false,
})

export function validateFeed(body, feed) {
  if (/<!DOCTYPE/i.test(body) || XMLValidator.validate(body) !== true) {
    throw new Error(`${feed.source} did not return valid feed XML`)
  }

  const xml = parser.parse(body)
  const root = feed.atom ? xml.feed : xml.rss
  const entries = feed.atom ? root?.entry : root?.channel?.item
  const validFormat = feed.atom
    ? root?.['@_xmlns'] === 'http://www.w3.org/2005/Atom'
    : String(root?.['@_version']) === '2.0' &&
      root?.['@_xmlns:status'] ===
        (feed.v2 ? 'https://status.app/ns/rss/1.0' : undefined)

  if (
    !validFormat ||
    !entries ||
    (Array.isArray(entries) && entries.length === 0)
  ) {
    throw new Error(
      `${feed.source} did not return a nonempty feed of the expected format`,
    )
  }
}

export function getFeedSnapshots() {
  return feeds.filter(feed => {
    const file = new URL(`../public/feeds/${feed.file}`, import.meta.url)
    if (!existsSync(file)) return false

    validateFeed(readFileSync(file, 'utf8'), feed)
    return true
  })
}
