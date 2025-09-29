import { Skeleton, Text } from '@status-im/components'

import { formatDate } from '~app/_utils/format-time'
import { Link } from '~components/link'

import { PostAuthor } from './post-author'
import { PostTag } from './post-tag'

import type { PostOrPage } from '@tryghost/content-api'

type PostCardProps = {
  post: PostOrPage
  showTag?: boolean
  showAuthor?: boolean
}

export const PostCard = (props: PostCardProps) => {
  const { post, showTag = true, showAuthor = true } = props
  const author = post.primary_author!
  const tag = post.primary_tag

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex flex-col rounded-20 border border-neutral-10 bg-white-100 shadow-1 transition-all hover:scale-[101%] hover:shadow-3"
    >
      <div className="flex grow flex-col gap-2 p-4">
        {showTag && (
          <div className="h-6 overflow-hidden">
            {tag && <PostTag tag={tag} />}
          </div>
        )}

        <div>
          <Text size={19} weight="semibold">
            {post.title}
          </Text>
        </div>

        {showAuthor ? (
          <div className="mt-auto flex h-5 gap-1">
            <PostAuthor author={author} />
            <Text size={15} color="$neutral-50">
              on {formatDate(new Date(post.published_at!))}
            </Text>
          </div>
        ) : (
          <div className="mt-auto h-5">
            <Text size={15} color="$neutral-50">
              {formatDate(new Date(post.published_at!))}
            </Text>
          </div>
        )}
      </div>

      <div className="w-full px-2 pb-2">
        <img
          className="aspect-[334/188] size-full rounded-16 object-cover"
          src={post.feature_image!}
          alt={post.feature_image_alt!}
        />
      </div>
    </Link>
  )
}

export const PostCardSkeleton = () => (
  <div className="flex flex-col rounded-20 border border-neutral-10 bg-white-100 shadow-1 transition-all hover:scale-[101%] hover:shadow-3">
    <div className="flex grow flex-col gap-[13px] p-4">
      <Skeleton height={24} width={69} />

      <div className="flex flex-col gap-[10px]">
        <Skeleton height={16} width={295} />
        <Skeleton height={16} width={145} />
      </div>

      <div className="flex items-center gap-1 py-px">
        <Skeleton height={20} width={20} />
        <Skeleton height={12} width={65} />
      </div>
    </div>

    <div className="w-full px-2 pb-2">
      <Skeleton className="aspect-[334/188] size-full rounded-16" />
    </div>
  </div>
)
