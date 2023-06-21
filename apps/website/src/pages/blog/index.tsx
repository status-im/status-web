import { useMemo } from 'react'

import { Avatar, Button, Shadow, Tag, Text } from '@status-im/components'
import { useInfiniteQuery } from '@tanstack/react-query'

// import Image from 'next/image'
import { formatDate } from '@/components/chart/utils/format-time'
import { Link } from '@/components/link'
import { AppLayout } from '@/layouts/app-layout'
import { getPosts } from '@/lib/ghost'

import type { PostOrPage, PostsOrPages } from '@tryghost/content-api'
import type { GetStaticProps, InferGetStaticPropsType, Page } from 'next'

export const getStaticProps: GetStaticProps<{
  posts: PostOrPage[]
  meta: PostsOrPages['meta']
}> = async () => {
  const { posts, meta } = await getPosts()

  return {
    props: {
      posts,
      meta,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const BlogPage: Page<Props> = props => {
  const { posts, meta } = props

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
    queryKey: ['posts'],
    queryFn: async ({ pageParam: page }) => await getPosts({ page }),
    getNextPageParam: ({ meta }) => meta.pagination.next,
    initialData: { pages: [{ posts, meta }], pageParams: [1] },
    staleTime: Infinity,
  })

  const { highlightedPost, visiblePosts } = useMemo(() => {
    const [highlightedPost, ...posts] = data!.pages.flatMap(page => page.posts)
    const maxLength = posts.length - (posts.length % 3) // the number of posts should be divisible by 3
    const visiblePosts = posts.slice(0, maxLength)
    return { highlightedPost, visiblePosts }
  }, [data])

  return (
    <div className="min-h-[900px] rounded-3xl bg-white-100 lg:mx-1">
      <div className="px-5">
        <div className="mx-auto max-w-[1184px] pb-24 pt-12 lg:pb-32 lg:pt-20">
          <div className="mb-10 grid gap-2">
            <h1 className="text-[40px] font-bold leading-[44px] tracking-[-.02em] lg:text-[64px] lg:leading-[68px]">
              Blog.
            </h1>
            <Text size={19}>Long form articles, thoughts, and ideas.</Text>
          </div>

          <div>
            <div className="mb-[44px] xl:mb-12">
              <HighlightedPostCard post={highlightedPost} />
            </div>

            <div className="grid auto-rows-[1fr] grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5">
              {visiblePosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
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

type HighlightedPostCardProps = {
  post: PostOrPage
}

export const HighlightedPostCard = (props: HighlightedPostCardProps) => {
  const { post } = props
  const author = post.primary_author!

  return (
    // <Link href={`/blog/${post.slug}`} className="flex flex-row-reverse gap-7">
    <Link
      href={`/blog/${post.slug}`}
      className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-7"
    >
      <div className="col-span-2 w-full flex-[2] shrink-0">
        <img
          className="aspect-[366/206] h-full w-full rounded-2xl object-cover"
          src={post.feature_image!}
          alt={post.feature_image_alt!}
        />
      </div>

      <div className="flex flex-[1] flex-col gap-2 xl:py-5 xl:pr-5">
        <div className="h-6 overflow-hidden">
          {post.primary_tag && (
            <div className="flex">
              <Tag size={24} label={post.primary_tag.name!} />
            </div>
          )}
        </div>

        <div>
          <span className="text-[27px] font-semibold leading-[32px] tracking-[-.021em] lg:text-[40px] lg:font-bold lg:leading-[44px] lg:tracking-[-.02em]">
            {post.title}
          </span>
        </div>

        <div>
          <Text size={19} weight="regular">
            {post.excerpt}
          </Text>
        </div>

        <div className="mt-auto flex h-5 items-center gap-1">
          <Avatar
            type="user"
            size={20}
            name={author.name ?? author.slug}
            src={author.profile_image ?? undefined}
          />
          <Text size={15} weight="semibold">
            {author.name ?? author.slug}
          </Text>
          <Text size={15} color="$neutral-50">
            on {formatDate(new Date(post.published_at!))}
          </Text>
        </div>
      </div>
    </Link>
  )
}

type PostCardProps = {
  post: PostOrPage
  showTag?: boolean
  showAuthor?: boolean
}

export const PostCard = (props: PostCardProps) => {
  const { post, showTag = true, showAuthor = true } = props
  const author = post.primary_author!

  return (
    <Shadow className="h-full rounded-[20px]">
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full w-full flex-col rounded-[20px] border border-neutral-5 bg-white-100"
      >
        <div className="flex grow flex-col gap-2 p-4">
          {showTag && (
            <div className="h-6 overflow-hidden">
              {post.primary_tag && (
                <div className="flex">
                  <Tag size={24} label={post.primary_tag.name!} />
                </div>
              )}
            </div>
          )}

          <div>
            <Text size={19} weight="semibold">
              {post.title}
            </Text>
          </div>

          {showAuthor ? (
            <div className="mt-auto flex h-5 gap-1">
              <Avatar
                type="user"
                size={20}
                name={author.name ?? author.slug}
                src={author.profile_image ?? undefined}
              />
              <Text size={15} weight="semibold">
                {author.name ?? author.slug}
              </Text>
              <Text size={15} color="$neutral-50">
                on {formatDate(new Date(post.published_at!))}
              </Text>
            </div>
          ) : (
            <div className="mt-auto h-5">
              <Text size={15} color="$neutral-50">
                {formatDate(new Date(post.published_at!))}
              </Text>
            </div>
          )}
        </div>

        <div className="w-full px-2 pb-2">
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            className="aspect-[334/188] h-full w-full rounded-2xl object-cover"
            src={post.feature_image!}
          />
        </div>
      </Link>
    </Shadow>
  )
}

BlogPage.getLayout = AppLayout

export default BlogPage
