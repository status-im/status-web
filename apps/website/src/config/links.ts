export const LINKS = {
  Features: [
    { name: 'Communities', href: '/' },
    { name: 'Messenger', href: '/' },
    { name: 'Wallet', href: '/' },
    { name: 'Browser', href: '/' },
  ],
  About: [
    { name: 'Our mission', href: '/' },
    { name: 'Principles', href: '/' },
    { name: 'Team', href: '/' },
    { name: 'Partners', href: '/' },
    { name: 'Press Kit', href: '/' },
  ],
  Help: [
    { name: 'Wallet', href: '/' },
    { name: 'Wallet', href: '/' },
  ],
  Collaborate: [
    { name: 'Wallet', href: '/' },
    { name: 'Wallet', href: '/' },
  ],
  Developers: [
    { name: 'Repos', href: '/' },
    { name: 'Insights', href: '/insights' },
    { name: 'Integrations', href: '/' },
  ],
  SNT: [
    { name: 'Wallet', href: '/' },
    { name: 'Wallet', href: '/' },
  ],
} as const

export type Links = (typeof LINKS)[keyof typeof LINKS]
