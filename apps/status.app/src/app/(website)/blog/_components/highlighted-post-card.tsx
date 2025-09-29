import { Text } from '@status-im/components'

import { formatDate } from '~app/_utils/format-time'
import { Link } from '~components/link'

import { PostAuthor } from './post-author'
import { PostTag } from './post-tag'

import type { PostOrPage } from '@tryghost/content-api'

type Props = {
  post: PostOrPage
}

export const HighlightedPostCard = (props: Props) => {
  const { post } = props
  const author = post.primary_author!
  const tag = post.primary_tag

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="grid grid-cols-1 gap-5 2xl:grid-cols-3 2xl:gap-7"
    >
      <div className="col-span-2 w-full flex-[2] shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="aspect-[366/206] size-full rounded-16 object-cover"
          src={post.feature_image!}
          alt={post.feature_image_alt!}
        />
      </div>

      <div className="flex flex-[1] flex-col gap-2 xl:py-5 xl:pr-5">
        <div className="h-6 overflow-hidden">
          {tag && <PostTag tag={tag} />}
        </div>

        <div>
          <span className="text-27 font-semibold xl:text-40 xl:font-bold">
            {post.title}
          </span>
        </div>

        <div>
          <Text size={19} weight="regular">
            {post.excerpt}
          </Text>
        </div>

        <div className="mt-auto flex h-5 items-center gap-1">
          <PostAuthor author={author} />
          <Text size={15} color="$neutral-50">
            on {formatDate(new Date(post.published_at!))}
          </Text>
        </div>
      </div>
    </Link>
  )
}
