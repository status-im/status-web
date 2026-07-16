import { Icon } from '~components/assets/icon'

export const TAGS = {
  news: {
    slug: 'news',
    name: 'News',
    icon: <Icon id="Blog/Icons/01_News_and_Announcements:192:192" size={20} />,
  },
  product: {
    slug: 'product',
    name: 'Product',
    icon: <Icon id="Blog/Icons/02_Product:192:192" size={20} />,
  },
  developers: {
    slug: 'developers',
    name: 'Developers',
    icon: <Icon id="Blog/Icons/03_Developers:192:192" size={20} />,
  },
  'privacy-security': {
    slug: 'privacy-security',
    name: 'Privacy & Security',
    icon: <Icon id="Blog/Icons/04_Privacy_and_Security:192:192" size={20} />,
  },
  dapps: {
    slug: 'dapps',
    name: 'Dapps',
    icon: <Icon id="Blog/Icons/05_Dapps:192:192" size={20} />,
  },
  community: {
    slug: 'community',
    name: 'Community',
    icon: <Icon id="Blog/Icons/06_Community:192:192" size={20} />,
  },
  keycard: {
    slug: 'keycard',
    name: 'Keycard',
    icon: <Icon id="Blog/Icons/07_Keycard:192:192" size={20} />,
  },
} as const

export type SLUGS = keyof typeof TAGS

export const isBlogCategory = (value: string): value is SLUGS => value in TAGS
