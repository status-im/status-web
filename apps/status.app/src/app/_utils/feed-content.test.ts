import { describe, expect, it } from 'vitest'

import {
  escapeUpstreamChannel,
  escapeUpstreamValues,
  renderFeedContent,
} from './feed-content'

const BUTTON_CARD =
  '<div class="kg-card kg-button-card kg-align-center">' +
  '<a href="https://status.app/" class="kg-btn kg-btn-accent">Update your Status</a>' +
  '</div>'

describe('renderFeedContent', () => {
  it('renders a bullet list the clients can display', () => {
    const { body } = renderFeedContent(
      '<p>Fixes:</p><ul><li>High CPU usage</li><li>Endless loading</li></ul>',
      'html'
    )

    expect(body).toBe(
      'Fixes:<ul><li>High CPU usage</li><li>Endless loading</li></ul>'
    )
  })

  it('renders numbered lists as an ordered list', () => {
    const { body } = renderFeedContent(
      '<ol><li>First</li><li>Second</li></ol>',
      'html'
    )

    expect(body).toBe('<ol><li>First</li><li>Second</li></ol>')
  })

  it('nests sublists inside their parent item', () => {
    const { body } = renderFeedContent(
      '<ul><li>Wallet<ul><li>Swap</li><li>Send</li></ul></li><li>Chat</li></ul>',
      'html'
    )

    expect(body).toBe(
      '<ul><li>Wallet<ul><li>Swap</li><li>Send</li></ul></li><li>Chat</li></ul>'
    )
  })

  it('separates paragraphs with a blank line but not lists', () => {
    const { body } = renderFeedContent(
      '<p>One</p><ul><li>Item</li></ul><p>Two</p><p>Three</p>',
      'html'
    )

    expect(body).toBe('One<ul><li>Item</li></ul>Two<br /><br />Three')
  })

  it('keeps a line break inside a paragraph as a single break', () => {
    const { body } = renderFeedContent(
      '<p>1 Install<br>2 Follow the guide</p>',
      'html'
    )

    expect(body).toBe('1 Install<br />2 Follow the guide')
  })

  it('drops empty list items', () => {
    const { body } = renderFeedContent(
      '<ul><li>Kept</li><li></li><li> </li></ul>',
      'html'
    )

    expect(body).toBe('<ul><li>Kept</li></ul>')
  })

  it('drops images, captions markup and script content', () => {
    const { body } = renderFeedContent(
      '<img src="hero.png" alt="Hero"><script>alert("x")</script><p>Body</p>',
      'html'
    )

    expect(body).toBe('Body')
  })

  it('collapses whitespace introduced by the source markup', () => {
    const { body } = renderFeedContent(
      '<p>\n  Spread   over\n  lines\n</p>\n<p>Next</p>',
      'html'
    )

    expect(body).toBe('Spread over lines<br /><br />Next')
  })

  describe('call to action', () => {
    it('extracts a Ghost button card and keeps its label out of the body', () => {
      const { body, link } = renderFeedContent(
        `<p>Body</p>${BUTTON_CARD}`,
        'html'
      )

      expect(link).toEqual({
        href: 'https://status.app/',
        label: 'Update your Status',
      })
      expect(body).toBe('Body')
    })

    it('falls back to a plain trailing link', () => {
      const { body, link } = renderFeedContent(
        '<p>Body</p><p><a href="https://status.app/blog/x">Read more</a></p>',
        'html'
      )

      expect(link).toEqual({
        href: 'https://status.app/blog/x',
        label: 'Read more',
      })
      expect(body).toBe('Body')
    })

    it('never lets a link inside a list become the call to action', () => {
      const { body, link } = renderFeedContent(
        '<ul><li>Fixed <a href="https://github.com/status-im/status-go/issues/1">issue 1</a></li></ul>' +
          BUTTON_CARD,
        'html'
      )

      expect(link?.href).toBe('https://status.app/')
      expect(body).toBe('<ul><li>Fixed issue 1</li></ul>')
    })

    it('leaves list links in the body when there is no other link', () => {
      const { body, link } = renderFeedContent(
        '<p>Body</p><ul><li>See <a href="https://status.app/x">the notes</a></li></ul>',
        'html'
      )

      expect(link).toBeNull()
      expect(body).toBe('Body<ul><li>See the notes</li></ul>')
    })

    it('keeps surrounding text when the call to action is inline', () => {
      const { body, link } = renderFeedContent(
        '<p>Check <a href="https://status.app/x">the notes</a> for details</p>',
        'html'
      )

      expect(link?.label).toBe('the notes')
      expect(body).toBe('Check for details')
    })

    it('prefers the button card over an earlier plain link', () => {
      const { link } = renderFeedContent(
        '<p><a href="https://status.app/first">First</a></p>' + BUTTON_CARD,
        'html'
      )

      expect(link?.href).toBe('https://status.app/')
    })
  })

  describe('escaping', () => {
    it('escapes characters that would break the feed', () => {
      const { body } = renderFeedContent(
        '<p>Use &lt;code&gt; &amp; read the R&amp;D notes</p>',
        'html'
      )

      expect(body).toBe('Use &lt;code&gt; &amp; read the R&amp;D notes')
    })

    it('resolves the entities Ghost emits, including ones XML lacks', () => {
      const { body } = renderFeedContent(
        '<p>Tom &amp; Jerry &#x2019; &#39; &nbsp;&copy; Q&A</p>',
        'html'
      )

      expect(body).toBe("Tom &amp; Jerry \u2019 ' \u00A0\u00A9 Q&amp;A")
    })

    it('leaves a semicolon-less entity name alone', () => {
      const { body } = renderFeedContent(
        '<p>https://status.app/x?a=1&copy=1</p>',
        'html'
      )

      expect(body).toBe('https://status.app/x?a=1&amp;copy=1')
    })

    it('escapes stray angle brackets from unbalanced markup', () => {
      const { body } = renderFeedContent('<p>5 > 3 and 2 < 4</p>', 'html')

      expect(body).toBe('5 &gt; 3 and 2 &lt; 4')
    })

    it('returns empty content for empty input', () => {
      expect(renderFeedContent('', 'html')).toEqual({ body: '', link: null })
    })
  })

  describe("the mobile client's plain text format", () => {
    it('renders lists as text bullets, never as markup', () => {
      const { body } = renderFeedContent(
        '<p>Fixes:</p><ul><li>High CPU usage</li><li>Endless loading</li></ul>',
        'text'
      )

      expect(body).toBe('Fixes:\n\n• High CPU usage\n• Endless loading')
      expect(body).not.toContain('<')
    })

    it('numbers ordered lists', () => {
      const { body } = renderFeedContent(
        '<ol><li>Install</li><li>Follow the guide</li></ol>',
        'text'
      )

      expect(body).toBe('1. Install\n2. Follow the guide')
    })

    it('hangs nested items under their parent', () => {
      const { body } = renderFeedContent(
        '<ul><li>Wallet<ul><li>Swap</li><li>Send</li></ul></li><li>Chat</li></ul>',
        'text'
      )

      expect(body).toBe('• Wallet\n  • Swap\n  • Send\n• Chat')
    })

    it('numbers from one after empty items are dropped', () => {
      const { body } = renderFeedContent(
        '<ol><li></li><li>First</li><li>Second</li></ol>',
        'text'
      )

      expect(body).toBe('1. First\n2. Second')
    })

    it('keeps paragraphs separated by a blank line', () => {
      const { body } = renderFeedContent('<p>One</p><p>Two</p>', 'text')

      expect(body).toBe('One\n\nTwo')
    })

    it('renders a line break inside a paragraph as a newline', () => {
      const { body } = renderFeedContent(
        '<p>1 Install<br>2 Follow the guide</p>',
        'text'
      )

      expect(body).toBe('1 Install\n2 Follow the guide')
    })

    it('still escapes characters that would break the feed', () => {
      const { body } = renderFeedContent('<p>Tom &amp; Jerry, Q&A</p>', 'text')

      expect(body).toBe('Tom &amp; Jerry, Q&amp;A')
    })

    it('extracts the call to action the same way', () => {
      const { body, link } = renderFeedContent(
        `<p>Body</p>${BUTTON_CARD}`,
        'text'
      )

      expect(link?.href).toBe('https://status.app/')
      expect(body).toBe('Body')
    })
  })
})

