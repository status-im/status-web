import { XMLParser, XMLValidator } from 'fast-xml-parser'
import { describe, expect, it } from 'vitest'

import { buildNewsFeed } from './news-feed'

/**
 * A Ghost feed carrying every construct that has broken the output: an
 * ampersand in the channel description, entity names XML does not define, a
 * semicolon-less `&copy` in a query string and an ampersand in an attribute.
 */
const GHOST_FEED =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<rss xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/" version="2.0">' +
  '<channel>' +
  '<title><![CDATA[Mobile news]]></title>' +
  '<description><![CDATA[Research & Development at Status]]></description>' +
  '<link>https://our.status.im/</link>' +
  '<item>' +
  '<title><![CDATA[v2.36 &amp; what&#x2019;s next]]></title>' +
  '<description><![CDATA[<p>Ada &amp; Co&nbsp;&copy; 2026</p>' +
  '<p><a href="https://status.app/x?a=1&copy=1">Read more</a></p>]]></description>' +
  '<media:content url="https://cdn.test/a.png?w=1&amp;h=2"/>' +
  '</item>' +
  '</channel>' +
  '</rss>'

const LIST_FEED =
  '<rss version="2.0"><channel>' +
  '<item>' +
  '<title><![CDATA[One &amp; only]]></title>' +
  '<description><![CDATA[<p>Fixes:</p><ul><li>High CPU usage</li></ul>]]></description>' +
  '</item>' +
  '</channel></rss>'

/** The entities XML defines; Go's parser rejects every other name. */
const UNDEFINED_ENTITY =
  /&(?!(?:amp|lt|gt|quot|apos|#\d+|#[xX][0-9a-fA-F]+);)\S*/

/** Reads the output back the way a client does, entities and all. */
function parseItem(feed: string) {
  return new XMLParser({ ignoreAttributes: false }).parse(feed).rss.channel.item
}

describe('buildNewsFeed', () => {
  it('produces a feed that parses as XML', () => {
    const feed = buildNewsFeed(GHOST_FEED, 'text')

    expect(XMLValidator.validate(feed)).toBe(true)
    expect(feed.match(UNDEFINED_ENTITY)).toBeNull()
  })

  it('escapes the ampersand in the channel description', () => {
    const feed = buildNewsFeed(GHOST_FEED, 'text')

    expect(feed).toContain(
      '<description>Research &amp; Development at Status</description>'
    )
  })

  it('escapes every ampersand exactly once', () => {
    const item = parseItem(buildNewsFeed(GHOST_FEED, 'text'))

    expect(item.title).toBe('v2.36 & what\u2019s next')
    expect(item.description).toBe('Ada & Co\u00A0\u00A9 2026')
    expect(item['media:content']['@_url']).toBe(
      'https://cdn.test/a.png?w=1&h=2'
    )
  })

  it('keeps a semicolon-less entity name out of the link target', () => {
    const item = parseItem(buildNewsFeed(GHOST_FEED, 'text'))

    expect(item.newsLink).toBe('https://status.app/x?a=1&copy=1')
    expect(item.newsLinkLabel).toBe('Read more')
  })

  it('emits the desktop feed as markup and the mobile feed as text', () => {
    const desktop = buildNewsFeed(LIST_FEED, 'html')

    // The markup is the description's content, so it is read as a string here.
    expect(desktop).toContain(
      '<description>Fixes:<ul><li>High CPU usage</li></ul></description>'
    )
    expect(XMLValidator.validate(desktop)).toBe(true)
    expect(parseItem(buildNewsFeed(LIST_FEED, 'text')).description).toBe(
      'Fixes:\n\n• High CPU usage'
    )
  })

  it('handles a channel holding a single item', () => {
    const feed = buildNewsFeed(LIST_FEED, 'text')

    expect(XMLValidator.validate(feed)).toBe(true)
    expect(parseItem(feed).title).toBe('One & only')
  })

  it('escapes a channel that has no items', () => {
    const feed = buildNewsFeed(
      '<rss version="2.0"><channel><description><![CDATA[R & D]]></description></channel></rss>',
      'text'
    )

    expect(XMLValidator.validate(feed)).toBe(true)
    expect(feed).toContain('<description>R &amp; D</description>')
  })
})
