import {
  escapeFeedText,
  renderFeedContent,
  serializeFeedBody,
} from './feed-content'

import type { FeedFormat } from './feed-content'

/**
 * The call-to-action has no RSS 2.0 equivalent, so it is carried in a namespace
 * of ours. RSS 2.0 rejects an extension element that has no namespace, and
 * gofeed reads a namespaced one from `item.Extensions` rather than
 * `item.Custom`, so status-go has to be updated in step with this prefix.
 */
export const NEWS_NAMESPACE_PREFIX = 'status'
export const NEWS_NAMESPACE_URI = 'https://status.app/ns/rss/1.0'

const LINK_FIELD = `${NEWS_NAMESPACE_PREFIX}:newsLink`
const LINK_LABEL_FIELD = `${NEWS_NAMESPACE_PREFIX}:newsLinkLabel`

/** Fields this module rewrites; their markup must not be escaped again. */
export const GENERATED_ITEM_FIELDS: ReadonlySet<string> = new Set([
  'content:encoded',
  'description',
  LINK_FIELD,
  LINK_LABEL_FIELD,
])

export function processItem(item: any, format: FeedFormat) {
  const content = renderFeedContent(item['content:encoded'] ?? '', format)
  const description = renderFeedContent(item.description ?? '', format)
  const link = content.link ?? description.link

  item[LINK_FIELD] = link ? escapeFeedText(link.href) : undefined
  item[LINK_LABEL_FIELD] = link ? escapeFeedText(link.label) : undefined
  item['content:encoded'] = serializeFeedBody(content.body, format)
  item.description = serializeFeedBody(description.body, format)
}
