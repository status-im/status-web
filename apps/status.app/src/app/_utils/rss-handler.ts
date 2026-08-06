import { XMLBuilder, XMLParser } from 'fast-xml-parser'

import { clientEnv } from '~/config/env.client.mjs'
import { buildLegacyNewsFeed } from '~app/_utils/legacy-news-feed'
import { buildNewsFeed } from '~app/_utils/news-feed'
import { baseUrl } from '~website/_lib/base-url'

import type { FeedFormat } from '~app/_utils/feed-content'
import type { X2jOptions } from 'fast-xml-parser'

const FEED = {
  'desktop-news': {
    format: 'html',
    lineBreak: '<br /><br />',
    path: '/tag/desktop-news/rss/',
  },
  'mobile-news': {
    format: 'text',
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

export async function handleRssFeed(
  type: FeedType,
  version: FeedVersion = 'v1'
) {
  const { format, lineBreak, path } = FEED[type]

  try {
    const response = await fetch(
      `${clientEnv.NEXT_PUBLIC_GHOST_API_URL}${path}`,
      {
        headers: {
          Accept: 'application/rss+xml',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${type}`)
    }

    const body = await response.text()
    const newXml =
      type === 'main'
        ? buildBlogFeed(body)
        : version === 'v2'
          ? buildNewsFeed(body, format)
          : buildLegacyNewsFeed(body, lineBreak)

    return new Response(newXml, {
      headers: {
        'content-type':
          response.headers.get('content-type') || 'application/xml',
      },
    })
  } catch (error) {
    console.error(`Error fetching RSS feed: ${type}`, error)
    return new Response(JSON.stringify({ error: 'Failed to fetch RSS feed' }), {
      status: 500,
      headers: {
        'content-type': 'application/json',
      },
    })
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
