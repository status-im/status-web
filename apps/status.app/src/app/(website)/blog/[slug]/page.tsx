import { type ReactElement } from 'react'

import { Avatar, Text } from '@status-im/components'
import {
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from '@status-im/icons/social'
import { notFound } from 'next/navigation'
import production from 'react/jsx-runtime'
import rehypeParse from 'rehype-parse'
import rehypeReact, { type Options } from 'rehype-react'
import { unified } from 'unified'

import { jsonLD, JSONLDScript } from '~/utils/json-ld'
import { Metadata } from '~app/_metadata'
import { formatDate } from '~app/_utils/format-time'
import { Body } from '~components/body'
import { Breadcrumbs } from '~components/breadcrumbs'
import { blogComponents } from '~components/content'
import { baseUrl } from '~website/_lib/base-url'
import {
  DISALLOWED_TAGS,
  getPostBySlug,
  getPostsByTagSlug,
  getPostSlugs,
} from '~website/_lib/ghost'
import { PostAuthor } from '~website/blog/_components/post-author'
import { PostCard } from '~website/blog/_components/post-card'
import { PostTag } from '~website/blog/_components/post-tag'
import { getPostFAQItems } from '~website/blog/_utils/faq'

import type { PostOrPage } from '@tryghost/content-api'

export const revalidate = 3600 // 1 hour
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map(slug => ({ slug })) satisfies Array<
    Awaited<Promise<Props['params']>>
  >
}

export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug
  const post = await getPostBySlug(slug)

  if (!post) {
    return Metadata({
      title: 'Post not found',
    })
  }

  return Metadata({
    title: post.title!,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.og_title ?? undefined,
      description: post.og_description ?? undefined,
      images: [post.og_image ?? post.feature_image!],
    },
  })
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function BlogDetailPage(props: Props) {
  const { params } = props

  const post = await getPostBySlug((await params).slug)

  if (!post) {
    return notFound()
  }

  if (post.primary_tag && DISALLOWED_TAGS.includes(post.primary_tag.slug)) {
    return notFound()
  }

  let relatedPosts: PostOrPage[] = []
  if (post.primary_tag) {
    const response = await getPostsByTagSlug(post.primary_tag.slug)

    if (response) {
      const filteredPosts = response.posts
        .filter(p => p.slug !== post.slug)
        .slice(0, 4)
      relatedPosts = filteredPosts
    }
  }

  const rehypeReactOptions: Options = {
    ...production,
    components: blogComponents,
  }

  const { result } = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeReact, rehypeReactOptions)
    .process(post.html!)

  const content = result as ReactElement

  // root
  const breadcrumbs = [
    {
      label: 'Blog',
      href: '/blog',
    },
    {
      label: post.title!,
      href: `/blog/${post.slug}`,
    },
  ]

  if (post.primary_tag) {
    breadcrumbs.splice(1, 0, {
      label: post.primary_tag.name ?? post.primary_tag.slug,
      href: `/blog/tag/${post.primary_tag.slug}`,
    })
  }

  const author = post.primary_author!
  const tag = post.primary_tag
  const faqItems = getPostFAQItems(
    post.codeinjection_head,
    post.codeinjection_foot
  )

  // const { asPath } = useRouter()
  const asPath = `/blog/${post.slug}`

  const url = `${baseUrl()}${asPath}`
  const shareUrl = encodeURIComponent(url)
  const articleSchema = jsonLD.article({
    headline: post.title!,
    description: post.excerpt ?? undefined,
    image: post.feature_image ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at ?? post.published_at ?? undefined,
    author: {
      name: author.name ?? author.slug,
      type: 'Person',
    },
    publisher: {
      name: 'Status',
      logo: `${baseUrl()}/logo.svg`,
    },
  })
  const faqSchema =
    faqItems.length > 0
      ? jsonLD.faqPage({
          questions: faqItems.map(item => ({
            question: item.question,
            answer: item.answer,
          })),
        })
      : null

  return (
    <>
      <JSONLDScript
        schema={faqSchema ? [articleSchema, faqSchema] : articleSchema}
      />
      <Body>
        <Breadcrumbs items={breadcrumbs} />

        <div className="container-blog gap-3 pb-6 pt-12 xl:pt-20">
          {tag && <PostTag size="32" tag={tag} />}

          <h1 className="text-40 font-bold xl:text-64">{post.title!}</h1>

          <div className="mt-auto flex h-5 items-center gap-1">
            <PostAuthor author={author} />
            <Text size={15} color="$neutral-50">
              on {formatDate(new Date(post.published_at!))}
            </Text>
          </div>
        </div>

        {post.feature_image && (
          <div className="mx-auto w-full max-w-[1504px] px-1 py-6 xl:px-6 xl:py-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.feature_image}
              className="aspect-[374/182] size-full rounded-20 object-cover xl:aspect-[1456/470]"
              alt={post.feature_image_alt ?? ''}
            />
          </div>
        )}

        {/* Content */}
        <div className="root-content container-blog py-6">{content}</div>

        {faqItems.length > 0 && (
          <div className="container-blog py-6">
            <div className="rounded-20 border border-neutral-20 bg-neutral-5 p-5 xl:p-6">
              <h2 className="text-27 font-semibold">FAQ</h2>
              <div className="mt-5 grid gap-4">
                {faqItems.map((item, index) => (
                  <div
                    key={`${item.question}-${index}`}
                    className="rounded-16 border border-neutral-20 bg-white-100 p-4"
                  >
                    <h3 className="text-19 font-semibold">{item.question}</h3>
                    <p className="mt-2 whitespace-pre-line text-15 text-neutral-50">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="container-blog py-6">
          <div className="mb-4 flex flex-row items-center gap-2">
            <Avatar
              type="user"
              size="32"
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

          <div className="flex gap-3">
            <span className="text-13 font-medium text-neutral-50">
              Share article on:
            </span>
            <a
              href={`https://twitter.com/intent/tweet?text=${post.title}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Twitter"
            >
              <TwitterIcon className="text-neutral-50" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
            >
              <FacebookIcon className="text-neutral-50" />
            </a>
            <a
              href={`https://linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
            >
              <LinkedinIcon className="text-neutral-50" />
            </a>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="border-t border-neutral-10 bg-neutral-5 pb-[64px] pt-12">
            <div className="container-lg">
              <div className="mb-6">
                <Text size={27} weight="semibold">
                  Related articles
                </Text>
              </div>

              <div className="grid gap-5 2md:grid-cols-2 xl:grid-cols-4">
                {relatedPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </div>
        )}
      </Body>
    </>
  )
}
