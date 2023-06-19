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
          <a {...props}>
            <Text size={19} weight="regular" color="$blue-50">
              {props.children!}
            </Text>
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
          <ul {...props} className="list-inside list-disc leading-[26px]" />
        ),
        figure: (props: React.ComponentProps<'figure'>) => (
          <figure {...props} className="leading-[26px]" />
        ),
        pre: (props: React.ComponentProps<'pre'>) => (
          <pre {...props} className="overflow-scroll" />
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
            <a {...props}>
              <Text size={19} weight="regular" color="$blue-50">
                {props.children!}
              </Text>
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
            <ul {...props} className="list-inside list-disc leading-[26px]" />
          ),
          figure: (props: React.ComponentProps<'figure'>) => (
            <figure {...props} className="leading-[26px]" />
          ),
          pre: (props: React.ComponentProps<'pre'>) => (
            <pre {...props} className="overflow-scroll" />
          ),
        },
      })
      .processSync(post.html!).result
  }, [post.html])

  return (
    <div className="min-h-[900px] rounded-3xl bg-white-100 lg:mx-1">
      <div className="border-b border-neutral-10 px-5 py-[13px]">
        <Breadcrumbs cutFirstSegment={false} />
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-3 px-5 pb-6 pt-12 lg:pt-20">
        <div className="flex">
          {post.primary_tag && (
            <Tag size={32} label={post.primary_tag!.name!} />
          )}
        </div>

        <h1 className="text-[40px] font-bold leading-[44px] tracking-[-.02em] lg:text-[64px] lg:leading-[68px]">
          {post.title!}
        </h1>

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

      <div className="w-full px-2 py-4 lg:px-6 lg:py-10">
        <img
          src={post.feature_image!}
          className="aspect-[374/182] h-full w-full rounded-[20px] object-cover lg:aspect-[1456/470]"
          alt={post.feature_image_alt!}
        />
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-12 px-5 py-6">
        {result}
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-[17px] px-5 py-6">
        <div className="flex flex-row items-center gap-2">
          <Avatar
            type="user"
            size={32}
            name={author.name ?? author.slug}
            src={author.profile_image ?? undefined}
          />
          <div className="flex flex-col">
            <Text size={15} weight="semibold">
              {author.name ?? author.slug}
            </Text>
            <Text size={13} color="$neutral-50">
              {author.meta_description}
            </Text>
          </div>
        </div>
      </div>

      {/* <div
        className="mx-auto grid max-w-2xl gap-4"
        dangerouslySetInnerHTML={{ __html: post.hhh }}
      /> */}
    </div>
  )
}

BlogDetailPage.getLayout = AppLayout

export default BlogDetailPage
