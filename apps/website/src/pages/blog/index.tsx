import { Avatar, Button, Shadow, Tag, Text } from '@status-im/components'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

import { formatDate } from '@/components/chart/utils/format-time'
import { Link } from '@/components/link'
import { AppLayout } from '@/layouts/app-layout'
import { getPosts, getTags } from '@/lib/ghost'

import type { PostOrPage, PostsOrPages, Tags } from '@tryghost/content-api'
import type { GetStaticProps, InferGetStaticPropsType, Page } from 'next'

export const getStaticProps: GetStaticProps<{
  tags: Tags
  posts: PostOrPage[]
  meta: PostsOrPages['meta']
}> = async () => {
  const { posts, meta } = await getPosts()
  const tags = await getTags()

  return {
    props: {
      tags,
      posts,
      meta,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const BlogPage: Page<Props> = props => {
  const { tags: initialTags, posts, meta } = props

  const tags = new Map<string, { name?: string; slug: string }>(
    initialTags.map(tag => [tag.slug, tag])
  )

  const router = useRouter()
  const { tag } = router.query as { tag?: string }

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
    queryKey: ['posts', tag],
    queryFn: async ({ pageParam: page, queryKey }) => {
      const [, tag] = queryKey

      const { posts, meta } = await getPosts({ page, tag })

      let filteredPosts = posts
      if (tag && tags.has(tag)) {
        filteredPosts = filteredPosts.filter(
          post => post.primary_tag?.slug === tag
        )
      }

      return { posts: filteredPosts, meta }
    },
    getNextPageParam: ({ meta }) => meta.pagination.next,
    ...(!tag && {
      initialData: { pages: [{ posts, meta }], pageParams: [0] },
      // staleTime: Infinity,
    }),
    staleTime: Infinity,
  })

  if (!data) {
    return null
  }

  const [highlightedPost, ...rest] =
    data?.pages.flatMap(page => page.posts) ?? []

  return (
    <div className="bg-white-100 mx-1 min-h-[900px] rounded-3xl p-5">
      <div className="mx-auto max-w-[1192px] py-32">
        <div className="mb-8 grid gap-2">
          <h1 className="text-7xl font-bold">Blog.</h1>
          <Text size={19}>Long form articles, thoughts, and ideas.</Text>
        </div>

        {/* todo?: radix toggle group; or combobox with cmdk */}
        <div className="mb-8 hidden gap-2">
          {[...tags.entries()].map(([id, tag]) => (
            // {/* {[...tags.values()].map(tag => ( */}
            <div
              key={id}
              // key={tag}
              // onClick={() => {
              //   console.log('click')
              // }}
            >
              <Shadow className="border-neutral-5 rounded-[20px] border">
                {/* todo: icon; if api provides or fallback? */}
                {/* <Tag size={24} label={tag.name} /> */}
                <Button
                  size={32}
                  variant="outline"
                  onPress={() => {
                    // const url = new URL(window.location.href)
                    // url.searchParams.set('tag', tag.slug)

                    // router.replace(url.pathname + url.search, undefined, {
                    //   scroll: false,
                    // })
                    router.replace(
                      { query: { ...router.query, tag: tag.slug } },
                      undefined,
                      { scroll: false }
                    )
                  }}
                >
                  {tag.name ?? tag.slug}
                </Button>
              </Shadow>
            </div>
          ))}
        </div>

        <div>
          <div>
            <HighlightedPostCard post={highlightedPost} />
          </div>

          <div className="mt-12 grid auto-rows-[1fr] grid-cols-[repeat(auto-fill,minmax(384px,1fr))] gap-5">
            {rest.map(post => (
              <PostCard key={post.id} post={post} />
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
      className="grid grid-cols-1 gap-7 xl:grid-cols-3"
    >
      <div className="col-span-2 w-full flex-[2] shrink-0">
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img
          className="aspect-[366/206] h-full w-full rounded-2xl object-cover"
          src={post.feature_image!}
        />
      </div>

      <div className="flex flex-[1] flex-col gap-2 p-0">
        <div className="h-6 overflow-hidden">
          {post.primary_tag && (
            <div className="flex">
              <Tag size={24} label={post.primary_tag.name!} />
            </div>
          )}
        </div>

        <div>
          <span className="line-clamp-3 text-4xl font-bold">{post.title}</span>
        </div>

        <div>
          <Text size={19} weight="regular">
            {post.excerpt}
          </Text>
        </div>

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
    <Shadow className="border-neutral-5 h-full rounded-[20px] border">
      <Link href={`/blog/${post.slug}`} className="flex h-full w-full flex-col">
        {/* <div className="grid grow grid-rows-[1fr,2fr,1fr] gap-0 p-4"> */}
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

        <div className={'w-full px-2 pb-2'}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            className="aspect-[366/206] h-full w-full rounded-2xl object-cover"
            src={post.feature_image!}
          />
        </div>
      </Link>
    </Shadow>
  )
}

BlogPage.getLayout = AppLayout

export default BlogPage
