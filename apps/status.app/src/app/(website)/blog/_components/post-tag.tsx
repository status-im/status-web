'use client'

import { Tag } from '@status-im/components'

import { useRouter } from '~/i18n/navigation'
import { Link } from '~components/link'

import type { PostOrPage } from '@tryghost/content-api'

type TagProps = React.ComponentProps<typeof Tag>

type Props = {
  tag: NonNullable<PostOrPage['primary_tag']>
  size?: TagProps['size']
  /**
   * Render a real anchor. Off by default because the post cards place this
   * inside their own card-wide `<Link>`, where a nested anchor is invalid
   * HTML. Turn it on anywhere the tag stands on its own, so the tag archive
   * gets a crawlable, middle-clickable, keyboard-reachable link.
   */
  asLink?: boolean
}

export const PostTag = (props: Props) => {
  const { tag, size = '24', asLink = false } = props

  const router = useRouter()
  const href = `/blog/tag/${tag.slug}`
  const label = tag.name ?? tag.slug

  if (asLink) {
    return (
      <div className="flex">
        <Link href={href}>
          <Tag size={size} label={label} />
        </Link>
      </div>
    )
  }

  return (
    <div className="flex">
      <Tag
        size={size}
        label={label}
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.preventDefault()
          e.stopPropagation()

          router.push(href)
        }}
      />
    </div>
  )
}
