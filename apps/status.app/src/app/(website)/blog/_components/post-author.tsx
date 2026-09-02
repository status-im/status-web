'use client'

import { Avatar, Text } from '@status-im/components'

import { useRouter } from '~/i18n/navigation'
import { Link } from '~components/link'

import type { PostOrPage } from '@tryghost/content-api'

type Props = {
  author: NonNullable<PostOrPage['primary_author']>
  /**
   * Render a real anchor. Off by default because the post cards place this
   * inside their own card-wide `<Link>`, where a nested anchor is invalid
   * HTML. Turn it on anywhere the byline stands on its own, so the author
   * archive gets a crawlable link instead of a `role="link"` div.
   */
  asLink?: boolean
}

export const PostAuthor = (props: Props) => {
  const { author, asLink = false } = props

  const router = useRouter()
  const href = `/blog/author/${author.slug}`
  const name = author.name ?? author.slug

  const content = (
    <>
      <Avatar
        type="user"
        size="20"
        name={name}
        src={author.profile_image ?? undefined}
      />
      <Text size={15} weight="semibold">
        {name}
      </Text>
    </>
  )

  const className = 'flex cursor-pointer gap-1 hover:opacity-[50%]'

  if (asLink) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        router.push(href)
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault()
          e.stopPropagation()
          router.push(href)
        }
      }}
      className={className}
    >
      {content}
    </div>
  )
}
