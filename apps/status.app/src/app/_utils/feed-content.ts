/**
 * Converts Ghost post HTML into the small HTML subset the Status desktop and
 * mobile clients render for news notifications.
 *
 * status-go parses `<description>` with gofeed and hands the decoded element to
 * the client, so the markup this module writes is what the client renders. It
 * stays well-formed by construction: text nodes are escaped and the only tags
 * in the output are the ones written here. A parsing mistake can misplace text
 * but cannot leave a tag unbalanced in front of the client's renderer.
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

type Inline =
  | { kind: 'text'; value: string }
  | { kind: 'link'; href: string; label: string }

type Block =
  | { type: 'text'; inlines: Inline[] }
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
  let buffer: Inline[] = []

  const pushText = (value: string) => {
    const last = buffer.at(-1)
    if (last?.kind === 'text') {
      last.value += value
    } else {
      buffer.push({ kind: 'text', value })
    }
  }

  const flush = () => {
    const inlines = normalizeInlines(buffer)
    buffer = []
    if (inlines.length) {
      blocks.push({ type: 'text', inlines })
    }
  }

  while (cursor.index < tokens.length) {
    const token = tokens[cursor.index]

    if (token.kind === 'text') {
      cursor.index++
      pushText(collapseWhitespace(token.value))
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
      pushText('\n')
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
      const href = getAttribute(token.attributes, 'href')
      skipElement(tokens, cursor, 'a')
      // The CTA is surfaced as its own feed element, so its label must not be
      // repeated in the body.
      if (tokenIndex === linkTokenIndex) {
        continue
      }
      if (href) {
        buffer.push({ kind: 'link', href, label })
      } else {
        pushText(label)
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

/**
 * Collapses the runs of spaces a suppressed anchor or a block boundary leaves
 * behind and trims the block's edges. `\n` marks a `<br>` and has to survive.
 */
function normalizeInlines(inlines: Inline[]): Inline[] {
  const collapsed = inlines
    .map(inline =>
      inline.kind === 'text'
        ? { ...inline, value: inline.value.replace(/[^\S\n]+/g, ' ') }
        : inline
    )
    .filter(inline => inline.kind !== 'text' || inline.value !== '')

  const first = collapsed.at(0)
  if (first?.kind === 'text') {
    first.value = first.value.replace(/^\s+/, '')
  }
  const last = collapsed.at(-1)
  if (last?.kind === 'text') {
    last.value = last.value.replace(/\s+$/, '')
  }

  return collapsed.filter(
    inline => inline.kind !== 'text' || inline.value !== ''
  )
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
  return escapeXml(decodeHTMLStrict(text).replace(FORBIDDEN_XML_CHARS, ''))
}

/** The body's anchors quote their `href`, so it may not carry a bare `"`. */
function escapeFeedAttribute(value: string): string {
  return escapeFeedText(value).replaceAll('"', '&quot;')
}

/** Escapes without decoding, so it can be applied on top of `escapeFeedText`. */
function escapeXml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

/**
 * RSS 2.0 defines `description` as character data, so the desktop feed's markup
 * is escaped on its way into the XML tree rather than served as child elements.
 * status-go decodes the element with gofeed before handing it to the client,
 * which therefore receives the same markup as it did before. The mobile feed
 * carries no markup and is already character data.
 */
export function serializeFeedBody(body: string, format: FeedFormat): string {
  return format === 'html' ? escapeXml(body) : body
}

/**
 * The mobile client cannot follow a link in plain text, so an anchor keeps only
 * its label there. The desktop client is given the anchor itself.
 */
function renderInlines(inlines: Inline[], format: FeedFormat): string {
  return inlines
    .map(inline => {
      if (inline.kind === 'link') {
        const label = escapeFeedText(inline.label)
        return format === 'text'
          ? label
          : `<a href="${escapeFeedAttribute(inline.href)}">${label}</a>`
      }

      const text = escapeFeedText(inline.value)
      return format === 'text' ? text : text.replaceAll('\n', '<br />')
    })
    .join('')
}

function renderBlocks(blocks: Block[], format: FeedFormat): string {
  if (format === 'text') {
    return blocks
      .map(block =>
        block.type === 'list'
          ? renderList(block, format)
          : renderInlines(block.inlines, format)
      )
      .filter(Boolean)
      .join(PLAIN_PARAGRAPH_BREAK)
  }

  let html = ''

  blocks.forEach((block, index) => {
    const rendered =
      block.type === 'list'
        ? renderList(block, format)
        : renderInlines(block.inlines, format)

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
              : renderInlines(child.inlines, format)
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
