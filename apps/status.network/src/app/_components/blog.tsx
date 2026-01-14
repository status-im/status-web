'use client'

import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { formatDate } from '../_utils/format-date'
import { ButtonLink } from './button-link'
import { Link } from './link'

const Blog = () => {
  const t = useTranslations()

  const POSTS: BlogPost[] = [
    {
      category: t('blog.category.translation'),
      title: t('blog.post_1.title.translation'),
      author: {
        name: t('blog.author.translation'),
        avatar: '/blog/avatar.webp',
      },
      date: '2025-07-29',
      image: '/blog/consortium.png',
      link: 'https://status.app/blog/status-steps-up-as-founding-member-of-linea-consortium',
    },
    {
      category: t('blog.category.translation'),
      title: t('blog.post_2.title.translation'),
      author: {
        name: t('blog.author.translation'),
        avatar: '/blog/avatar.webp',
      },
      date: '2025-07-09',
      image: '/blog/gasless.png',
      link: 'https://status.app/blog/status-network-first-gasless-l2',
    },
    {
      category: t('blog.category.translation'),
      title: t('blog.post_3.title.translation'),
      author: {
        name: t('blog.author.translation'),
        avatar: '/blog/avatar.webp',
      },
      date: '2024-07-30',
      image: '/blog/staking.jpg',
      link: 'https://status.app/blog/snt-staking-and-status-network',
    },
  ]

  return (
    <section className="w-full" id="blog">
      <div className="px-5 py-[120px] lg:px-[120px] lg:py-[168px]">
        <div className="mb-6 flex items-center justify-between lg:mb-12">
          <h2 className="text-27 font-600">{t('blog.title.translation')}</h2>
          <ButtonLink variant="white" size="32" href="https://status.app/blog">
            {t('blog.view_blog_button.translation')}
          </ButtonLink>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map(post => (
            <BlogCard key={post.title} {...post} />
          ))}
        </div>
      </div>
    </section>
  )
}

export { Blog }

type BlogPost = {
  category: string
  title: string
  author: {
    name: string
    avatar: string
  }
  date: Date | string
  image: string
  link: string
}

const BlogCard = (props: BlogPost) => {
  const { author, category, date, image, link, title } = props
  const locale = useLocale()
  const t = useTranslations()

  return (
    <Link
      href={link}
      className="flex flex-col rounded-20 border border-neutral-10 bg-white-100 shadow-1 transition-all hover:scale-[101%] hover:shadow-2"
    >
      <div className="flex grow flex-col gap-2 p-4">
        <div className="w-fit overflow-hidden rounded-20 border border-neutral-20 px-2 py-[3px] text-13 font-500">
          {category}
        </div>

        <p className="text-19 font-600">{title}</p>

        <div className="mt-auto flex h-5 items-center gap-1">
          <Image
            src={author.avatar}
            alt={author.name}
            width={20}
            height={20}
            className="rounded-full"
          />
          <p className="text-15 font-600">{author.name}</p>
          <p className="text-15 text-neutral-50">
            {t('blog.on_date.translation') &&
              `${t('blog.on_date.translation')} `}
            {formatDate(date, 'medium', locale)}
          </p>
        </div>
      </div>

      <div className="w-full px-2 pb-2">
        <Image
          className="aspect-[334/188] size-full rounded-16 object-cover"
          src={image}
          alt={title}
          width={334}
          height={188}
        />
      </div>
    </Link>
  )
}
