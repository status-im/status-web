import { baseUrl } from '~website/_lib/base-url'
import { getPosts } from '~website/_lib/ghost'

const FEED_ITEM_LIMIT = 20
const FEED_TITLE = 'Status'
const FEED_SUBTITLE =
  'The open-source, decentralised wallet and messenger. Own your crypto and chat privately.'

export const revalidate = 3600

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toIso(date: string | undefined | null): string {
  if (!date) return new Date().toISOString()
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString()
    : parsed.toISOString()
}

export async function GET() {
  const site = baseUrl()
  const feedUrl = `${site}/feed.xml`
  const { posts } = await getPosts({ limit: FEED_ITEM_LIMIT })

  const updated = toIso(posts[0]?.updated_at ?? posts[0]?.published_at)

  const entries = posts
    .filter(post => !!post.slug)
    .map(post => {
      const url = `${site}/blog/${post.slug}`
      const title = escapeXml(post.title ?? '')
      const published = toIso(post.published_at)
      const entryUpdated = toIso(post.updated_at ?? post.published_at)
      const summary = post.custom_excerpt ?? post.excerpt ?? ''
      const authors = (post.authors ?? [])
        .filter(author => !!author.name)
        .map(
          author =>
            `    <author><name>${escapeXml(author.name!)}</name></author>`
        )
        .join('\n')

      return [
        '  <entry>',
        `    <title>${title}</title>`,
        `    <link href="${escapeXml(url)}" />`,
        `    <id>${escapeXml(url)}</id>`,
        `    <published>${published}</published>`,
        `    <updated>${entryUpdated}</updated>`,
        ...(authors ? [authors] : []),
        `    <summary><![CDATA[${summary}]]></summary>`,
        '  </entry>',
      ].join('\n')
    })
    .join('\n')

  const xml = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    `  <title>${escapeXml(FEED_TITLE)}</title>`,
    `  <subtitle>${escapeXml(FEED_SUBTITLE)}</subtitle>`,
    `  <link href="${escapeXml(feedUrl)}" rel="self" />`,
    `  <link href="${escapeXml(site)}" />`,
    `  <id>${escapeXml(`${site}/`)}</id>`,
    `  <updated>${updated}</updated>`,
    entries,
    '</feed>',
  ].join('\n')

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  })
}
