/**
 * Imports content fixtures from `content/**` into the Payload database so
 * editors can find and modify them in Admin.
 */
import { getPayload } from 'payload'

import {
  getAllPageCopy,
  getFooter,
  getNavigationContent,
  getSiteSettings,
  type PageCopyRecord,
} from '@status-im/content/loaders'
import type { Footer, Navigation, SiteSettings } from '@status-im/content/schemas'

import config from '@payload-config'
import { SKIP_CONTENT_PR_CONTEXT } from '../src/collections/content-pr-hooks'

type SyncResult = { created: number; updated: number; skipped: number }

const mapPage = (
  record: PageCopyRecord
): Record<string, unknown> & { slug: string } => ({
  slug: record.slug,
  route: record.page.route,
  title: record.page.title,
  page: record.page,
})

const mapSiteSettings = (
  settings: SiteSettings
): Record<string, unknown> & { slug: string } => ({
  slug: 'settings',
  settings,
})

const mapSiteNavigation = (
  navigation: Navigation
): Record<string, unknown> & { slug: string } => ({
  slug: 'navigation',
  navigation,
})

const mapSiteFooter = (
  footer: Footer
): Record<string, unknown> & { slug: string } => ({
  slug: 'footer',
  footer,
})

type PayloadInstance = Awaited<ReturnType<typeof getPayload>>

const upsertByField = async (
  payload: PayloadInstance,
  collection: string,
  field: string,
  value: string,
  data: Record<string, unknown>
): Promise<'created' | 'updated'> => {
  const found = await payload.find({
    collection: collection as Parameters<
      PayloadInstance['find']
    >[0]['collection'],
    where: { [field]: { equals: value } },
    limit: 1,
    depth: 0,
  })
  if (found.docs.length > 0) {
    await payload.update({
      collection: collection as Parameters<
        PayloadInstance['update']
      >[0]['collection'],
      id: found.docs[0]!.id,
      data: data as never,
      context: { [SKIP_CONTENT_PR_CONTEXT]: true },
    })
    return 'updated'
  }
  await payload.create({
    collection: collection as Parameters<
      PayloadInstance['create']
    >[0]['collection'],
    data: data as never,
    context: { [SKIP_CONTENT_PR_CONTEXT]: true },
  })
  return 'created'
}

const upsertBySlug = async (
  payload: PayloadInstance,
  collection: string,
  data: Record<string, unknown> & { slug: string }
): Promise<'created' | 'updated'> => {
  return upsertByField(payload, collection, 'slug', data.slug, data)
}

const syncSingleton = async <TData extends Record<string, unknown>>(
  payload: PayloadInstance,
  collectionSlug: string,
  field: string,
  value: string,
  data: TData
): Promise<SyncResult> => {
  try {
    const op = await upsertByField(payload, collectionSlug, field, value, data)
    return {
      created: op === 'created' ? 1 : 0,
      updated: op === 'updated' ? 1 : 0,
      skipped: 0,
    }
  } catch (err) {
    console.error(
      `  ✗ ${collectionSlug}/${value}: ${
        err instanceof Error ? err.message : String(err)
      }`
    )
    return { created: 0, updated: 0, skipped: 1 }
  }
}

const syncCollection = async <T extends { slug: string }>(
  payload: PayloadInstance,
  collectionSlug: string,
  list: () => Promise<T[]>,
  map: (item: T) => Record<string, unknown> & { slug: string }
): Promise<SyncResult> => {
  const items = await list()
  const result: SyncResult = { created: 0, updated: 0, skipped: 0 }
  for (const item of items) {
    try {
      const op = await upsertBySlug(payload, collectionSlug, map(item))
      result[op]++
    } catch (err) {
      console.error(
        `  ✗ ${collectionSlug}/${item.slug}: ${
          err instanceof Error ? err.message : String(err)
        }`
      )
      result.skipped++
    }
  }
  return result
}

const main = async (): Promise<void> => {
  const payload = await getPayload({ config })

  const targets = [
    {
      name: 'pages',
      run: () =>
        syncCollection(payload, 'pages', () => getAllPageCopy('en'), mapPage),
    },
    {
      name: 'site-settings',
      run: async () =>
        syncSingleton(
          payload,
          'site-settings-content',
          'slug',
          'settings',
          mapSiteSettings(await getSiteSettings('en'))
        ),
    },
    {
      name: 'site-navigation',
      run: async () =>
        syncSingleton(
          payload,
          'site-navigation-content',
          'slug',
          'navigation',
          mapSiteNavigation(await getNavigationContent('en'))
        ),
    },
    {
      name: 'site-footer',
      run: async () =>
        syncSingleton(
          payload,
          'site-footer-content',
          'slug',
          'footer',
          mapSiteFooter(await getFooter('en'))
        ),
    },
  ]

  for (const target of targets) {
    process.stdout.write(`${target.name.padEnd(20)} `)
    const result = await target.run()
    console.log(
      `created=${result.created}, updated=${result.updated}, skipped=${result.skipped}`
    )
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
