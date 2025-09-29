import { Text } from '@status-im/components'

import { Body } from '~components/body'
import { Link } from '~components/link'
import { getPosts } from '~website/_lib/ghost'

import { HighlightedPostCard } from './_components/highlighted-post-card'
import { InfinitePostGrid } from './_components/infinite-post-grid'
import { TAGS } from './_tags'

export const revalidate = 3600 // 1 hour

export default async function BlogPage() {
  const { posts: initialPosts, meta } = await getPosts()

  const highlightedPost = initialPosts[0]

  return (
    <Body>
      <div className="px-5">
        <div className="mx-auto max-w-[1184px] pb-24 pt-12 xl:pb-32 xl:pt-20">
          <div className="mb-10 grid gap-2">
            <h1 className="text-40 font-bold xl:text-64">Blog.</h1>
            <Text size={19}>Long form articles, thoughts, and ideas.</Text>
          </div>

          <div className="-ml-5 -mr-8 flex gap-2 overflow-x-scroll pb-12 pl-5 pr-8 scrollbar-none">
            {Object.values(TAGS).map(({ id, slug, icon, name }) => (
              <div key={id} className="shrink-0">
                <Link
                  href={`/blog/tag/${slug}`}
                  className="flex h-[32px] select-none items-center gap-2 rounded-10 border border-solid border-neutral-30 pl-2 pr-3 shadow-1 active:border-neutral-50 hover:border-neutral-40"
                  scroll={false}
                >
                  {icon}
                  <Text size={15} weight="medium">
                    {name}
                  </Text>
                </Link>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-[44px] 2xl:mb-12">
              {highlightedPost && (
                <HighlightedPostCard post={highlightedPost} />
              )}
            </div>

            <InfinitePostGrid
              type="posts"
              initialPosts={initialPosts}
              meta={meta}
              queryKey="all"
              skip={1}
            />
          </div>
        </div>
      </div>
    </Body>
  )
}
