export const ROUTES = {
  Features: [
    { name: 'Communities', href: '/features/communities' },
    { name: 'Messenger', href: '/features/messenger' },
    { name: 'Wallet', href: '/features/wallet' },
    { name: 'Browser', href: '/features/browser' },
  ],
  Platforms: [
    { name: 'Mobile', href: '/platforms/mobile' },
    { name: 'Desktop', href: '/platforms/desktop' },
    { name: 'Web', href: '/platforms/web' },
  ],
  About: [
    { name: 'Mission', href: '/' },
    { name: 'Principles', href: '/' },
    { name: 'Team', href: '/' },
    { name: 'Partners', href: '/' },
    { name: 'Press Kit', href: '/' },
  ],
  Learn: [
    { name: 'Getting Started', href: '/learn/' },
    { name: 'Using Status', href: '/learn/' },
    { name: 'Communities', href: '/learn/' },
    { name: 'Wallet', href: '/learn/' },
    { name: 'Profile', href: '/learn/' },
  ],
  Collaborate: [
    { name: 'Discuss', href: '/' },
    { name: 'Feature upvote', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Translations', href: '/' },
    { name: 'Community groups', href: '/' },
    { name: 'Jobs', href: '/' },
  ],
  Developers: [
    { name: 'Repos', href: 'https://github.com/status-im' },
    { name: 'Insights', href: '/insights' },
    { name: 'Integrations', href: '/' },
  ],
  SNT: [
    { name: 'Token', href: '/' },
    { name: 'Governance', href: '/' },
    { name: 'Curate', href: '/' },
    { name: 'Exchanges', href: '/' },
  ],
} as const

export const SOCIALS = {
  status: {
    name: 'Status',
    href: '<TODO>',
  },
  twitter: {
    name: 'Twitter',
    href: 'https://twitter.com/ethstatus',
  },
  github: {
    name: 'GitHub',
    href: 'https://github.com/status-im',
  },
  youtube: {
    name: 'YouTube',
    href: 'https://youtube.com/<TODO>',
  },
}

export type Routes = (typeof ROUTES)[keyof typeof ROUTES]
