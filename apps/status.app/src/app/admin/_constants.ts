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
    titleKey: 'insights',
    descriptionKey: 'insightsDescription',
    href: '/admin/insights/workstreams',
    rootHref: '/admin/insights',
  },
  {
    icon: ReportingIcon,
    titleKey: 'reporting',
    descriptionKey: 'reportingDescription',
    href: '/admin/reporting',
    rootHref: '/admin/reporting',
  },
  {
    icon: KeycardIcon,
    titleKey: 'keycard',
    descriptionKey: 'keycardDescription',
    href: '/admin/keycard/overview',
    rootHref: '/admin/keycard',
  },
] as const

export const EXTERNAL_ROUTES = [
  {
    icon: ShopIcon,
    titleKey: 'shopify',
    descriptionKey: 'shopifyDescription',
    href: 'https://www.shopify.com',
    hrefLabel: 'shopify.com',
  },
  {
    icon: QuillPenIcon,
    titleKey: 'blog',
    descriptionKey: 'blogDescription',
    href: 'https://status.app/blog',
    hrefLabel: 'ghost.org',
  },
  {
    icon: MessagesIcon,
    titleKey: 'forum',
    descriptionKey: 'forumDescription',
    href: 'https://discuss.status.app',
    hrefLabel: 'discuss.status.app',
  },
  {
    icon: UpvoteIcon,
    titleKey: 'upvote',
    descriptionKey: 'upvoteDescription',
    href: 'https://status.app/feature-upvote',
    hrefLabel: 'featureupvote.com',
  },
] as const
