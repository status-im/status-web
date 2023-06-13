import { createElement, Fragment, useMemo } from 'react'

import { Avatar, Provider, Tag, Text } from '@status-im/components'
import { renderToString } from 'react-dom/server'
import rehypeParse from 'rehype-parse'
import rehypeReact from 'rehype-react'
import { unified } from 'unified'

import { Breadcrumbs } from '@/components'
import { formatDate } from '@/components/chart/utils/format-time'
import { AppLayout } from '@/layouts/app-layout'
import { getPostBySlug, getPostSlugs } from '@/lib/ghost'

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
  const slugs = await getPostSlugs()

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

  const r = unified()
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
            <Text size={27} weight="semibold">
              {children}
            </Text>
          </h2>
        ),
        ul: (props: React.ComponentProps<'ul'>) => (
          <ul {...props} className="list-inside list-disc" />
        ),
      },
    })
    .processSync(post.html!).result

  const html = renderToString(<Provider>{r}</Provider>)

  return {
    props: {
      post: {
        ...post,
        // fixme?: name html
        hhh: html,
      },
    },
  }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const BlogDetailPage: Page<Props> = ({ post }) => {
  const author = post.primary_author!

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
              <Text size={27} weight="semibold">
                {children}
              </Text>
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
    <div className="bg-white-100 mx-1 min-h-[900px] rounded-3xl">
      <div className="border-neutral-10 border-b px-5 py-3">
        {/* fimxe: use title not slug */}
        <Breadcrumbs cutFirstSegment={false} />
      </div>

      <div className="p-5 xl:p-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          <div className="mt-20 flex">
            {post.primary_tag && (
              <Tag size={32} label={post.primary_tag!.name!} />
            )}
          </div>

          <h1 className="text-6xl font-bold">{post.title!}</h1>

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

        <img
          src={post.feature_image!}
          className="mx-auto my-10 aspect-[1456/470] rounded-[20px] object-cover"
          alt={post.feature_image_alt!}
        />

        <div className="relative mx-auto grid max-w-2xl gap-4">
          {result}

          {/* todo?: social, sticky */}

          <div className="flex flex-row gap-2">
            <Avatar
              type="user"
              size={32}
              name={author.name ?? author.slug}
              src={author.profile_image ?? undefined}
            />
            <div className="flex">
              <Text size={15} weight="semibold">
                {author.name ?? author.slug}
              </Text>
              <Text size={15} color="$neutral-50">
                {author.meta_description}
              </Text>
            </div>
          </div>

          {/* todo: social */}
          {/* <div>
            <Text size={15} color="$neutral-50">
              Share article on:
            </Text>
          </div> */}
        </div>
        {/* <div
        className="mx-auto grid max-w-2xl gap-4"
        dangerouslySetInnerHTML={{ __html: post.hhh }}
      /> */}

        {/* todo?: related articles */}
      </div>
    </div>
  )
}

BlogDetailPage.getLayout = AppLayout

export default BlogDetailPage
