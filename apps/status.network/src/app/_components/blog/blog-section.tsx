import { getLocale, getTranslations } from 'next-intl/server'
import { getLatestPostsByTag } from '../../_lib/ghost'
import type { HomepageBlogCard } from '../../_lib/ghost-client'
import {
  HOMEPAGE_BLOG_LIMIT,
  HOMEPAGE_BLOG_TAG,
} from '../../_lib/ghost-constants'
import { getNaverPosts } from '../../_lib/naver'
import { BlogSectionHydrated } from './blog-section-hydrated'

const NAVER_BLOG_URL = 'https://blog.naver.com/status_korea'
const STATUS_APP_BLOG_URL = 'https://status.app/blog'
const BLOG_FALLBACK_IMAGE = '/opengraph-image.png'

type BlogSource = {
  viewBlogHref: string
  source: 'ghost' | 'naver'
  getCards: () => Promise<HomepageBlogCard[]>
}

const DEFAULT_BLOG_SOURCE: BlogSource = {
  viewBlogHref: STATUS_APP_BLOG_URL,
  source: 'ghost',
  getCards: getGhostCards,
}

const BLOG_SOURCE_BY_LOCALE: Record<string, BlogSource> = {
  en: DEFAULT_BLOG_SOURCE,
  ko: {
    viewBlogHref: NAVER_BLOG_URL,
    source: 'naver',
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
    <BlogSectionHydrated
      initialCards={cards}
      source={blogSource.source}
      viewBlogHref={blogSource.viewBlogHref}
      title={t('blog.title')}
      viewBlogLabel={t('blog.view_blog_button')}
    />
  )
}

export { Blog }

async function getGhostCards(): Promise<HomepageBlogCard[]> {
  const posts = await getLatestPostsByTag(
    HOMEPAGE_BLOG_TAG,
    HOMEPAGE_BLOG_LIMIT,
  )
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

async function getNaverCards(): Promise<HomepageBlogCard[]> {
  const posts = await getNaverPosts(HOMEPAGE_BLOG_LIMIT)
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
