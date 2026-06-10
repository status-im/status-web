'use client'

import {
  BLOG_ARTICLE_CLASS_NAMES,
  blogPostDetailEqual,
  type BlogPostDetail,
} from '~app/_lib/blog-post-detail'
import { getPostFAQItems } from '~app/_lib/faq'
import {
  canRefreshBlogFromClient,
  fetchNetworkBlogPostBySlug,
} from '~app/_lib/ghost-client'
import { formatDate } from '~app/_utils/format-date'
import { Link } from '~components/link'
import { useLocale } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { PostAuthor } from './post-author'

type Labels = {
  breadcrumbBlog: string
  onDate: string
  shareArticleOn: string
}

type Props = {
  slug: string
  initialPost: BlogPostDetail
  labels: Labels
}

export function BlogPostDetailHydrated({ slug, initialPost, labels }: Props) {
  const locale = useLocale()
  const [post, setPost] = useState(initialPost)

  useEffect(() => {
    let cancelled = false

    async function refresh() {
      if (!canRefreshBlogFromClient()) {
        return
      }

      try {
        const fresh = await fetchNetworkBlogPostBySlug(slug)

        if (cancelled || !fresh) {
          return
        }

        setPost(current =>
          blogPostDetailEqual(current, fresh) ? current : fresh,
        )
      } catch {
        // Keep build-time snapshot on failure.
      }
    }

    void refresh()

    return () => {
      cancelled = true
    }
  }, [slug])

  const faqItems = useMemo(
    () => getPostFAQItems(post.codeinjection_head, post.codeinjection_foot),
    [post.codeinjection_head, post.codeinjection_foot],
  )

  const encodedUrl = encodeURIComponent(
    `https://status.network/blog/${post.slug}`,
  )
  const encodedTitle = encodeURIComponent(post.title)
  const image = post.feature_image ?? '/opengraph-image.png'
  const publishedAt = post.published_at ?? new Date().toISOString()

  return (
    <div className="mx-auto w-full max-w-[1184px] px-5 pb-16 pt-10 xl:pb-24 xl:pt-16">
      <div className="mb-8 text-13 text-neutral-50">
        <Link href="/blog" className="hover:text-neutral-100">
          {labels.breadcrumbBlog}
        </Link>
        <span className="mx-2">/</span>
        <span>{post.title}</span>
      </div>

      {post.primary_tag && (
        <div className="mb-4">
          <span className="inline-flex rounded-20 border border-neutral-20 px-2 py-[3px] text-13 font-500">
            {post.primary_tag.name}
          </span>
        </div>
      )}

      <h1 className="mb-4 text-40 font-700 xl:text-64">{post.title}</h1>

      <div className="mb-8 flex flex-wrap items-center gap-2 text-15 text-neutral-50">
        {post.primary_author && (
          <PostAuthor author={post.primary_author} compact />
        )}
        <span>
          {labels.onDate}
          {labels.onDate ? ' ' : ''}
          {formatDate(publishedAt, 'medium', locale)}
        </span>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={post.feature_image_alt ?? post.title}
        className="mb-8 aspect-[374/182] size-full rounded-20 object-cover xl:aspect-[1456/470]"
      />

      <article
        className={BLOG_ARTICLE_CLASS_NAMES}
        dangerouslySetInnerHTML={{ __html: post.html ?? '' }}
      />

      {faqItems.length > 0 && (
        <div className="mt-12 rounded-20 border border-neutral-20 bg-neutral-10 p-5 xl:p-6">
          <h2 className="text-27 font-600">FAQ</h2>
          <div className="mt-5 grid gap-4">
            {faqItems.map((item, index) => (
              <div
                key={`${item.question}-${index}`}
                className="rounded-16 border border-neutral-20 bg-white-100 p-4"
              >
                <h3 className="text-19 font-600">{item.question}</h3>
                <p className="mt-2 whitespace-pre-line text-15 text-neutral-50">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <span className="text-13 font-500 text-neutral-50">
          {labels.shareArticleOn}
        </span>
        <div className="mt-2 flex gap-4 text-15 text-neutral-80/60">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-100"
          >
            Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-100"
          >
            Facebook
          </a>
          <a
            href={`https://linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-100"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  )
}
