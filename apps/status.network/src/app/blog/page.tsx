import { Metadata } from '~app/_metadata'
import { jsonLD, JSONLDScript } from '~app/_utils/json-ld'
import { HighlightedPostCard, PostCard } from './_components/post-card'
import { getPosts } from './_lib/ghost'

export const revalidate = 3600 // 1 hour

export const metadata = Metadata({
  title: 'Blog',
  description: 'Long form articles, thoughts, and ideas.',
  pathname: '/blog',
})

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function BlogPage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const selectedTag =
    typeof resolvedParams.tag === 'string' ? resolvedParams.tag : undefined

  const { posts } = await getPosts({ limit: 12, tag: selectedTag })

  const highlightedPost = posts[0]
  const listedPosts = posts.slice(1)

  const websiteSchema = jsonLD.website({
    '@id': 'https://status.network/blog/#website',
    name: 'Status Network Blog',
    url: 'https://status.network/blog',
    description: 'Long form articles, thoughts, and ideas.',
    publisher: {
      '@id': 'https://status.network/#organization',
    },
  })

  return (
    <>
      <JSONLDScript schema={websiteSchema} />
      <div className="px-5">
        <div className="mx-auto max-w-[1184px] pb-20 pt-10 xl:pb-28 xl:pt-16">
          <div className="mb-8 grid gap-2">
            <h1 className="text-40 font-700 xl:text-64">Blog.</h1>
            <p className="text-19 text-neutral-80/60">
              Long form articles, thoughts, and ideas.
            </p>
          </div>

          {highlightedPost ? (
            <>
              <div className="mb-10 xl:mb-12">
                <HighlightedPostCard post={highlightedPost} />
              </div>

              {listedPosts.length > 0 && (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {listedPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-20 border border-neutral-20 bg-neutral-10 p-6">
              <p className="text-19">No posts available yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
