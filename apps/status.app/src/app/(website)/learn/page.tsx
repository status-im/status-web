import { Text } from '@status-im/components'
import { getTranslations } from 'next-intl/server'

import { jsonLD, JSONLDScript } from '~/utils/json-ld'
import { Metadata } from '~app/_metadata'
import { Body } from '~components/body'
import { getLearnPosts } from '~website/_lib/ghost'
import { PostCard } from '~website/blog/_components/post-card'

import type { Metadata as NextMetadata } from 'next'

export const dynamic = 'force-dynamic'

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
  const { posts } = await getLearnPosts({ limit: 100 })

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

            {posts.length > 0 ? (
              <div className="grid auto-rows-[1fr] grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="rounded-20 border border-neutral-10 bg-white-100 p-6 shadow-1">
                <Text size={19}>{t('noPosts')}</Text>
              </div>
            )}
          </div>
        </div>
      </Body>
    </>
  )
}
