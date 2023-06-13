import { Avatar, Text } from '@status-im/components'

import { Breadcrumbs } from '@/components'
import { AppLayout } from '@/layouts/app-layout'
import { getAuthorSlugs, getPostsByAuthorSlug } from '@/lib/ghost'

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
  const slugs = await getAuthorSlugs()

  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<
  {
    authors: PostsOrPages
  },
  Params
> = async context => {
  const posts = await getPostsByAuthorSlug(context.params!.slug)

  if (!posts || !posts.length) {
    return {
      // notFound: true,
      redirect: { destination: '/blog', permanent: false },
    }
  }

  return {
    props: {
      authors: posts,
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const BlogAuthorPage: Page<Props> = ({ authors: posts }) => {
  // todo?: enfore primary tag
  const author = posts[0].primary_author!

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

        <div className="mt-12 grid auto-rows-[1fr] grid-cols-[repeat(auto-fill,minmax(384px,1fr))] gap-5">
          {posts.map(post => (
            <PostCard key={post.id} post={post} showAuthor={false} />
          ))}
        </div>
      </div>
    </div>
  )
}

BlogAuthorPage.getLayout = AppLayout

export default BlogAuthorPage
