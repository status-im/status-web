import { useMemo } from 'react'

import { Avatar, Button, Shadow, Tag, Text } from '@status-im/components'
import { useInfiniteQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { formatDate } from '@/components/chart/utils/format-time'
import { Link } from '@/components/link'
import { AppLayout, Content } from '@/layouts/app-layout'
import { getPosts } from '@/lib/ghost'

import type { PostOrPage, PostsOrPages } from '@tryghost/content-api'
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  Page,
} from 'next'

const FILTER_TAGS = [
  {
    id: '63b48c62fc2070000104be8c',
    slug: 'news-and-announcements',
    name: 'News & Announcements',
    icon: (
      <Image
        src="/images/tags/news-and-announcements-20x20.png"
        alt="Latest news on Products built by Status Network"
        width={20}
        height={20}
        unoptimized
      />
    ),
  },
  {
    id: '63b48c62fc2070000104bea2',
    slug: 'product',
    name: 'Product',
    icon: (
      <Image
        src="/images/tags/product-20x20.png"
        alt="Latest news on Products built by Status Network"
        width={20}
        height={20}
        unoptimized
      />
    ),
  },
  {
    id: '63b48c62fc2070000104be61',
    slug: 'developers',
    name: 'Developers',
    icon: (
      <Image
        src="/images/tags/developers-20x20.png"
        alt="Latest news on Products built by Status Network"
        width={20}
        height={20}
        unoptimized
      />
    ),
  },
  {
    id: '63b48c62fc2070000104bea4',
    slug: 'privacy-security',
    name: 'Privacy & Security',
    icon: (
      <Image
        src="/images/tags/privacy-security-20x20.png"
        alt="Latest news on Products built by Status Network"
        width={20}
        height={20}
        unoptimized
      />
    ),
  },
  {
    id: '63b48c62fc2070000104be60',
    slug: 'dapps',
    name: 'Dapps',
    icon: (
      <Image
        src="/images/tags/dapps-20x20.png"
        alt="Latest news on Products built by Status Network"
        width={20}
        height={20}
        unoptimized
      />
    ),
  },
  {
    id: '63b48c62fc2070000104be64',
    slug: 'community',
    name: 'Community',
    icon: (
      <Image
        src="/images/tags/community-20x20.png"
        alt="Latest news on Products built by Status Network"
        width={20}
        height={20}
        unoptimized
      />
    ),
  },
]

export const getServerSideProps: GetServerSideProps<{
  posts: PostOrPage[]
  meta: PostsOrPages['meta']
  tag?: string
}> = async ({ query }) => {
  const tag = query?.tag as string | undefined

  const { posts, meta } = await getPosts({ tag })

  return {
    props: {
      posts,
      meta,
      ...(tag && { tag }),
    },
  }
}

type BlogPageProps = InferGetServerSidePropsType<typeof getServerSideProps>

const BlogPage: Page<BlogPageProps> = ({
  posts: initialPosts,
  meta,
  tag: initialTag,
}) => {
  const router = useRouter()
  const tag = (router.query.tag as string | undefined) ?? initialTag

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
    refetchOnWindowFocus: false,
    queryKey: ['posts', tag],
    queryFn: async ({ pageParam: page, queryKey }) => {
      const [, tag] = queryKey

      const response = await getPosts({ page, tag })

      return response
    },
    getNextPageParam: ({ meta }) => meta.pagination.next,
    initialData: {
      pages: [
        {
          posts: initialPosts,
          meta,
        },
      ],
      pageParams: [1],
    },
  })

  const { highlightedPost, visiblePosts } = useMemo(() => {
    const [highlightedPost, ...restPosts] =
      data?.pages.flatMap(page => page.posts) ?? []

    const maxLength = restPosts.length - (restPosts.length % 3) // the number of posts should be divisible by 3
    const visiblePosts = restPosts.slice(0, maxLength)

    return { highlightedPost, visiblePosts }
  }, [data])

  // loading/skeleton if not complete

  return (
    <Content>
      <div className="px-5">
        <div className="mx-auto max-w-[1184px] pb-24 pt-12 lg:pb-32 lg:pt-20">
          <div className="mb-10 grid gap-2">
            <h1 className="text-40 tracking-[-.02em] lg:text-64">Blog.</h1>
            <Text size={19}>Long form articles, thoughts, and ideas.</Text>
          </div>

          <div className="no-scrollbar mr-[-2rem] flex gap-2 overflow-x-scroll pb-12 pr-8 pt-10">
            {FILTER_TAGS.map(filterTag => (
              <div key={filterTag.id} className="shrink-0">
                <Shadow className="rounded-[10px]">
                  <Link
                    href={{ query: { ...router.query, tag: filterTag.slug } }}
                    className="flex h-[32px] items-center gap-2 rounded-[10px] border border-solid border-neutral-10 pl-2 pr-3 data-[active=true]:bg-neutral-10"
                    data-active={filterTag.slug === tag}
                    scroll={false}
                  >
                    {filterTag.icon}
                    <Text size={15}>{filterTag.name}</Text>
                  </Link>
                </Shadow>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-[44px] xl:mb-12">
              {highlightedPost && (
                <HighlightedPostCard post={highlightedPost} />
              )}
            </div>

            <div className="grid auto-rows-[1fr] grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5">
              {visiblePosts &&
                visiblePosts.map(post => (
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
    </Content>
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
          <span className="text-27 lg:text-40">{post.title}</span>
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

BlogPage.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>
}

export default BlogPage
