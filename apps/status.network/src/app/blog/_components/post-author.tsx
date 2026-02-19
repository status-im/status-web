import Image from 'next/image'
import type { GhostPost } from '../_lib/ghost'

type Author = NonNullable<GhostPost['primary_author']>

type Props = {
  author: Author
  compact?: boolean
}

const FALLBACK_AVATAR = '/blog/avatar.webp'

export function PostAuthor({ author, compact = false }: Props) {
  return (
    <div className="flex items-center gap-1">
      <Image
        src={author.profile_image ?? FALLBACK_AVATAR}
        alt={author.name}
        width={20}
        height={20}
        className="rounded-full"
      />
      <span className={compact ? 'text-13 font-500' : 'text-15 font-600'}>
        {author.name}
      </span>
    </div>
  )
}
