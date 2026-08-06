import { XMLBuilder, XMLParser } from 'fast-xml-parser'

import type { X2jOptions } from 'fast-xml-parser'

/**
 * The news feed the clients in the wild already parse, kept byte for byte as it
 * is served today: unnamespaced `newsLink`/`newsLinkLabel`, markup stripped down
 * to text and Ghost's escaping passed through untouched. `/v2` carries the
 * lists, the links and the escaping fixes.
 *
 * Frozen on purpose -- nothing here may be shared with the `/v2` modules, or a
 * change over there would reach the clients that have not been updated.
 */
export function buildLegacyNewsFeed(body: string, lineBreak: string): string {
  const parser = new XMLParser({
    ignoreAttributes: false,
    processEntities: false,
    htmlEntities: true,
    cdataPropName: undefined,
  } as X2jOptions)

  const xml = parser.parse(body)

  if (xml.rss?.channel?.item) {
    if (Array.isArray(xml.rss.channel.item)) {
      xml.rss.channel.item.forEach((item: any) => processItem(item, lineBreak))
    } else {
      processItem(xml.rss.channel.item, lineBreak)
    }
  }

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    processEntities: false,
    cdataPropName: undefined,
  })

  return builder.build(xml)
}

function stripHtml(content: string, lineBreak: string) {
  return content
    .split(/<\/p>/i)
    .map((part: string) => part.replace(/<[^>]+>/g, '').trim())
    .filter(
      (part: string, index: number, arr: string[]) =>
        part || index < arr.length - 1
    )
    .join(lineBreak)
}

function processField(item: any, field: string, lineBreak: string) {
  let content = stripHtml(item[field], lineBreak)
  if (item.newsLinkLabel) {
    content = content.replace(item.newsLinkLabel, '')
  }
  if (content.endsWith(lineBreak)) {
    content = content.slice(0, -lineBreak.length)
  }

  return content
}

function processItem(item: any, lineBreak: string) {
  const newsLink = item['content:encoded'].match(
    /<a[^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/
  )
  item.newsLink = newsLink?.[1]
  item.newsLinkLabel = newsLink?.[2]

  item['content:encoded'] = processField(item, 'content:encoded', lineBreak)
  item.description = processField(item, 'description', lineBreak)
}
