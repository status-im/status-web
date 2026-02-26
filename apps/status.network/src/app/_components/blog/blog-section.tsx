import { getLocale, getTranslations } from 'next-intl/server'
import { getLatestPostsByTag } from '../../_lib/ghost'
import { getNaverPosts } from '../../_lib/naver'
import { ButtonLink } from '../button-link'
import { BlogCard } from './blog-card'

const NAVER_BLOG_URL = 'https://blog.naver.com/status_korea'
const STATUS_APP_BLOG_URL = 'https://status.app/blog'
const BLOG_FALLBACK_IMAGE = '/opengraph-image.png'

type CardProps = {
  category: string | null
  title: string
  authorName: string | null
  authorAvatar: string | null
  date: string
  image: string
  link: string
}

type BlogSource = {
  viewBlogHref: string
  getCards: () => Promise<CardProps[]>
}

const DEFAULT_BLOG_SOURCE: BlogSource = {
  viewBlogHref: STATUS_APP_BLOG_URL,
  getCards: getGhostCards,
}

const BLOG_SOURCE_BY_LOCALE: Record<string, BlogSource> = {
  en: DEFAULT_BLOG_SOURCE,
  ko: {
    viewBlogHref: NAVER_BLOG_URL,
    getCards: getNaverCards,
  },
}

const Blog = async () => {
  const [t, locale] = await Promise.all([getTranslations(), getLocale()])
  const blogSource = BLOG_SOURCE_BY_LOCALE[locale] ?? DEFAULT_BLOG_SOURCE
  const cards = await blogSource.getCards()

  if (cards.length === 0) {
    return null
  }

  return (
    <section className="w-full" id="blog">
      <div className="px-5 py-[120px] lg:px-[120px] lg:py-[168px]">
        <div className="mb-6 flex items-center justify-between lg:mb-12">
          <h2 className="text-27 font-600">{t('blog.title')}</h2>
          <ButtonLink variant="white" size="32" href={blogSource.viewBlogHref}>
            {t('blog.view_blog_button')}
          </ButtonLink>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(card => (
            <BlogCard key={card.link} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}

export { Blog }

async function getGhostCards(): Promise<CardProps[]> {
  const posts = await getLatestPostsByTag('status-network', 3)
  return posts.map(post => ({
    category: post.primary_tag?.name ?? null,
    title: post.title,
    authorName: post.primary_author?.name ?? null,
    authorAvatar: post.primary_author?.profile_image ?? null,
    date: post.published_at ?? new Date().toISOString(),
    image: post.feature_image ?? BLOG_FALLBACK_IMAGE,
    link: `${STATUS_APP_BLOG_URL}/${post.slug}`,
  }))
}

async function getNaverCards(): Promise<CardProps[]> {
  const posts = await getNaverPosts(3)
  return posts.map(post => ({
    category: post.category,
    title: post.title,
    authorName: null,
    authorAvatar: null,
    date: post.date,
    image: post.image ?? BLOG_FALLBACK_IMAGE,
    link: post.link,
  }))
}
