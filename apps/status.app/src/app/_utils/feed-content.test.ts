import { describe, expect, it } from 'vitest'

import { renderFeedContent } from './feed-content'

const BUTTON_CARD =
  '<div class="kg-card kg-button-card kg-align-center">' +
  '<a href="https://status.app/" class="kg-btn kg-btn-accent">Update your Status</a>' +
  '</div>'

describe('renderFeedContent', () => {
  it('renders a bullet list the clients can display', () => {
    const { html } = renderFeedContent(
      '<p>Fixes:</p><ul><li>High CPU usage</li><li>Endless loading</li></ul>'
    )

    expect(html).toBe(
      'Fixes:<ul><li>High CPU usage</li><li>Endless loading</li></ul>'
    )
  })

  it('renders numbered lists as an ordered list', () => {
    const { html } = renderFeedContent('<ol><li>First</li><li>Second</li></ol>')

    expect(html).toBe('<ol><li>First</li><li>Second</li></ol>')
  })

  it('nests sublists inside their parent item', () => {
    const { html } = renderFeedContent(
      '<ul><li>Wallet<ul><li>Swap</li><li>Send</li></ul></li><li>Chat</li></ul>'
    )

    expect(html).toBe(
      '<ul><li>Wallet<ul><li>Swap</li><li>Send</li></ul></li><li>Chat</li></ul>'
    )
  })

  it('separates paragraphs with a blank line but not lists', () => {
    const { html } = renderFeedContent(
      '<p>One</p><ul><li>Item</li></ul><p>Two</p><p>Three</p>'
    )

    expect(html).toBe('One<ul><li>Item</li></ul>Two<br /><br />Three')
  })

  it('keeps a line break inside a paragraph as a single break', () => {
    const { html } = renderFeedContent('<p>1 Install<br>2 Follow the guide</p>')

    expect(html).toBe('1 Install<br />2 Follow the guide')
  })

  it('drops empty list items', () => {
    const { html } = renderFeedContent(
      '<ul><li>Kept</li><li></li><li> </li></ul>'
    )

    expect(html).toBe('<ul><li>Kept</li></ul>')
  })

  it('drops images, captions markup and script content', () => {
    const { html } = renderFeedContent(
      '<img src="hero.png" alt="Hero"><script>alert("x")</script><p>Body</p>'
    )

    expect(html).toBe('Body')
  })

  it('collapses whitespace introduced by the source markup', () => {
    const { html } = renderFeedContent(
      '<p>\n  Spread   over\n  lines\n</p>\n<p>Next</p>'
    )

    expect(html).toBe('Spread over lines<br /><br />Next')
  })

  describe('call to action', () => {
    it('extracts a Ghost button card and keeps its label out of the body', () => {
      const { html, link } = renderFeedContent(`<p>Body</p>${BUTTON_CARD}`)

      expect(link).toEqual({
        href: 'https://status.app/',
        label: 'Update your Status',
      })
      expect(html).toBe('Body')
    })

    it('falls back to a plain trailing link', () => {
      const { html, link } = renderFeedContent(
        '<p>Body</p><p><a href="https://status.app/blog/x">Read more</a></p>'
      )

      expect(link).toEqual({
        href: 'https://status.app/blog/x',
        label: 'Read more',
      })
      expect(html).toBe('Body')
    })

    it('never lets a link inside a list become the call to action', () => {
      const { html, link } = renderFeedContent(
        '<ul><li>Fixed <a href="https://github.com/status-im/status-go/issues/1">issue 1</a></li></ul>' +
          BUTTON_CARD
      )

      expect(link?.href).toBe('https://status.app/')
      expect(html).toBe('<ul><li>Fixed issue 1</li></ul>')
    })

    it('leaves list links in the body when there is no other link', () => {
      const { html, link } = renderFeedContent(
        '<p>Body</p><ul><li>See <a href="https://status.app/x">the notes</a></li></ul>'
      )

      expect(link).toBeNull()
      expect(html).toBe('Body<ul><li>See the notes</li></ul>')
    })

    it('keeps surrounding text when the call to action is inline', () => {
      const { html, link } = renderFeedContent(
        '<p>Check <a href="https://status.app/x">the notes</a> for details</p>'
      )

      expect(link?.label).toBe('the notes')
      expect(html).toBe('Check for details')
    })

    it('prefers the button card over an earlier plain link', () => {
      const { link } = renderFeedContent(
        '<p><a href="https://status.app/first">First</a></p>' + BUTTON_CARD
      )

      expect(link?.href).toBe('https://status.app/')
    })
  })

  describe('escaping', () => {
    it('escapes characters that would break the feed', () => {
      const { html } = renderFeedContent(
        '<p>Use &lt;code&gt; &amp; read the R&amp;D notes</p>'
      )

      expect(html).toBe('Use &lt;code&gt; &amp; read the R&amp;D notes')
    })

    it('escapes a bare ampersand without touching existing entities', () => {
      const { html } = renderFeedContent(
        '<p>Tom &amp; Jerry &#x2019; &#39; &nbsp; Q&A</p>'
      )

      expect(html).toBe('Tom &amp; Jerry &#x2019; &#39; &nbsp; Q&amp;A')
    })

    it('escapes stray angle brackets from unbalanced markup', () => {
      const { html } = renderFeedContent('<p>5 > 3 and 2 < 4</p>')

      expect(html).toBe('5 &gt; 3 and 2 &lt; 4')
    })

    it('returns empty content for empty input', () => {
      expect(renderFeedContent('')).toEqual({ html: '', link: null })
    })
  })
})
