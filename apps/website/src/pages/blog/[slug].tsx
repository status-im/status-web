import { createElement, Fragment, useMemo } from 'react'

import { Tag, Text } from '@status-im/components'
import rehypeParse from 'rehype-parse'
import rehypeReact from 'rehype-react'
import { unified } from 'unified'

import { AppLayout } from '@/layouts/app-layout'
import { getPostBySlug, getSlugs } from '@/lib/ghost'

import type { PostOrPage } from '@tryghost/content-api'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  Page,
} from 'next'
import type React from 'react'

type Params = { slug: string }

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const slugs = await getSlugs()

  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<
  {
    post: PostOrPage
  },
  Params
> = async context => {
  const post = await getPostBySlug(context.params!.slug)

  if (!post) {
    return {
      // notFound: true,
      redirect: { destination: '/blog', permanent: false },
    }
  }

  return {
    props: {
      post: {
        ...post,
        jsx: JSON.stringify(r),
      },
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const BlogDetailPage: Page<Props> = ({ post }) => {
  // todo?: MOVE TO SERVER SIDE
  const result = useMemo(() => {
    return unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeReact, {
        createElement,
        Fragment,
        components: {
          a: (props: React.ComponentProps<'a'>) => (
            <a {...props} className="text-customisation-blue-50 underline">
              {props.children!}
            </a>
          ),
          p: ({ children }: React.ComponentProps<'p'>) => (
            <p className="">
              <Text size={19} weight="regular">
                {children}
              </Text>
            </p>
          ),
          img: (props: React.ComponentProps<'img'>) => (
            <img {...props} className="rounded-[20px]" /> // eslint-disable-line jsx-a11y/alt-text
          ),
          h2: ({ children, ...rest }: React.ComponentProps<'h2'>) => (
            <h2 {...rest}>
              <Text size={27}>{children}</Text>
            </h2>
          ),
          ul: (props: React.ComponentProps<'ul'>) => (
            <ul {...props} className="list-inside list-disc" />
          ),
        },
      })
      .processSync(post.html!).result
  }, [post.html])

  return (
    <div className="bg-white-100 min-h-screen">
      <div className="mx-auto max-w-2xl">
        <div className="flex">
          <Tag size={32} label={post.primary_tag!.name!} />
        </div>
        <h1 className="text-6xl">{post.title!}</h1>
      </div>

      <img
        src={post.feature_image!}
        className="mx-auto my-10 rounded-[20px]"
        alt={post.feature_image_alt!}
      />

      <div className="mx-auto grid max-w-2xl gap-4">{result}</div>
    </div>
  )
}

BlogDetailPage.getLayout = AppLayout

export default BlogDetailPage
