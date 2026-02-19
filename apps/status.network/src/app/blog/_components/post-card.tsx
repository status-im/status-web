import { formatDate } from '~app/_utils/format-date'
import { Link } from '~components/link'
import type { GhostPost } from '../_lib/ghost'
import { PostAuthor } from './post-author'

type PostCardProps = {
  post: GhostPost
  showTag?: boolean
  showAuthor?: boolean
}

export function PostCard({
  post,
  showTag = true,
  showAuthor = true,
}: PostCardProps) {
  const author = post.primary_author
  const tag = post.primary_tag
  const image = post.feature_image ?? '/blog/linea.jpg'

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex flex-col rounded-20 border border-neutral-10 bg-white-100 shadow-1 transition-all hover:scale-[101%] hover:shadow-3"
    >
      <div className="flex grow flex-col gap-2 p-4">
        {showTag && (
          <div className="h-6 overflow-hidden">
            {tag && (
              <span className="inline-flex rounded-20 border border-neutral-20 px-2 py-[3px] text-13 font-500">
                {tag.name}
              </span>
            )}
          </div>
        )}

        <p className="text-19 font-600">{post.title}</p>

        {showAuthor && author ? (
          <div className="mt-auto flex items-center gap-1">
            <PostAuthor author={author} />
            <p className="text-15 text-neutral-50">
              on {formatDate(post.published_at ?? new Date().toISOString())}
            </p>
          </div>
        ) : (
          <div className="mt-auto">
            <p className="text-15 text-neutral-50">
              {formatDate(post.published_at ?? new Date().toISOString())}
            </p>
          </div>
        )}
      </div>

      <div className="w-full px-2 pb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="aspect-[334/188] size-full rounded-16 object-cover"
          src={image}
          alt={post.feature_image_alt ?? post.title}
        />
      </div>
    </Link>
  )
}

type HighlightedPostCardProps = {
  post: GhostPost
}

export function HighlightedPostCard({ post }: HighlightedPostCardProps) {
  const author = post.primary_author
  const tag = post.primary_tag
  const image = post.feature_image ?? '/blog/linea.jpg'

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="grid grid-cols-1 gap-5 xl:grid-cols-3 xl:gap-7"
    >
      <div className="col-span-2 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="aspect-[366/206] size-full rounded-16 object-cover"
          src={image}
          alt={post.feature_image_alt ?? post.title}
        />
      </div>

      <div className="flex flex-col gap-2 xl:py-5 xl:pr-5">
        <div className="h-6 overflow-hidden">
          {tag && (
            <span className="inline-flex rounded-20 border border-neutral-20 px-2 py-[3px] text-13 font-500">
              {tag.name}
            </span>
          )}
        </div>

        <p className="text-27 font-600 xl:text-40 xl:font-700">{post.title}</p>
        {post.excerpt && (
          <p className="text-19 text-neutral-80/60">{post.excerpt}</p>
        )}

        {author && (
          <div className="mt-auto flex items-center gap-1">
            <PostAuthor author={author} />
            <p className="text-15 text-neutral-50">
              on {formatDate(post.published_at ?? new Date().toISOString())}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}
