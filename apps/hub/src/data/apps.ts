import type { App } from '~/types/app'

export const apps: App[] = [
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
    isPopular: true,
    isNew: true,
  },
  {
    id: 2,
    name: 'Status Network Bridge',
    category: 'Bridge',
    status: 'Live',
    description: "Saving for gas? We've got you covered!",
    website: 'https://bridge.status.network',
    twitter: 'StatusL2',
    icon: '/apps/status-network-bridge-avatar.png',
    cover: '/apps/status-network-bridge-cover.png',
    isPopular: true,
    isNew: true,
  },
]
