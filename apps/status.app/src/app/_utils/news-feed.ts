import { XMLBuilder, XMLParser } from 'fast-xml-parser'

import { escapeUpstreamChannel } from './feed-content'
import {
  GENERATED_ITEM_FIELDS,
  NEWS_NAMESPACE_PREFIX,
  NEWS_NAMESPACE_URI,
  processItem,
} from './process-item'

import type { FeedFormat } from './feed-content'
import type { X2jOptions } from 'fast-xml-parser'

/**
 * Rewrites a Ghost feed into the news feed the desktop and mobile clients
 * consume. Ghost's CDATA wrappers are dropped on parse and entity processing is
 * off in both directions, so nothing here can rely on the upstream escaping:
 * every value the feed carries has to be escaped before it is rebuilt.
 */
export function buildNewsFeed(body: string, format: FeedFormat): string {
  const parser = new XMLParser({
    ignoreAttributes: false,
    processEntities: false,
    htmlEntities: true,
  } as X2jOptions)

  const xml = parser.parse(body)
  const channel = xml.rss?.channel

  if (xml.rss) {
    xml.rss[`@_xmlns:${NEWS_NAMESPACE_PREFIX}`] = NEWS_NAMESPACE_URI
  }

  if (channel) {
    if (Array.isArray(channel.item)) {
      channel.item.forEach((item: any) => processItem(item, format))
    } else if (channel.item) {
      processItem(channel.item, format)
    }

    escapeUpstreamChannel(channel, GENERATED_ITEM_FIELDS)
  }

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    processEntities: false,
  })

  return builder.build(xml)
}
