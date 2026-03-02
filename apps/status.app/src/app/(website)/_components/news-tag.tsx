import { ChevronRightIcon } from '@status-im/icons/16'

import { Link } from '~components/link'

import type { PostOrPage } from '@tryghost/content-api'

type Props = {
  post: PostOrPage
}

export function NewsTag({ post }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="inline-flex h-8 max-w-[320px] select-none items-center gap-2 md:max-w-[425px]"
    >
      <span
        className="inline-flex h-6 shrink-0 items-center rounded-12 px-2 text-11 font-semibold text-white-100"
        style={{
          background:
            'linear-gradient(78deg, #2A799B -30%, #F6B03C 8%, #FF33A3 98%)',
        }}
      >
        NEW
      </span>
      <span className="line-clamp-1 min-w-0 truncate text-13 font-medium text-white-100">
        {post.title}
      </span>
      <ChevronRightIcon className="shrink-0 text-white-40" />
    </Link>
  )
}