describe('escapeUpstreamValues', () => {
  it('escapes Ghost values but leaves generated fields untouched', () => {
    const channel = {
      title: 'Tom & Jerry',
      item: [
        {
          title: 'v2.34.4 & What&#x2019;s Next',
          description: '<ul><li>Item</li></ul>',
          'media:content': { '@_url': 'https://cdn.test/a.png?w=1&h=2' },
        },
      ],
    }

    escapeUpstreamValues(channel, new Set(['description']))

    expect(channel.title).toBe('Tom &amp; Jerry')
    expect(channel.item[0].title).toBe('v2.34.4 &amp; What’s Next')
    expect(channel.item[0].description).toBe('<ul><li>Item</li></ul>')
    expect(channel.item[0]['media:content']['@_url']).toBe(
      'https://cdn.test/a.png?w=1&amp;h=2'
    )
  })

  it('escapes quotes in attribute values only', () => {
    const channel = {
      title: 'The "best" release',
      'media:content': { '@_url': 'https://cdn.test/a".png' },
    }

    escapeUpstreamValues(channel, new Set())

    expect(channel.title).toBe('The "best" release')
    expect(channel['media:content']['@_url']).toBe(
      'https://cdn.test/a&quot;.png'
    )
  })
})

describe('escapeUpstreamChannel', () => {
  it('escapes the channel description that items are skipped for', () => {
    const channel = {
      description: 'Research & Development',
      item: [{ description: '<ul><li>Item</li></ul>' }],
    }

    escapeUpstreamChannel(channel, new Set(['description']))

    expect(channel.description).toBe('Research &amp; Development')
    expect(channel.item[0].description).toBe('<ul><li>Item</li></ul>')
  })
})
