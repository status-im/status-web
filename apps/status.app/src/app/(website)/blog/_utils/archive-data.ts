import { cache } from 'react'

import { unstable_cache } from 'next/cache'
import { redirect } from 'next/navigation'

import { clientEnv } from '~/config/env.client.mjs'
import { getPostsByAuthorSlug, getPostsByTagSlug } from '~website/_lib/ghost'
import { cacheGhostResult } from '~website/_lib/ghost/cache'

type ArchiveKind = 'author' | 'tag'

function createArchiveReader<Result>(
  kind: ArchiveKind,
  read: (slug: string, page: number) => Promise<Result | undefined>
) {
  const readCached = unstable_cache(
    async (slug: string, page: number) => (await read(slug, page)) ?? null,
    ['blog-archive', clientEnv.NEXT_PUBLIC_GHOST_API_URL, kind],
    { revalidate: 3600 }
  )

  // Metadata and the archive page share the same result. A failed refresh
  // leaves a previously successful result in the Data Cache.
  return cache(async (slug: string, page: number) => {
    try {
      return await readCached(slug, page)
    } catch (error) {
      console.error(`Failed to fetch blog ${kind} archive from Ghost:`, error)
      return undefined
    }
  })
}

export const readAuthorArchive = createArchiveReader(
  'author',
  getPostsByAuthorSlug
)
export const readTagArchive = createArchiveReader('tag', getPostsByTagSlug)

const retryArchive = cacheGhostResult(
  'blog archive maintenance',
  async () => null
)

export async function redirectToArchiveMaintenance(
  kind: ArchiveKind,
  slug: string,
  page: number
): Promise<never> {
  await retryArchive()
  const pagination = page > 1 ? `/page/${page}` : ''
  redirect(`/blog/maintenance/${kind}/${encodeURIComponent(slug)}${pagination}`)
}
