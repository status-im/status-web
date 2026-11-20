import { SITE_URL } from '~/config/site'
import { allHelpDocs, allSpecsDocs } from '~content'
import { listedArchivePosts } from '~website/_lib/blog-archive'

import { isHelpDocWorkInProgress } from './_utils/help-doc'

import type { MetadataRoute } from 'next'

export const revalidate = 3600

const BASE_URL = SITE_URL

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

export default function sitemap(): MetadataRoute.Sitemap {
  const buildDate = new Date()

  const entries = new Map<string, Date>()

  for (const path of STATIC_PATHS) {
    entries.set(toUrl(path), buildDate)
  }

  for (const post of listedArchivePosts) {
    entries.set(
      toUrl(`/blog/${post.slug}`),
      toDate(post.updated_at ?? post.published_at)
    )
  }

  for (const doc of allHelpDocs) {
    // Skip placeholder docs: they carry no content and are marked `noindex`,
    // so listing them in the sitemap would only surface thin pages to crawlers.
    if (isHelpDocWorkInProgress(doc)) {
      continue
    }
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
