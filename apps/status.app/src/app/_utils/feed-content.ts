/**
 * Converts Ghost post HTML into the small HTML subset the Status desktop and
 * mobile clients render for news notifications.
 *
 * status-go parses `<description>` with gofeed, which decodes the element via
 * `xml:",innerxml"` and hands the raw markup to the client, so anything emitted
 * here has to stay well-formed XML. That is guaranteed by construction: text
 * nodes are escaped and the only tags in the output are the ones this module
 * writes itself. A parsing mistake can misplace text but cannot produce a feed
 * that fails to parse, which would take news down for every installed client.
 */

import { decodeHTMLStrict } from 'entities'

const PARAGRAPH_BREAK = '<br /><br />'
const PLAIN_PARAGRAPH_BREAK = '\n\n'

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

const BLOCK_TAGS = new Set([
  'address',
  'article',
  'aside',
  'blockquote',
  'dd',
  'details',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hgroup',
  'hr',
  'main',
  'nav',
  'p',
  'pre',
  'section',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
])

// Elements whose text content never belongs in a notification.
const SKIPPED_TAGS = new Set([
  'iframe',
  'noscript',
  'script',
  'style',
  'svg',
  'template',
])

const LIST_TAGS = new Set(['ol', 'ul'])

/** Attribute values may contain `>`, so quoted runs are matched before it. */
const TAG_PATTERN =
  /<!--[\s\S]*?-->|<\/\s*([a-zA-Z][\w:-]*)\s*>|<\s*([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^"'>])*)>/g

type Token =
  | { kind: 'text'; value: string }
  | { kind: 'open'; name: string; attributes: string }
  | { kind: 'close'; name: string }

type Block =
  | { type: 'text'; text: string }
  | { type: 'list'; ordered: boolean; items: Block[][] }

/**
 * `html` targets the desktop client's rich text view; `text` targets the mobile
 * client, which renders the description as plain text and would show markup
 * literally.
 */
export type FeedFormat = 'html' | 'text'

export type FeedLink = { href: string; label: string }

export type FeedContent = { body: string; link: FeedLink | null }

function tokenize(html: string): Token[] {
  const tokens: Token[] = []
  let cursor = 0

  for (const match of html.matchAll(TAG_PATTERN)) {
    const index = match.index ?? 0

    if (index > cursor) {
      tokens.push({ kind: 'text', value: html.slice(cursor, index) })
    }
    cursor = index + match[0].length

    const [, closeName, openName, attributes = ''] = match

    if (closeName) {
      tokens.push({ kind: 'close', name: closeName.toLowerCase() })
      continue
    }

    if (openName) {
      const name = openName.toLowerCase()
      tokens.push({ kind: 'open', name, attributes })

      if (VOID_TAGS.has(name) || attributes.trimEnd().endsWith('/')) {
        tokens.push({ kind: 'close', name })
      }
    }
  }

  if (cursor < html.length) {
    tokens.push({ kind: 'text', value: html.slice(cursor) })
  }

  return tokens
}

function getAttribute(attributes: string, name: string): string {
  const match = attributes.match(
    new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i')
  )

  return match?.[2] ?? match?.[3] ?? ''
}

/** Collects the text of an element, starting just after its opening tag. */
function readElementText(tokens: Token[], start: number, name: string): string {
  let depth = 1
  let text = ''

  for (let index = start; index < tokens.length; index++) {
    const token = tokens[index]

    if (token.kind === 'text') {
      text += token.value
    } else if (token.name === name) {
      depth += token.kind === 'open' ? 1 : -1
      if (depth === 0) break
    }
  }

  return collapseWhitespace(text)
}

/**
 * Picks the anchor that becomes the notification's call-to-action. Ghost button
 * cards win; otherwise the first anchor outside a list does, so that a link
 * inside a bullet cannot hijack the CTA.
 */
function findLinkToken(
  tokens: Token[]
): (FeedLink & { tokenIndex: number }) | null {
  let listDepth = 0
  let fallback: (FeedLink & { tokenIndex: number }) | null = null

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]

    if (token.kind === 'open' && LIST_TAGS.has(token.name)) {
      listDepth++
    } else if (token.kind === 'close' && LIST_TAGS.has(token.name)) {
      listDepth = Math.max(0, listDepth - 1)
    } else if (token.kind === 'open' && token.name === 'a') {
      const href = getAttribute(token.attributes, 'href')
      if (!href) continue

      const label = readElementText(tokens, index + 1, 'a')
      const isButton = /(^|\s)kg-btn(\s|$)/.test(
        getAttribute(token.attributes, 'class')
      )

      if (isButton) {
        return { href, label: label.trim(), tokenIndex: index }
      }
      if (listDepth === 0 && !fallback) {
        fallback = { href, label: label.trim(), tokenIndex: index }
      }
    }
  }

  return fallback
}

