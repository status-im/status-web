import {
  GithubIcon,
  StatusIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@status-im/icons'

export const ROUTES = {
  Features: [
    { name: 'Communities', href: '/features/communities' },
    { name: 'Create Communiy', href: '/features/create-community' },
    { name: 'Messenger', href: '/features/messenger' },
    { name: 'Wallet', href: '/features/wallet' },
  ],
  Platforms: [
    { name: 'Mobile', href: '/platforms/mobile' },
    { name: 'Desktop', href: '/platforms/desktop' },
    { name: 'Web', href: '/platforms/web' },
    { name: 'Keycard', href: '/keycard' },
  ],
  About: [
    { name: 'Mission', href: '/' },
    { name: 'Principles', href: '/' },
    { name: 'Team', href: '/' },
    { name: 'Brand', href: '/brand' },
  ],
  Help: [
    { name: 'Overview', href: '/help' },
    { name: 'Getting Started', href: '/help/getting-started' },
    { name: 'Messaging', href: '/help/messaging-and-web3-browser' },
    { name: 'Communities', href: '/help/status-communities' },
    { name: 'Wallet', href: '/help/status-wallet' },
    { name: 'Profile', href: '/help/your-profile-and-preferences' },
  ],
  Collaborate: [
    { name: 'Discuss', href: '/' },
    { name: 'Feature upvote', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Translations', href: '/' },
    // { name: 'Community groups', href: '/' },
    { name: 'Jobs', href: '/jobs' },
  ],
  Developers: [
    { name: 'Repos', href: 'https://github.com/status-im' },
    { name: 'Insights', href: '/insights/epics' },
    { name: 'Integrations', href: '/' },
  ],
  SNT: [
    // { name: 'Token', href: '/' },
    { name: 'Governance', href: '/' },
    { name: 'Curate', href: 'https://curate.status.app' },
    // { name: 'Exchanges', href: '/' },
  ],
} as const

// TODO Update icons when available
export const SOCIALS = {
  status: {
    name: 'Status',
    href: 'TODO',
    icon: StatusIcon,
  },
  twitter: {
    name: 'Twitter',
    href: 'https://twitter.com/ethstatus',
    icon: TwitterIcon,
  },
  github: {
    name: 'GitHub',
    href: 'https://github.com/status-im',
    icon: GithubIcon,
  },
  youtube: {
    name: 'YouTube',
    href: 'https://youtube.com/<TODO>',
    icon: YoutubeIcon,
  },
}

export type Routes = (typeof ROUTES)[keyof typeof ROUTES]
