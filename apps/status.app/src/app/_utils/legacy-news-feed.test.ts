import { describe, expect, it } from 'vitest'

import { buildLegacyNewsFeed } from './legacy-news-feed'

const DESKTOP_LINE_BREAK = '<br /><br />'
const MOBILE_LINE_BREAK = '\n\n'

/** A Ghost item shaped the way the shipped clients receive it today. */
const GHOST_FEED = (body: string) =>
  '<rss xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">' +
  '<channel>' +
  '<item>' +
  '<title><![CDATA[Fixes & tweaks <beta>]]></title>' +
  `<description><![CDATA[${body}]]></description>` +
  `<content:encoded><![CDATA[${body}]]></content:encoded>` +
  '</item>' +
  '</channel>' +
  '</rss>'

const LIST_BODY =
  '<p>Fixes:</p>' +
  '<ul><li>High CPU usage</li>' +
  '<li>Endless loading, see the <a href="https://wikipedia.org/">test link</a> for details</li></ul>'

const BUTTON_CARD =
  '<p>Fixes for high CPU usage.</p>' +
  '<p>Thanks for testing.</p>' +
  '<div class="kg-card kg-button-card kg-align-center">' +
  '<a href="https://status.app/" class="kg-btn kg-btn-accent">Update your Status</a>' +
  '</div>'

describe('buildLegacyNewsFeed', () => {
  it('carries the call-to-action outside of any namespace', () => {
    const feed = buildLegacyNewsFeed(GHOST_FEED(BUTTON_CARD), MOBILE_LINE_BREAK)

    expect(feed).toContain('<newsLink>https://status.app/</newsLink>')
    expect(feed).toContain('<newsLinkLabel>Update your Status</newsLinkLabel>')
    expect(feed).not.toContain('xmlns:status')
  })

  it('joins the paragraphs with the line break the feed asks for', () => {
    expect(
      buildLegacyNewsFeed(GHOST_FEED(BUTTON_CARD), DESKTOP_LINE_BREAK)
    ).toContain(
      '<description>Fixes for high CPU usage.<br /><br />Thanks for testing.</description>'
    )
    expect(
      buildLegacyNewsFeed(GHOST_FEED(BUTTON_CARD), MOBILE_LINE_BREAK)
    ).toContain(
      '<description>Fixes for high CPU usage.\n\nThanks for testing.</description>'
    )
  })

  /**
   * The bugs below are the ones `/v2` exists to fix -- an unescaped title makes
   * the feed invalid XML, list items run together and the anchor label is lost.
   * They are locked here because the shipped clients read around them, so this
   * test failing means a fix has leaked into the frozen feed.
   */
  it('reproduces what production serves, bugs included', () => {
    const feed = buildLegacyNewsFeed(GHOST_FEED(LIST_BODY), MOBILE_LINE_BREAK)

    expect(feed.slice(feed.indexOf('<item>'))).toBe(
      '<item>' +
        '<title>Fixes & tweaks <beta></title>' +
        '<description>Fixes:\n\nHigh CPU usageEndless loading, see the  for details</description>' +
        '<content:encoded>Fixes:\n\nHigh CPU usageEndless loading, see the  for details</content:encoded>' +
        '<newsLink>https://wikipedia.org/</newsLink>' +
        '<newsLinkLabel>test link</newsLinkLabel>' +
        '</item></channel></rss>'
    )
  })

  it('leaves Ghost values escaped the way they arrive', () => {
    const feed = buildLegacyNewsFeed(
      GHOST_FEED('<p>Fixes &amp; tweaks</p>'),
      MOBILE_LINE_BREAK
    )

    expect(feed).toContain('<description>Fixes &amp; tweaks</description>')
  })
})
