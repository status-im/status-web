import { getTranslations } from 'next-intl/server'
import { getLatestPostsByTag } from '../blog/_lib/ghost'
import { BlogCard } from './blog-card'
import { ButtonLink } from './button-link'

const Blog = async () => {
  const [t, posts] = await Promise.all([
    getTranslations(),
    getLatestPostsByTag('status-network', 3),
  ])

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="w-full" id="blog">
      <div className="px-5 py-[120px] lg:px-[120px] lg:py-[168px]">
        <div className="mb-6 flex items-center justify-between lg:mb-12">
          <h2 className="text-27 font-600">{t('blog.title')}</h2>
          <ButtonLink variant="white" size="32" href="/blog">
            {t('blog.view_blog_button')}
          </ButtonLink>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <BlogCard
              key={post.id}
              category={post.primary_tag?.name ?? null}
              title={post.title}
              authorName={post.primary_author?.name ?? null}
              authorAvatar={post.primary_author?.profile_image ?? null}
              date={post.published_at ?? new Date().toISOString()}
              image={post.feature_image ?? '/blog/linea.jpg'}
              link={`/blog/${post.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export { Blog }
