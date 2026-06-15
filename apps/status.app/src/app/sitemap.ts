import { allHelpDocs, allSpecsDocs } from '~content'
import {
  getLearnPostsForSitemap,
  getPostsForSitemap,
} from '~website/_lib/ghost'

import type { MetadataRoute } from 'next'

// Cache the sitemap for 1 hour so /sitemap.xml does not hit the Ghost
// API on every request. Crawlers do not need second-by-second freshness.
export const revalidate = 3600

const BASE_URL = 'https://status.app'

const STATIC_PATHS = [
  '/',
  '/blog',
  '/snt',
  '/snt/release-schedule',
  '/snt/exchanges',
  '/keycard',
  '/apps',
  '/manifesto',
  '/security',
  '/team',
  '/jobs',
  '/brand',
  '/translations',
  '/insights/epics',
  '/learn',
  '/specs',
  '/help',
  '/help/getting-started',
  '/help/wallet',
  '/help/keycard',
  '/help/communities',
  '/help/messaging',
  '/help/profile',
  '/legal/terms-of-use',
  '/legal/privacy-policy',
] as const

function toUrl(path: string): string {
  return `${BASE_URL}${path}`
}

function toDate(value: string | Date | undefined): Date {
  if (!value) {
    return new Date()
  }
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? new Date() : date
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const buildDate = new Date()

  const [posts, learnPosts] = await Promise.all([
    getPostsForSitemap(),
    getLearnPostsForSitemap(),
  ])

  const entries = new Map<string, Date>()

  for (const path of STATIC_PATHS) {
    entries.set(toUrl(path), buildDate)
  }

  for (const post of posts) {
    entries.set(toUrl(`/blog/${post.slug}`), toDate(post.updatedAt))
  }

  for (const post of learnPosts) {
    entries.set(toUrl(`/blog/${post.slug}`), toDate(post.updatedAt))
  }

  for (const doc of allHelpDocs) {
    entries.set(toUrl(doc.url), toDate(doc.lastEdited))
  }

  for (const doc of allSpecsDocs) {
    entries.set(toUrl(doc.url), toDate(doc.lastEdited))
  }

  return Array.from(entries.entries()).map(([url, lastModified]) => ({
    url,
    lastModified,
  }))
}
