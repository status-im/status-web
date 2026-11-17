import { XMLBuilder, XMLParser } from 'fast-xml-parser'

import { clientEnv } from '~/config/env.client.mjs'
import { buildLegacyNewsFeed } from '~app/_utils/legacy-news-feed'
import { buildNewsFeed } from '~app/_utils/news-feed'
import { baseUrl } from '~website/_lib/base-url'
import {
  cacheGhostResult,
  ghostFeedUnavailable,
} from '~website/_lib/ghost/cache'
import { getGhostTimeoutSignal } from '~website/_lib/ghost/client'

import type { FeedFormat } from '~app/_utils/feed-content'
import type { X2jOptions } from 'fast-xml-parser'

const FEED = {
  'desktop-news': {
    format: 'html',
    lineBreak: '<br /><br />',
    path: '/tag/desktop-news/rss/',
  },
  // status-app renders the description as rich text on mobile as on desktop, so
  // a newline collapses to a space there: `/v2` serves it markup. `lineBreak`
  // only feeds the frozen v1 output.
  'mobile-news': {
    format: 'html',
    lineBreak: '\n\n',
    path: '/tag/mobile-news/rss/',
  },
  main: {
    format: 'html',
    lineBreak: '',
    path: '/rss/',
  },
} as const satisfies Record<
  string,
  { format: FeedFormat; lineBreak: string; path: string }
>

type FeedType = keyof typeof FEED

/**
 * `v1` is what the shipped clients parse, so it stays on the rendering they were
 * built against; `v2` is served from its own URL because the fixes it carries --
 * the namespaced call-to-action above all -- need a client that expects them.
 */
type FeedVersion = 'v1' | 'v2'

const getRssFeed = cacheGhostResult('RSS feeds', async (type: FeedType) => {
  const response = await fetch(
    `${clientEnv.NEXT_PUBLIC_GHOST_API_URL}${FEED[type].path}`,
    {
      headers: {
        Accept: 'application/rss+xml',
      },
      cache: 'no-store',
      signal: getGhostTimeoutSignal(),
    }
  )

  if (!response.ok) {
    throw new Error(`Ghost returned ${response.status} for ${type}`)
  }

  return {
    body: await response.text(),
    contentType: response.headers.get('content-type') || 'application/xml',
  }
})

export async function handleRssFeed(
  type: FeedType,
  version: FeedVersion = 'v1'
) {
  const feed = await getRssFeed(type)
  if (!feed) return ghostFeedUnavailable()

  const { format, lineBreak } = FEED[type]

  try {
    const newXml =
      type === 'main'
        ? buildBlogFeed(feed.body)
        : version === 'v2'
          ? buildNewsFeed(feed.body, format)
          : buildLegacyNewsFeed(feed.body, lineBreak)

    const response = new Response(newXml, {
      headers: {
        'content-type': feed.contentType,
      },
    })
    if (type !== 'main') {
      response.headers.set(
        'cache-control',
        'public, s-maxage=300, stale-while-revalidate=300'
      )
    }
    return response
  } catch (error) {
    console.error(`Error rendering RSS feed: ${type}`, error)
    return ghostFeedUnavailable()
  }
}

/**
 * Drops the posts the clients receive through the news feeds and points the
 * remaining ones at the blog. Ghost's CDATA wrappers are kept, so its markup
 * and escaping are served back untouched.
 */
function buildBlogFeed(body: string): string {
  const parser = new XMLParser({
    ignoreAttributes: false,
    processEntities: false,
    htmlEntities: true,
    cdataPropName: '__cdata',
  } as X2jOptions)

  const xml = parser.parse(body)

  if (xml.rss?.channel?.item) {
    xml.rss.channel.item = xml.rss.channel.item.filter(
      (item: any) =>
        !item.category?.__cdata?.includes('Desktop news') &&
        !item.category?.__cdata?.includes('Mobile news')
    )
    xml.rss.channel.item.forEach((item: any) => {
      item.link = item.link.replace(
        `${clientEnv.NEXT_PUBLIC_GHOST_API_URL}`,
        `${baseUrl()}/blog`
      )
    })
  }

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    processEntities: false,
    cdataPropName: '__cdata',
  })

  return builder.build(xml)
}
