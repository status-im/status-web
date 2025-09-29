import { XMLBuilder, XMLParser } from 'fast-xml-parser'

import { clientEnv } from '~/config/env.client.mjs'
import { processItem } from '~app/_utils/process-item'
import { baseUrl } from '~website/_lib/base-url'

import type { X2jOptions } from 'fast-xml-parser'

const FEED = {
  'desktop-news': {
    lineBreak: '<br /><br />',
    path: '/tag/desktop-news/rss/',
  },
  'mobile-news': {
    lineBreak: '\n\n',
    path: '/tag/mobile-news/rss/',
  },
  main: {
    lineBreak: '',
    path: '/rss/',
  },
} as const

type FeedType = keyof typeof FEED

export async function handleRssFeed(type: FeedType) {
  const { path, lineBreak } = FEED[type]

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
    const parser = new XMLParser({
      ignoreAttributes: false,
      processEntities: false,
      htmlEntities: true,
      cdataPropName: type === 'main' ? '__cdata' : undefined,
    } as X2jOptions)

    const xml = parser.parse(body)

    if (xml.rss?.channel?.item) {
      if (type === 'main') {
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
      } else if (Array.isArray(xml.rss.channel.item)) {
        xml.rss.channel.item.forEach((item: any) =>
          processItem(item, lineBreak)
        )
      } else {
        processItem(xml.rss.channel.item, lineBreak)
      }
    }

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      processEntities: false,
      cdataPropName: type === 'main' ? '__cdata' : undefined,
    })

    const newXml = builder.build(xml)

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
