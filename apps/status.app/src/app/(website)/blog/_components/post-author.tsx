'use client'

import { Avatar, Text } from '@status-im/components'
import { useRouter } from 'next/navigation'

import type { PostOrPage } from '@tryghost/content-api'

export const PostAuthor = (props: {
  author: NonNullable<PostOrPage['primary_author']>
}) => {
  const { author } = props

  const router = useRouter()

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        router.push(`/blog/author/${author.slug}`)
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault()
          e.stopPropagation()
          router.push(`/blog/author/${author.slug}`)
        }
      }}
      className="flex cursor-pointer gap-1 hover:opacity-[50%]"
    >
      <Avatar
        type="user"
        size="20"
        name={author.name ?? author.slug}
        src={author.profile_image ?? undefined}
      />
      <Text size={15} weight="semibold">
        {author.name ?? author.slug}
      </Text>
    </div>
  )
}
