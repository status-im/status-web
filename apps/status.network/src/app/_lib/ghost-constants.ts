export const DEFAULT_GHOST_URL = 'https://our.status.im'

export const DISALLOWED_TAGS = ['desktop-news', 'mobile-news'] as const

export const DISALLOWED_TAGS_FILTER = DISALLOWED_TAGS.map(
  tag => `tag:-${tag}`,
).join('+')

/** Posts rendered at status.network/blog/[slug] */
export const NETWORK_BLOG_TAG = 'status-network-blog'

/** Latest posts on the homepage (EN), linked to status.app */
export const HOMEPAGE_BLOG_TAG = 'status-network'

export const HOMEPAGE_BLOG_LIMIT = 3
