import type { App } from '~/types/app'

export const featuredApps: App[] = [
  {
    id: 1,
    name: 'Cat Fishing',
    category: 'Community',
    status: 'Live',
    description: 'You love cats, cats love fish.',
    website: 'https://cats.fishing',
    twitter: 'catsfishings',
    icon: '/apps/cats-fishing-avatar.png',
    cover: '/apps/cats-fishing-cover.png',
  },
  {
    id: 2,
    name: 'Canary',
    category: 'Privacy',
    status: 'Live',
    description: 'Secure unlock of messages when silence hits',
    website: 'https://canaryapp.io',
    twitter: 'Canarysafe',
    icon: '/apps/canary-avatar.png',
    cover: '/apps/canary-cover.jpeg',
    isPopular: true,
    isNew: true,
  },
  {
    id: 3,
    name: 'Ponzi Hero',
    category: 'Gaming',
    status: 'Live',
    description: 'Earn NFTs, have some fun!!',
    website: 'https://www.ponzihero.xyz',
    twitter: 'Splalabs',
    icon: '/apps/ponzi-hero-avatar.png',
    cover: '/apps/ponzi-hero-cover.png',
  },
]
