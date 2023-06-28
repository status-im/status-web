import { Avatar, Button, Text } from '@status-im/components'
import { useInfiniteQuery } from '@tanstack/react-query'

// import { redirect } from 'next/navigation'
// import { useRouter } from 'next/router'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { AppLayout } from '@/layouts/app-layout'
import { getAuthorSlugs, getPostsByAuthorSlug } from '@/lib/ghost'

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
    breadcrumbs: BreadcrumbsProps['items']
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

  // root
  const breadcrumbs = [
    {
      label: 'Blog',
      href: '/blog',
    },
    {
      label: posts[0].primary_author!.name ?? posts[0].primary_author!.slug,
      href: `/blog/author/${posts[0].slug}`,
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

const BlogAuthorPage: Page<Props> = ({ posts, meta, breadcrumbs }) => {
  // const { isFallback } = useRouter()

  // if (isFallback || !posts.length) {
  //   redirect('/blog')
  // }

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
    initialData: { pages: [{ posts, meta }], pageParams: [1] },
    staleTime: Infinity,
  })

  if (!data) {
    return null
  }

  const allPosts = data.pages.flatMap(page => page.posts)

  return (
    <div className="min-h-[900px] rounded-3xl bg-white-100 lg:mx-1">
      <div className="border-b border-neutral-10 px-5 py-[13px]">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="px-5">
        <div className="mx-auto max-w-[1184px] pb-24 pt-12 lg:pb-32 lg:pt-20">
          <div className="mb-12 grid gap-2">
            <Avatar
              type="user"
              size={56}
              name={author.name ?? author.slug}
              src={author.profile_image ?? undefined}
            />
            <h1 className="text-40 lg:text-64">{author.name}</h1>
            <Text size={19}>{author.meta_description}</Text>
          </div>

          <div className="grid auto-rows-[1fr] grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5">
            {allPosts.map(post => (
              <PostCard key={post.id} post={post} showAuthor={false} />
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

BlogAuthorPage.getLayout = AppLayout

export default BlogAuthorPage
