import { Button, Text } from '@status-im/components'
import { useInfiniteQuery } from '@tanstack/react-query'

import { Breadcrumbs } from '@/components'
import { AppLayout } from '@/layouts/app-layout'
import { getPostsByTagSlug, getTagSlugs } from '@/lib/ghost'

import { PostCard } from '..'

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

  return {
    props: {
      posts,
      meta,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const BlogTagPage: Page<Props> = ({ posts, meta }) => {
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
    initialData: { pages: [{ posts, meta }], pageParams: [0] },
    staleTime: Infinity,
  })

  if (!data) {
    return null
  }

  const _posts = data.pages.flatMap(page => page.posts)

  return (
    <div className="bg-white-100 mx-1 min-h-[900px] rounded-3xl">
      <div className="border-neutral-10 border-b px-5 py-3">
        {/* todo?: cut second segment */}
        <Breadcrumbs cutFirstSegment={false} />
      </div>

      <div className="mx-auto max-w-[1192px] py-32">
        <div className="mb-8 grid gap-2">
          {/* todo: tag icon */}
          <h1 className="text-7xl font-bold">{tag.name}</h1>
          <Text size={19}>{tag.description}</Text>
        </div>

        <div className="mt-12 grid auto-rows-[1fr] grid-cols-[repeat(auto-fill,minmax(384px,1fr))] gap-5">
          {_posts.map(post => (
            <PostCard key={post.id} post={post} showTag={false} />
          ))}
        </div>
      </div>

      {hasNextPage && (
        <div className="flex justify-center pt-8">
          <Button variant="outline" onPress={() => fetchNextPage()}>
            Load more posts
          </Button>
        </div>
      )}
    </div>
  )
}

BlogTagPage.getLayout = AppLayout

export default BlogTagPage
