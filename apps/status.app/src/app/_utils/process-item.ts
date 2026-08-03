import { escapeFeedText, renderFeedContent } from './feed-content'

/** Fields this module rewrites; their markup must not be escaped again. */
export const GENERATED_ITEM_FIELDS: ReadonlySet<string> = new Set([
  'content:encoded',
  'description',
  'newsLink',
  'newsLinkLabel',
])

export function processItem(item: any) {
  const content = renderFeedContent(item['content:encoded'] ?? '')
  const description = renderFeedContent(item.description ?? '')
  const link = content.link ?? description.link

  item.newsLink = link ? escapeFeedText(link.href) : undefined
  item.newsLinkLabel = link ? escapeFeedText(link.label) : undefined
  item['content:encoded'] = content.html
  item.description = description.html
}
