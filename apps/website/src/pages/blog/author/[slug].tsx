import { Avatar, Button, Text } from '@status-im/components'
import { useInfiniteQuery } from '@tanstack/react-query'

// import { redirect } from 'next/navigation'
// import { useRouter } from 'next/router'
import { Breadcrumbs } from '@/components'
import { AppLayout } from '@/layouts/app-layout'
import { getAuthorSlugs, getPostsByAuthorSlug } from '@/lib/ghost'

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
  const slugs = await getAuthorSlugs()

  return {
    paths: slugs.map(slug => ({ params: { slug } })),
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
  const { posts, meta } = await getPostsByAuthorSlug(context.params!.slug)

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

const BlogAuthorPage: Page<Props> = ({ posts, meta }) => {
  // const { isFallback } = useRouter()

  // if (isFallback || !posts.length) {
  //   redirect('/blog')
  // }

  // todo?: enforce primary tag
  const author = posts[0].primary_author!

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
    queryKey: ['posts', author.slug],
    queryFn: async ({ pageParam: page, queryKey }) => {
      const [, tag] = queryKey

      const { posts, meta } = await getPostsByAuthorSlug(tag, page)

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
          <Avatar
            type="user"
            size={56}
            name={author.name ?? author.slug}
            src={author.profile_image ?? undefined}
          />
          <h1 className="text-7xl font-bold">{author.name}</h1>
          {/* todo?: no desc; enforce */}
          <Text size={19}>{author.meta_description}</Text>
        </div>

        <div className="mt-12 grid auto-rows-[1fr] grid-cols-[repeat(auto-fill,minmax(334px,1fr))] gap-5">
          {_posts.map(post => (
            <PostCard key={post.id} post={post} showAuthor={false} />
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

BlogAuthorPage.getLayout = AppLayout

export default BlogAuthorPage