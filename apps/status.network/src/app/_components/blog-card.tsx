'use client'

import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { formatDate } from '../_utils/format-date'
import { Link } from './link'

type BlogCardProps = {
  category: string | null
  title: string
  authorName: string | null
  authorAvatar: string | null
  date: string
  image: string
  link: string
}

const FALLBACK_IMAGE = '/opengraph-image.png'

const BlogCard = (props: BlogCardProps) => {
  const { category, title, authorName, authorAvatar, date, image, link } = props
  const locale = useLocale()
  const [imageSrc, setImageSrc] = useState(image || FALLBACK_IMAGE)

  useEffect(() => {
    setImageSrc(image || FALLBACK_IMAGE)
  }, [image])

  return (
    <Link
      href={link}
      className="flex flex-col rounded-20 border border-neutral-10 bg-white-100 shadow-1 transition-all hover:scale-[101%] hover:shadow-2"
    >
      <div className="flex grow flex-col gap-2 p-4">
        {category && (
          <div className="w-fit overflow-hidden rounded-20 border border-neutral-20 px-2 py-[3px] text-13 font-500">
            {category}
          </div>
        )}

        <p className="text-19 font-600">{title}</p>

        <div className="mt-auto flex h-5 items-center gap-1">
          {authorAvatar && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={authorAvatar}
              alt={authorName ?? ''}
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
          {authorName && <p className="text-15 font-600">{authorName}</p>}
          <p className="text-15 text-neutral-50">
            {formatDate(date, 'medium', locale)}
          </p>
        </div>
      </div>

      <div className="w-full px-2 pb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="aspect-[334/188] size-full rounded-16 object-cover"
          src={imageSrc}
          alt={title}
          width={334}
          height={188}
          onError={() => {
            setImageSrc(FALLBACK_IMAGE)
          }}
        />
      </div>
    </Link>
  )
}

export { BlogCard }
export type { BlogCardProps }
