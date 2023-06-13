import { Text } from '@status-im/components'

import { Breadcrumbs } from '@/components'
import { AppLayout } from '@/layouts/app-layout'
import { getPostsByTagSlug, getTagSlugs } from '@/lib/ghost'

import { PostCard } from '..'

import type { PostsOrPages } from '@tryghost/content-api'
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
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<
  {
    posts: PostsOrPages
  },
  Params
> = async context => {
  const posts = await getPostsByTagSlug(context.params!.slug)

  if (!posts || !posts.length) {
    return {
      // notFound: true,
      redirect: { destination: '/blog', permanent: false },
    }
  }

  return {
    props: {
      posts,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const BlogTagPage: Page<Props> = ({ posts }) => {
  const tag = posts[0].primary_tag!

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
          {posts.map(post => (
            <PostCard key={post.id} post={post} showTag={false} />
          ))}
        </div>
      </div>
    </div>
  )
}

BlogTagPage.getLayout = AppLayout

export default BlogTagPage
