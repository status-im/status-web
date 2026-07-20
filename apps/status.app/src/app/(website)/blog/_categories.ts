export const BLOG_CATEGORIES = {
  news: 'News',
  product: 'Product',
  developers: 'Developers',
  'privacy-security': 'Privacy & Security',
  dapps: 'Dapps',
  community: 'Community',
  keycard: 'Keycard',
} as const

export type BlogCategorySlug = keyof typeof BLOG_CATEGORIES

export const isBlogCategory = (value: string): value is BlogCategorySlug =>
  Object.hasOwn(BLOG_CATEGORIES, value)