function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ')
}

type Cursor = { index: number }

function skipElement(tokens: Token[], cursor: Cursor, name: string): void {
  let depth = 1

  while (cursor.index < tokens.length && depth > 0) {
    const token = tokens[cursor.index++]

    if (token.kind !== 'text' && token.name === name) {
      depth += token.kind === 'open' ? 1 : -1
    }
  }
}

function parseBlocks(
  tokens: Token[],
  cursor: Cursor,
  linkTokenIndex: number,
  stopOnOpen: ReadonlySet<string>,
  stopOnClose: ReadonlySet<string>
): Block[] {
  const blocks: Block[] = []
  let buffer = ''

  const flush = () => {
    // Removing a suppressed anchor can leave the spaces that surrounded it
    // doubled up; `\n` marks a break and has to survive.
    const text = buffer.replace(/[^\S\n]+/g, ' ').trim()
    buffer = ''
    if (text) {
      blocks.push({ type: 'text', text })
    }
  }

  while (cursor.index < tokens.length) {
    const token = tokens[cursor.index]

    if (token.kind === 'text') {
      cursor.index++
      buffer += collapseWhitespace(token.value)
      continue
    }

    if (token.kind === 'close') {
      if (stopOnClose.has(token.name)) break

      cursor.index++
      if (BLOCK_TAGS.has(token.name)) {
        flush()
      }
      continue
    }

    if (stopOnOpen.has(token.name)) break

    const tokenIndex = cursor.index
    cursor.index++

    if (SKIPPED_TAGS.has(token.name)) {
      skipElement(tokens, cursor, token.name)
      continue
    }

    if (token.name === 'br') {
      // Rendered as a single break; a blank line only ever comes from a real
      // block boundary.
      buffer += '\n'
      continue
    }

    if (LIST_TAGS.has(token.name)) {
      flush()
      blocks.push(
        parseList(tokens, cursor, linkTokenIndex, token.name === 'ol')
      )
      continue
    }

    if (token.name === 'a') {
      const label = readElementText(tokens, cursor.index, 'a')
      skipElement(tokens, cursor, 'a')
      // The CTA is surfaced as its own feed element, so its label must not be
      // repeated in the body.
      if (tokenIndex !== linkTokenIndex) {
        buffer += label
      }
      continue
    }

    if (BLOCK_TAGS.has(token.name)) {
      flush()
    }
  }

  flush()

  return blocks
}

function parseList(
  tokens: Token[],
  cursor: Cursor,
  linkTokenIndex: number,
  ordered: boolean
): Block {
  const items: Block[][] = []

  while (cursor.index < tokens.length) {
    const token = tokens[cursor.index]

    if (token.kind === 'close' && LIST_TAGS.has(token.name)) {
      cursor.index++
      break
    }

    if (token.kind === 'open' && token.name === 'li') {
      cursor.index++
      items.push(
        parseBlocks(tokens, cursor, linkTokenIndex, LI_STOP_OPEN, LI_STOP_CLOSE)
      )
      continue
    }

    // Whitespace and stray markup between items carries no content.
    cursor.index++
  }

  return { type: 'list', ordered, items }
}

const LI_STOP_OPEN: ReadonlySet<string> = new Set(['li'])
const LI_STOP_CLOSE: ReadonlySet<string> = new Set(['li', 'ol', 'ul'])

