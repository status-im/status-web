import { Metadata } from '~app/_metadata'
import { formatDate } from '~app/_utils/format-date'
import { jsonLD, JSONLDScript } from '~app/_utils/json-ld'
import { Link } from '~components/link'
import { notFound } from 'next/navigation'
import { PostAuthor } from '../_components/post-author'
import { PostCard } from '../_components/post-card'
import { getPostBySlug, getPostsByTagSlug, getPostSlugs } from '../_lib/ghost'
import { getPostFAQItems } from '../_utils/faq'

export const revalidate = 3600 // 1 hour
export const dynamicParams = true

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return Metadata({
      title: 'Post not found',
      robots: {
        index: false,
      },
    })
  }

  return Metadata({
    title: post.title,
    description: post.excerpt ?? undefined,
    pathname: `/blog/${slug}`,
    openGraph: {
      type: 'article',
      title: post.og_title ?? post.title,
      description: post.og_description ?? post.excerpt ?? undefined,
      images: post.og_image ?? post.feature_image ?? undefined,
    },
  })
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return notFound()
  }

  const faqItems = getPostFAQItems(
    post.codeinjection_head,
    post.codeinjection_foot,
  )

  const relatedPosts = post.primary_tag?.slug
    ? (await getPostsByTagSlug(post.primary_tag.slug, 5)).filter(
        item => item.slug !== post.slug,
      )
    : []

  const articleSchema = jsonLD.article({
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.feature_image ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at ?? post.published_at ?? undefined,
    author: post.primary_author
      ? {
          name: post.primary_author.name,
          type: 'Person',
        }
      : undefined,
    publisher: {
      name: 'Status Network',
      logo: 'https://status.network/logo.svg',
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

  const encodedUrl = encodeURIComponent(
    `https://status.network/blog/${post.slug}`,
  )
  const image = post.feature_image ?? '/blog/linea.jpg'

  return (
    <>
      <JSONLDScript
        schema={faqSchema ? [articleSchema, faqSchema] : articleSchema}
      />

      <div className="mx-auto w-full max-w-[1184px] px-5 pb-16 pt-10 xl:pb-24 xl:pt-16">
        <div className="mb-8 text-13 text-neutral-50">
          <Link href="/blog" className="hover:text-neutral-100">
            Blog
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
            on {formatDate(post.published_at ?? new Date().toISOString())}
          </span>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={post.feature_image_alt ?? post.title}
          className="mb-8 aspect-[374/182] size-full rounded-20 object-cover xl:aspect-[1456/470]"
        />

        <article
          className={[
            'text-19 text-neutral-100',
            '[&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-27 [&_h2]:font-600',
            '[&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-19 [&_h3]:font-600',
            '[&_h4]:mb-2 [&_h4]:mt-6 [&_h4]:text-15 [&_h4]:font-600',
            '[&_p]:mt-5 [&_p]:text-19 [&_p]:leading-[1.7]',
            '[&_a]:text-sky hover:[&_a]:underline',
            '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-6',
            '[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-6',
            '[&_li]:mt-2',
            '[&_blockquote]:mt-6 [&_blockquote]:border-l [&_blockquote]:border-dashed [&_blockquote]:border-neutral-30 [&_blockquote]:pl-5',
            '[&_img]:my-8 [&_img]:rounded-16',
            '[&_pre]:mt-6 [&_pre]:overflow-x-auto [&_pre]:rounded-12 [&_pre]:bg-neutral-100 [&_pre]:p-4 [&_pre]:text-13 [&_pre]:text-white-100',
            '[&_code]:rounded [&_code]:bg-neutral-10 [&_code]:px-1 [&_code]:py-[2px] [&_code]:text-15',
            '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
          ].join(' ')}
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
            Share article on:
          </span>
          <div className="mt-2 flex gap-4 text-15 text-neutral-80/60">
            <a
              href={`https://twitter.com/intent/tweet?text=${post.title}&url=${encodedUrl}`}
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

      {relatedPosts.length > 0 && (
        <div className="border-t border-neutral-10 bg-neutral-10 px-5 pb-16 pt-10 xl:pb-24">
          <div className="mx-auto w-full max-w-[1184px]">
            <h2 className="mb-6 text-27 font-600">Related articles</h2>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {relatedPosts.slice(0, 4).map(item => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
