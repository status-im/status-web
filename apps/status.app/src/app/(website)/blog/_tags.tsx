import { Icon } from '~components/assets/icon'

import { BLOG_CATEGORIES } from './_categories'

export type { BlogCategorySlug as SLUGS } from './_categories'

export const TAGS = {
  news: {
    slug: 'news',
    name: BLOG_CATEGORIES.news,
    icon: <Icon id="Blog/Icons/01_News_and_Announcements:192:192" size={20} />,
  },
  product: {
    slug: 'product',
    name: BLOG_CATEGORIES.product,
    icon: <Icon id="Blog/Icons/02_Product:192:192" size={20} />,
  },
  developers: {
    slug: 'developers',
    name: BLOG_CATEGORIES.developers,
    icon: <Icon id="Blog/Icons/03_Developers:192:192" size={20} />,
  },
  'privacy-security': {
    slug: 'privacy-security',
    name: BLOG_CATEGORIES['privacy-security'],
    icon: <Icon id="Blog/Icons/04_Privacy_and_Security:192:192" size={20} />,
  },
  dapps: {
    slug: 'dapps',
    name: BLOG_CATEGORIES.dapps,
    icon: <Icon id="Blog/Icons/05_Dapps:192:192" size={20} />,
  },
  community: {
    slug: 'community',
    name: BLOG_CATEGORIES.community,
    icon: <Icon id="Blog/Icons/06_Community:192:192" size={20} />,
  },
  keycard: {
    slug: 'keycard',
    name: BLOG_CATEGORIES.keycard,
    icon: <Icon id="Blog/Icons/07_Keycard:192:192" size={20} />,
  },
} as const