/** XML 1.0 forbids these outright, including as numeric references. */
const FORBIDDEN_XML_CHARS =
  /[^\t\n\r\x20-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu

/**
 * Resolves Ghost's HTML entities to their characters and escapes the result for
 * XML. Passing the entities through would emit names such as `&nbsp;` that XML
 * leaves undefined, which costs the whole feed rather than one character.
 *
 * Decoding is strict so that a trailing semicolon is required: the legacy HTML
 * rules resolve `&copy` on its own, turning the `&copy=1` of a query string
 * into `©=1`.
 */
export function escapeFeedText(text: string): string {
  return decodeHTMLStrict(text)
    .replace(FORBIDDEN_XML_CHARS, '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function renderBlocks(blocks: Block[], format: FeedFormat): string {
  if (format === 'text') {
    return blocks
      .map(block =>
        block.type === 'list'
          ? renderList(block, format)
          : escapeFeedText(block.text)
      )
      .filter(Boolean)
      .join(PLAIN_PARAGRAPH_BREAK)
  }

  let html = ''

  blocks.forEach((block, index) => {
    const rendered =
      block.type === 'list'
        ? renderList(block, format)
        : escapeFeedText(block.text).replaceAll('\n', '<br />')

    if (!rendered) {
      return
    }

    if (html) {
      // Lists are block elements in the clients' rich text renderer and bring
      // their own spacing, so an explicit break next to one adds a blank line.
      const adjacentToList =
        block.type === 'list' || blocks[index - 1]?.type === 'list'
      html += adjacentToList ? '' : PARAGRAPH_BREAK
    }

    html += rendered
  })

  return html
}

function renderList(
  block: Extract<Block, { type: 'list' }>,
  format: FeedFormat
): string {
  if (format === 'text') {
    return block.items
      .map(item =>
        item
          .map(child =>
            child.type === 'list'
              ? renderList(child, format)
              : escapeFeedText(child.text)
          )
          .filter(Boolean)
          .join('\n')
      )
      .filter(Boolean)
      .map((item, index) => {
        const marker = block.ordered ? `${index + 1}. ` : '• '
        // Continuation lines and nested items hang under the marker.
        return marker + item.replaceAll('\n', '\n  ')
      })
      .join('\n')
  }

  const items = block.items
    .map(item => renderBlocks(item, format))
    .filter(Boolean)
    .map(item => `<li>${item}</li>`)
    .join('')

  if (!items) {
    return ''
  }

  const tag = block.ordered ? 'ol' : 'ul'

  return `<${tag}>${items}</${tag}>`
}

/**
 * Escapes every string Ghost supplies, in place, skipping the keys whose values
 * are generated here. The news feeds lose Ghost's CDATA wrappers on parse and
 * are rebuilt with entity processing off, so an unescaped `&` in a title would
 * otherwise be re-served as invalid XML.
 */
export function escapeUpstreamValues(
  value: unknown,
  skipKeys: ReadonlySet<string>
): unknown {
  if (typeof value === 'string') {
    return escapeFeedText(value)
  }

  if (Array.isArray(value)) {
    return value.map(entry => escapeUpstreamValues(entry, skipKeys))
  }

  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (skipKeys.has(key)) {
        continue
      }

      escapeChild(value as Record<string, unknown>, key, child, skipKeys)
    }
  }

  return value
}

function escapeChild(
  container: Record<string, unknown>,
  key: string,
  child: unknown,
  skipKeys: ReadonlySet<string>
): void {
  const escaped = escapeUpstreamValues(child, skipKeys)

  // Attribute values are re-serialised inside double quotes.
  container[key] =
    key.startsWith('@_') && typeof escaped === 'string'
      ? escaped.replaceAll('"', '&quot;')
      : escaped
}

/**
 * Applies the generated fields only inside `<item>`. `description` names both
 * an item and a channel element, so skipping it channel-wide would re-serve
 * Ghost's publication description with its `&` unescaped.
 */
export function escapeUpstreamChannel(
  channel: Record<string, unknown>,
  generatedItemFields: ReadonlySet<string>
): void {
  for (const [key, child] of Object.entries(channel)) {
    escapeChild(
      channel,
      key,
      child,
      key === 'item' ? generatedItemFields : NO_SKIPPED_KEYS
    )
  }
}

const NO_SKIPPED_KEYS: ReadonlySet<string> = new Set()

export function renderFeedContent(
  html: string,
  format: FeedFormat
): FeedContent {
  if (!html) {
    return { body: '', link: null }
  }

  const tokens = tokenize(html)
  const link = findLinkToken(tokens)
  const blocks = parseBlocks(
    tokens,
    { index: 0 },
    link?.tokenIndex ?? -1,
    new Set(),
    new Set()
  )

  return {
    body: renderBlocks(blocks, format),
    link: link ? { href: link.href, label: link.label } : null,
  }
}
