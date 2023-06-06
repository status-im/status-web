import { Button, Shadow, Tag, Text } from '@status-im/components'

import { Link } from '@/components/link'
import { AppLayout } from '@/layouts/app-layout'
import { getPosts } from '@/lib/ghost'

import type { PostOrPage } from '@tryghost/content-api'
import type { GetStaticProps, InferGetStaticPropsType, Page } from 'next'

export const getStaticProps: GetStaticProps<{
  posts: PostOrPage[]
}> = async () => {
  const posts = await getPosts()

  return {
    props: {
      posts,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const BlogPage: Page<Props> = props => {
  const { posts } = props

  return (
    <div className="bg-white-100 mx-1 min-h-[900px] rounded-3xl">
      <div className="mx-auto max-w-[1184px] py-32">
        <div className="grid gap-2">
          <h1 className="text-7xl font-bold">Blog</h1>
          <Text size={19}>Long form articles, thoughts, and ideas.</Text>
        </div>

        <div>
          <div className="mt-16 grid grid-cols-3 gap-5">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <Button variant="outline">Load more posts</Button>
        </div>
      </div>
    </div>
  )
}

type PostCardProps = {
  post: PostOrPage
}

const PostCard = (props: PostCardProps) => {
  const { post } = props

  return (
    <Link href={`/blog/${post.slug}`}>
      <Shadow className="border-neutral-5 rounded-[20px] border">
        <div className="flex flex-col gap-2 p-4">
          <div className="self-start">
            {post.primary_tag && (
              <Tag size={24} label={post.primary_tag.name!} />
            )}
          </div>
          <Text size={19} weight="semibold">
            {post.title}
          </Text>
          <div className="flex gap-1">
            <Text size={15} weight="semibold">
              Status
            </Text>
            <Text size={15} color="$neutral-50">
              on {post.published_at}
            </Text>
          </div>
        </div>
        <div className="px-2 pb-2">
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            className="rounded-2xl"
            style={{
              aspectRatio: '366/206',
              objectFit: 'cover',
            }}
            src={post.feature_image!}
          />
        </div>
      </Shadow>
    </Link>
  )
}

BlogPage.getLayout = AppLayout

export default BlogPage
