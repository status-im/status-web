import { Button, Text } from '@status-im/components'
import { useInfiniteQuery } from '@tanstack/react-query'
import title from 'title'

import { Breadcrumbs } from '@/components/breadcrumbs'
import { AppLayout } from '@/layouts/app-layout'
import { getPostsByTagSlug, getTagSlugs } from '@/lib/ghost'

import { PostCard } from '..'

import type { BreadcrumbsProps } from '@/components/breadcrumbs'
import type { PostOrPage, PostsOrPages } from '@tryghost/content-api'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  Page,
} from 'next'

type Params = { slug: string }

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const slugs = await getTagSlugs()

  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    /** If fallback is false, then any paths not returned by getStaticPaths will result in a 404 page.
     *
     * @see https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-false
     */
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<
  {
    posts: PostOrPage[]
    meta: PostsOrPages['meta']
    breadcrumbs: BreadcrumbsProps['items']
  },
  Params
> = async context => {
  const { posts, meta } = await getPostsByTagSlug(context.params!.slug)

  if (!posts || !posts.length) {
    return {
      notFound: true,
      // redirect: { destination: '/blog', permanent: false },
    }
  }

  // root
  const breadcrumbs = [
    {
      label: 'Blog',
      href: '/blog',
    },
    {
      label: title(context.params!.slug),
      href: `/blog/tag/${context.params!.slug}`,
    },
  ]

  return {
    props: {
      posts,
      meta,
      breadcrumbs,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const BlogTagPage: Page<Props> = (props: Props) => {
  const { posts, meta, breadcrumbs } = props

  const tag = posts[0].primary_tag!

  const {
    data,
    // error,
    fetchNextPage,
    hasNextPage,
    // isFetching,
    // isFetchingNextPage,
    // status,
    // isFetched,
  } = useInfiniteQuery({
    queryKey: ['posts', tag.slug],
    queryFn: async ({ pageParam: page, queryKey }) => {
      const [, tag] = queryKey

      const { posts, meta } = await getPostsByTagSlug(tag, page)

      return { posts, meta }
    },
    getNextPageParam: ({ meta }) => meta.pagination.next,
    initialData: { pages: [{ posts, meta }], pageParams: [1] },
    staleTime: Infinity,
  })

  if (!data) {
    return null
  }

  const allPosts = data.pages.flatMap(page => page.posts)

  return (
    // layout 1 (showBreadcrumbs, showHighlightedPostCard, ?posts=renderPosts())
    <div className="min-h-[900px] rounded-3xl bg-white-100 lg:mx-1">
      {/* layout 2 */}
      {/* breadcumbs */}
      <div className="border-b border-neutral-10 px-5 py-[13px]">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="px-5">
        <div className="mx-auto max-w-[1184px] pb-24 pt-12 lg:pb-32 lg:pt-20">
          {/* content */}
          {/* note: diff mb than index.ts (mb-12 vs. mb-10) */}
          <div className="mb-12 grid gap-2">
            <h1 className="text-40 tracking-[-.02em] lg:text-64">{tag.name}</h1>
            <Text size={19}>{tag.description}</Text>
          </div>

          <div className="grid auto-rows-[1fr] grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5">
            {allPosts.map(post => (
              <PostCard key={post.id} post={post} showTag={false} />
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" onPress={() => fetchNextPage()}>
                Load more posts
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

BlogTagPage.getLayout = AppLayout

export default BlogTagPage
