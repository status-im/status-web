import {
  InsightsIcon,
  KeycardIcon,
  MessagesIcon,
  QuillPenIcon,
  ReportingIcon,
  ShopIcon,
  UpvoteIcon,
} from '@status-im/icons/20'

export const INTERNAL_ROUTES = [
  {
    icon: InsightsIcon,
    title: 'Insights',
    description:
      'Streamline project organization with workstreams, epics and repositories.',
    href: '/admin/insights/workstreams',
    rootHref: '/admin/insights',
  },
  {
    icon: ReportingIcon,
    title: 'Reporting',
    // fixme!:
    description:
      'Streamline project organization with workstreams, epics, and repositories.',
    href: '/admin/reporting',
    rootHref: '/admin/reporting',
  },
  {
    icon: KeycardIcon,
    title: 'Keycard',
    description: 'Control and manage keycard devices, databases and firmwares.',
    href: '/admin/keycard/overview',
    rootHref: '/admin/keycard',
  },
] as const

export const EXTERNAL_ROUTES = [
  {
    icon: ShopIcon,
    title: 'Shopify',
    description:
      "Effortlessly manage and enhance you Shopify store's performance.",
    href: 'https://www.shopify.com',
    hrefLabel: 'shopify.com',
  },
  {
    icon: QuillPenIcon,
    title: 'Blog',
    description:
      'Streamline blog content curation and optimization effortlessly.',
    href: 'https://status.app/blog',
    hrefLabel: 'ghost.org',
  },
  {
    icon: MessagesIcon,
    title: 'Forum',
    description:
      'Engage in collaborative discussions and share insights on the forum.',
    href: 'https://discuss.status.app',
    hrefLabel: 'discuss.status.app',
  },
  {
    icon: UpvoteIcon,
    title: 'Upvote',
    description: 'Elevate your favorite features through our upvote platform.',
    href: 'https://status.app/feature-upvote',
    hrefLabel: 'featureupvote.com',
  },
] as const
