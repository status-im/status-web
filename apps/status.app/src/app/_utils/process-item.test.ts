import { decodeXML } from 'entities'
import { describe, expect, it } from 'vitest'

import { processItem } from './process-item'

import type { FeedFormat } from './feed-content'

/**
 * Markup taken verbatim from https://our.status.im/tag/desktop-news/rss/ so the
 * shapes Ghost actually produces stay covered.
 */
const GHOST = {
  buttonCard:
    '<p>Fixes for high CPU and data usage overheating mobile devices. </p>' +
    '<div class="kg-card kg-button-card kg-align-center">' +
    '<a href="https://status.app/" class="kg-btn kg-btn-accent">Update your Status</a>' +
    '</div>',
  manuallyNumbered:
    '<p>If you&apos;re migrating using a local backup:</p>' +
    '<p>1&#xFE0F; Install v2.36.2<br>2&#xFE0F; Follow the official migration guide</p>' +
    '<div class="kg-card kg-button-card kg-align-center">' +
    '<a href="https://status.app/blog/migrate" class="kg-btn kg-btn-accent"> Migrate your Status</a>' +
    '</div>',
  trailingReadMore:
    '<p>Fixed a crash on the Home page.</p>' +
    '<p><a href="https://github.com/status-im/status-app/releases/tag/2.36.1" rel="noreferrer">Read more</a></p>',
  leadingImage:
    '<img src="https://our.status.im/content/images/hero.png" alt="Status v2.38.2 is Here!">' +
    '<p>Also moved to a new GIF provider.</p>',
}

type FeedItem = {
  'content:encoded'?: string
  description?: string
  'status:newsLink'?: string
  'status:newsLinkLabel'?: string
}

function process(html: string, format: FeedFormat = 'html'): FeedItem {
  const item: FeedItem = { 'content:encoded': html, description: html }
  processItem(item, format)
  return item
}

describe('processItem', () => {
  it('lifts a Ghost button card into the feed link elements', () => {
    const item = process(GHOST.buttonCard)

    expect(item['status:newsLink']).toBe('https://status.app/')
    expect(item['status:newsLinkLabel']).toBe('Update your Status')
    expect(item.description).toBe(
      'Fixes for high CPU and data usage overheating mobile devices.'
    )
  })

  it('keeps manually numbered lines on separate lines', () => {
    const item = process(GHOST.manuallyNumbered)

    expect(item.description).toBe(
      "If you're migrating using a local backup:&lt;br /&gt;&lt;br /&gt;" +
        '1\uFE0F Install v2.36.2&lt;br /&gt;2\uFE0F Follow the official migration guide'
    )
    // The label is padded upstream; it must still be stripped from the body.
    expect(item['status:newsLinkLabel']).toBe('Migrate your Status')
  })

  it('uses a trailing "Read more" link when there is no button card', () => {
    const item = process(GHOST.trailingReadMore)

    expect(item['status:newsLink']).toBe(
      'https://github.com/status-im/status-app/releases/tag/2.36.1'
    )
    expect(item['status:newsLinkLabel']).toBe('Read more')
    expect(item.description).toBe('Fixed a crash on the Home page.')
  })

  it('drops the lead image Ghost puts in content:encoded', () => {
    const item = process(GHOST.leadingImage)

    expect(item['content:encoded']).toBe('Also moved to a new GIF provider.')
    expect(item['status:newsLink']).toBeUndefined()
    expect(item['status:newsLinkLabel']).toBeUndefined()
  })

  it('escapes an ampersand in the link target', () => {
    const item = process(
      '<p>Body</p><p><a href="https://status.app/x?a=1&amp;b=2">Read &amp; more</a></p>'
    )

    expect(item['status:newsLink']).toBe('https://status.app/x?a=1&amp;b=2')
    expect(item['status:newsLinkLabel']).toBe('Read &amp; more')
  })

  it('renders a bullet list end to end', () => {
    const item = process(
      '<p>This release fixes:</p>' +
        '<ul><li>High CPU usage on Linux</li><li>Endless message loading</li></ul>' +
        '<div class="kg-card kg-button-card"><a href="https://status.app/" class="kg-btn">Update</a></div>'
    )

    expect(item.description).toBe(
      'This release fixes:' +
        '&lt;ul&gt;&lt;li&gt;High CPU usage on Linux&lt;/li&gt;' +
        '&lt;li&gt;Endless message loading&lt;/li&gt;&lt;/ul&gt;'
    )
    expect(item['status:newsLink']).toBe('https://status.app/')
  })

  it('hands the desktop client back its markup once decoded', () => {
    const item = process(
      '<p>Ada &amp; Co released:</p><ul><li>High CPU usage</li></ul>'
    )

    // status-go decodes the element with gofeed before the client sees it, so
    // what arrives is the markup, with the body text still escaped for HTML.
    expect(decodeXML(item.description ?? '')).toBe(
      'Ada &amp; Co released:<ul><li>High CPU usage</li></ul>'
    )
  })

  it('escapes a body link on the wire and decodes it back', () => {
    const item = process(
      '<p>See the <a href="https://wikipedia.org/?a=1&amp;b=2">test link</a></p>' +
        '<div class="kg-card kg-button-card"><a href="https://status.app/" class="kg-btn">Update</a></div>'
    )

    expect(item.description).toBe(
      'See the &lt;a href="https://wikipedia.org/?a=1&amp;amp;b=2"&gt;test link&lt;/a&gt;'
    )
    expect(decodeXML(item.description ?? '')).toBe(
      'See the <a href="https://wikipedia.org/?a=1&amp;b=2">test link</a>'
    )
  })

  it('renders the mobile feed as plain text', () => {
    const item = process(
      '<p>This release fixes:</p>' +
        '<ul><li>High CPU usage on Linux</li><li>Endless message loading</li></ul>',
      'text'
    )

    expect(item.description).toBe(
      'This release fixes:\n\n• High CPU usage on Linux\n• Endless message loading'
    )
  })

  it('keeps the mobile feed free of markup for the manually numbered post', () => {
    const item = process(GHOST.manuallyNumbered, 'text')

    expect(item.description).toBe(
      "If you're migrating using a local backup:\n\n" +
        '1\uFE0F Install v2.36.2\n2\uFE0F Follow the official migration guide'
    )
  })

  it('tolerates items without content', () => {
    const item: FeedItem = {}
    processItem(item, 'html')

    expect(item.description).toBe('')
    expect(item['content:encoded']).toBe('')
  })
})
