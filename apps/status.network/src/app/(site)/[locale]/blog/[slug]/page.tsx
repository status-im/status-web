import { BlogPostDetailHydrated } from '~app/_components/blog/blog-post-detail-hydrated'
import { PostCard } from '~app/_components/blog/post-card'
import { ghostPostToDetail } from '~app/_lib/blog-post-detail'
import { getCodeInjectionJsonLd, getPostFAQItems } from '~app/_lib/faq'
import { getPostBySlug, getPostsByTagSlug, getPostSlugs } from '~app/_lib/ghost'
import { getNetworkBlogSlugFallback } from '~app/_lib/network-blog-slugs'
import { Metadata } from '~app/_metadata'
import { jsonLD, JSONLDScript } from '~app/_utils/json-ld'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  let slugs = process.env.GHOST_API_KEY ? await getPostSlugs() : []

  if (slugs.length === 0) {
    const fallback = getNetworkBlogSlugFallback()
    if (fallback.length > 0) {
      console.warn(
        'Using content/network-blog-slugs.json fallback for static export. Run `pnpm sync:blog-slugs` after setting Ghost env vars to refresh.',
      )
      slugs = fallback
    }
  }

  if (slugs.length === 0) {
    throw new Error(
      'No status.network blog slugs for static export. Set GHOST_API_KEY in .env.local and run `pnpm build`, or run `pnpm sync:blog-slugs` to populate content/network-blog-slugs.json.',
    )
  }

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
    title: post.meta_title ?? post.title,
    description: post.meta_description ?? post.excerpt ?? undefined,
    pathname: `/blog/${slug}`,
    openGraph: {
      type: 'article',
      title: post.og_title ?? post.title,
      description:
        post.og_description ??
        post.meta_description ??
        post.excerpt ??
        undefined,
      images: post.og_image ?? post.feature_image ?? undefined,
    },
  })
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const [post, t] = await Promise.all([getPostBySlug(slug), getTranslations()])

  if (!post) {
    return notFound()
  }

  const faqItems = getPostFAQItems(
    post.codeinjection_head,
    post.codeinjection_foot,
  )

  const customJsonLd = getCodeInjectionJsonLd(
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
    description: post.meta_description ?? post.excerpt ?? undefined,
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

  return (
    <>
      <JSONLDScript
        schema={faqSchema ? [articleSchema, faqSchema] : articleSchema}
      />
      {customJsonLd.map((jsonLdBlock, index) => {
        const safeJsonLd = jsonLdBlock.replace(/</g, '\\u003c')

        return (
          <script
            key={`custom-jsonld-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd }}
          />
        )
      })}
      <BlogPostDetailHydrated
        slug={slug}
        initialPost={ghostPostToDetail(post)}
        labels={{
          breadcrumbBlog: t('blog.breadcrumb_blog'),
          onDate: t('blog.on_date'),
          shareArticleOn: t('blog.share_article_on'),
        }}
      />

      {relatedPosts.length > 0 && (
        <div className="border-t border-neutral-10 bg-neutral-10 px-5 pb-16 pt-10 xl:pb-24">
          <div className="mx-auto w-full max-w-[1184px]">
            <h2 className="mb-6 text-27 font-600">
              {t('blog.related_articles')}
            </h2>
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
