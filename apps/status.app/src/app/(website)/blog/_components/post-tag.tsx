'use client'

import { Tag } from '@status-im/components'
import { useRouter } from 'next/navigation'

import type { PostOrPage } from '@tryghost/content-api'

type TagProps = React.ComponentProps<typeof Tag>

type Props = {
  tag: NonNullable<PostOrPage['primary_tag']>
  size?: TagProps['size']
}

export const PostTag = (props: Props) => {
  const { tag, size = '24' } = props

  const router = useRouter()

  return (
    <div className="flex">
      <Tag
        size={size}
        label={tag.name ?? tag.slug}
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.preventDefault()
          e.stopPropagation()

          router.push(`/blog/tag/${tag.slug}`)
        }}
      />
    </div>
  )
}
