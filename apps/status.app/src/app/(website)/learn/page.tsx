import { Text } from '@status-im/components'
import { getTranslations } from 'next-intl/server'

import { jsonLD, JSONLDScript } from '~/utils/json-ld'
import { Metadata } from '~app/_metadata'
import { Body } from '~components/body'
import { getLearnPosts } from '~website/_lib/ghost'
import { InfinitePostGrid } from '~website/blog/_components/infinite-post-grid'

import type { Metadata as NextMetadata } from 'next'

export const revalidate = 3600

export async function generateMetadata(): Promise<NextMetadata> {
  const t = await getTranslations('learn')

  return Metadata({
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: '/learn',
    },
  })
}

export default async function LearnPage() {
  const t = await getTranslations('learn')
  const { posts: initialPosts, meta } = await getLearnPosts()

  const websiteSchema = jsonLD.website({
    name: 'Status Learn',
    url: 'https://status.app/learn',
    description: t('description'),
  })

  return (
    <>
      <JSONLDScript schema={websiteSchema} />
      <Body>
        <div className="px-5">
          <div className="mx-auto max-w-[1184px] pb-24 pt-12 xl:pb-32 xl:pt-20">
            <div className="mb-10 grid gap-2">
              <h1 className="text-40 font-bold xl:text-64">{t('title')}</h1>
              <Text size={19}>{t('description')}</Text>
            </div>

            <InfinitePostGrid
              type="learn"
              initialPosts={initialPosts}
              meta={meta}
              queryKey="learn"
            />
          </div>
        </div>
      </Body>
    </>
  )
}
